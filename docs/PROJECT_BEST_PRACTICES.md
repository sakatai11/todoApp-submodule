# プロジェクトベストプラクティス

## 概要

Next.js Todoアプリケーションにおけるベストプラクティス、CI/CD設定、および品質管理について説明します。効率的な開発と安定したリリースを実現するためのガイドラインです。

## 🎯 開発ベストプラクティス

### テスト戦略

#### テストピラミッド
```
        🎭 E2Eテスト (少数)
       🔗 統合テスト (中程度)
    🧪 ユニットテスト (多数)
```

1. **ユニットテスト**: 基盤となる多数のテスト
2. **統合テスト**: API動作の確実な検証
3. **E2Eテスト**: ユーザー体験の最終確認

#### テストの独立性
- 各テストは他のテストに依存しない
- テスト実行順序に関係なく成功する
- データクリーンアップを確実に実行

### コード品質管理

#### 型安全性の確保
- **TypeScript strict mode**: 厳格な型チェック
- **ESLint準拠**: `@typescript-eslint/no-explicit-any` 規則の適用
- **Zodバリデーション**: API リクエスト/レスポンスの型安全性

#### コーディング規約
- **表記統一ルール**: テスト説明文の一貫した表記（「正常に〜」パターン）
- **統一テストデータ**: サブモジュールのモックデータを全テストで使用
- **コンポーネント設計**: 単一責任の原則に従った設計

## 🏗️ 環境管理ベストプラクティス

### 環境分離戦略

#### 開発環境とテスト環境の分離
- **ポート分離**: 開発用（3000番台）とテスト用（3001番台）
- **データ分離**: 開発データとテストデータの混在防止
- **並行実行**: 開発作業中のテスト実行を可能に

#### Docker最適化
- **軽量化**: `node:18-alpine` ベースで高速起動
- **設定統一**: `firebase.test.json`による統一設定管理
- **シンプル化**: 不要なローカル統合テスト関連ファイルを削除

### データ管理

#### モックデータ戦略
- **サブモジュール統一**: 全テストで統一されたモックデータ使用
- **Firebase Emulator連携**: 実際のEmulatorとの完全統合
- **データクリーンアップ**: テスト後の確実なデータクリア

#### 開発環境とテスト環境の使い分け

**推奨**: 目的に応じて環境を使い分け

##### 開発環境

- **UI開発・単体テスト**: ローカル + MSW (`npm run dev`)
  - MSW（Mock Service Worker）でAPIリクエストをモック
  - 高速な開発サイクルとUIテストに最適
  - 環境変数: `NEXT_PUBLIC_API_MOCKING=enabled`
  - ポート: localhost:3000（App）

- **統合開発・API検証**: Docker + MSW (`npm run docker:dev`)
  - MSWでAPIモック（Firebase Emulatorも起動するが、MSWが優先）
  - 高速な開発サイクルとモックAPIによる開発効率化
  - ポート: localhost:3000（App）, localhost:4000（Emulator UI）
  - モックAPI表示: Mock Mode インジケーター付き

##### テスト環境

- **ユニットテスト**: ローカル + MSW (`npm run test`)
  - MSWでAPIモック、高速テスト実行
  - 統合テスト除外で純粋なユニットテストのみ実行
  - 実行時間: 高速（秒単位）

- **統合テスト**: Docker専用 (`npm run docker:test:run`)
  - Firebase Emulator + Next.js の完全統合環境
  - API CRUD操作の実環境テスト（7テスト、13.03秒で安定実行）
  - 統合テスト専用設定（`vitest.integration.config.ts`）でMSW無効化
  - ポート: localhost:3001（App）, localhost:4001（Emulator UI）

- **E2Eテスト**: Docker + Playwright (`npm run docker:e2e:run`)
  - ブラウザ自動化による完全なユーザーフロー検証
  - Todo機能の包括的なE2Eテスト
  - 実際のブラウザ環境でのインタラクション検証

**注意事項**:
- **開発環境**: MSW有効でモック中心の高速開発
- **テスト環境**: MSW無効でFirebase Emulator専用の実環境テスト
- 開発環境（3000番台）とテスト環境（3001番台）のポート完全分離
- テスト一貫性のため、同じテスト種別では統一データソースを使用

## 📊 CI/CD統合ベストプラクティス

### GitHub Actions推奨構成

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run docker:test:run

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install
      - run: npm run docker:e2e:run

  build:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, e2e-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

### 並列実行戦略

#### テストの並列化
- **ユニットテスト**: 高速で並列実行
- **統合テスト**: Docker環境で独立実行
- **E2Eテスト**: ブラウザ並列で効率化

#### リソース最適化
- **キャッシュ戦略**: `node_modules` と Docker layer の効果的なキャッシュ
- **実行時間短縮**: 必要最小限のテスト実行
- **環境分離**: テスト環境の完全分離による安定性確保

## 🔄 開発ワークフロー

### 推奨開発手順

#### 日常開発サイクル
1. **機能開発**: ローカル環境で開発（`npm run docker:dev`）
2. **ユニットテスト**: `npm run test` で基本動作確認
3. **統合テスト**: `npm run docker:test:run` でAPI動作確認
4. **E2Eテスト**: `npm run docker:e2e:run` で最終確認
5. **コミット**: 全テスト成功後にコミット

#### プルリクエスト手順
1. **ブランチ作成**: `feature/` または `fix/` プレフィックス
2. **開発完了**: 全テスト成功を確認
3. **PR作成**: 適切な説明とテスト結果を記載
4. **CI確認**: GitHub Actions の全テスト成功を確認
5. **レビュー**: コードレビュー完了後マージ

### コミット戦略

#### コミットメッセージ規約
```
type(scope): description

feat(api): Todo APIの削除機能を追加
fix(ui): ドラッグ&ドロップの表示バグを修正
test(integration): Docker統合テストを追加
docs(readme): セットアップ手順を更新
```

## 🛡️ 品質保証

### 品質指標

#### テストカバレッジ
- **目標**: 100%カバレッジ維持
- **現状**: 22ファイル、413テスト、全成功
- **監視**: CI/CDでのカバレッジ低下検知

#### パフォーマンス指標
- **統合テスト実行時間**: 3.51秒（高速実行を実現）
- **ビルド時間**: 最適化されたDocker layer利用
- **E2Eテスト**: 効率的なテストシナリオ設計

### セキュリティ

#### API設計
- **認証ミドルウェア**: `withAuthenticatedUser` の型安全な実装
- **Firebase Admin SDK**: サーバーサイド認証とデータベース操作の統合
- **エラーハンドリング**: 適切なHTTPステータスコードと詳細なエラーメッセージ

#### データ保護
- **環境変数管理**: 機密情報の適切な管理
- **アクセス制御**: ロールベースアクセス制御の実装
- **通信暗号化**: HTTPS通信の強制

## 📈 継続的改善

### モニタリング

#### 開発効率の測定
- **テスト実行時間**: 各テスト種別の実行時間監視
- **ビルド時間**: CI/CDパイプラインの効率化
- **デバッグ時間**: 問題解決にかかる時間の最小化

#### 品質指標の追跡
- **バグ発生率**: リリース後のバグ報告数
- **テスト成功率**: CI/CDでのテスト成功率
- **カバレッジ変化**: コードカバレッジの推移

### 改善サイクル

#### 定期的な見直し
- **月次レビュー**: 開発プロセスの効率性評価
- **四半期改善**: ツールチェーンの更新と最適化
- **年次戦略**: 技術スタックの見直しと更新

## 📋 関連ドキュメント

- [test/UT_TEST.md](test/UT_TEST.md) - ユニットテストガイド
- [test/IT_TEST.md](test/IT_TEST.md) - 統合テスト環境選択ガイド
- [test/E2E_TEST.md](test/E2E_TEST.md) - E2Eテストガイド
- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [DOCKER_DEVELOPMENT.md](DOCKER_DEVELOPMENT.md) - Docker開発環境

---

**💡 まとめ**: これらのベストプラクティスにより、高品質で保守性の高いアプリケーション開発を継続的に実現できます。