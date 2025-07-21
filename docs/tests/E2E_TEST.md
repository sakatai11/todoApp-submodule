# E2Eテストガイド

## 概要

Next.js TodoアプリケーションのE2E（End-to-End）テストの実行方法と環境選択について説明します。PlaywrightによるブラウザテストでTodo機能全体の動作を検証します。

## 🎭 E2Eテストの対象

### テスト対象機能
- **Todo機能全フロー**: 作成→編集→削除→ピン留め
- **ドラッグ&ドロップ**: @dnd-kit による並び替え
- **レスポンシブ対応**: モバイル/デスクトップ表示
- **認証フロー**: NextAuth.js + Firebase Admin SDK
- **リアルタイム同期**: Firebase Emulatorとの実データ連携

### テスト実行結果
- **ブラウザ操作 ↔ DB反映確認**: 実際のユーザー操作からデータベース更新まで
- **UI/UX検証**: ユーザーインターフェースの動作確認
- **統合機能テスト**: フロントエンドとバックエンドの統合動作

## 🚀 E2Eテストの実行方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install
```

### 🌐 2. ローカル環境での実行

```bash
# E2Eテストの実行
npm run test:e2e

# E2EテストのUIモード（推奨：デバッグ用）
npm run test:e2e:ui
```

#### ローカル環境のメリット
- ⚡ **高速実行**: 素早いフィードバック
- 🐛 **デバッグ作業**: ブラウザ開発者ツールを活用
- 🔍 **テスト作成**: Playwrightの録画機能を使用
- 👀 **リアルタイム確認**: テスト実行をリアルタイムで観察

### 🐳 3. Docker環境での実行

```bash
# Dockerコンテナ内でE2Eテストを実行
npm run docker:e2e:run
```

#### Docker環境のメリット
- ✅ **CI/CD環境**: 継続的インテグレーションでの自動実行
- 🏗️ **本番環境再現**: より本番に近い環境でのテスト
- 👥 **チーム共有**: 環境差異を排除した一貫したテスト実行
- 🔒 **環境分離**: 他の開発作業から独立したテスト実行

## 🎯 環境選択の指針

### ローカル環境が適している場合
- **開発中のテスト**: 新機能の動作確認
- **デバッグ作業**: テスト失敗の原因調査
- **テストケース作成**: 新しいテストシナリオの作成
- **高速フィードバック**: 短いサイクルでの確認

### Docker環境が適している場合
- **CI/CD環境**: 自動テストパイプライン
- **本番検証**: 本番環境に近い条件でのテスト
- **チーム作業**: 環境の一貫性が重要な場合
- **最終確認**: リリース前の包括的検証

## ⚙️ E2Eテスト設定

### 📝 Playwright設定

E2Eテストの設定は `playwright.config.ts` で管理されています：

- **ブラウザ設定**: Chromium、Firefox、WebKit対応
- **テストタイムアウト**: 適切な待機時間設定
- **並列実行**: 複数テストの同時実行
- **レポート**: 詳細なテスト結果レポート

### 🗄️ テストデータ管理

E2Eテストでは以下のデータ管理方法を使用：

- **Firebase Emulator**: テスト専用のデータベース環境
- **サブモジュールデータ**: 統一されたテストデータ
- **テストフィクスチャ**: 再現可能なテストシナリオ

## 🔄 E2Eテストワークフロー

### 開発時の典型的な実行パターン

1. **ローカル開発**: `npm run test:e2e:ui` でUIモードで確認
2. **機能完成**: `npm run test:e2e` で全テスト実行
3. **CI/CD**: `npm run docker:e2e:run` で自動テスト
4. **リリース前**: 全環境でのE2Eテスト実行

### 他のテストとの連携

- **ユニットテスト**: `npm run test` でコンポーネント単体テスト
- **統合テスト**: `npm run docker:test:run` でAPI統合テスト
- **E2Eテスト**: 最終的なユーザー体験テスト

## 🎭 テストケースの拡張

### 新しいテストの追加

```bash
# tests/e2e/ ディレクトリに新しい .spec.ts ファイルを追加
tests/e2e/
├── todo-flow.spec.ts        # 既存のTodoフローテスト
└── new-feature.spec.ts      # 新機能のテスト
```

### テストファイルの命名規則

- **ファイル名**: `{feature-name}.spec.ts`
- **テスト説明**: わかりやすい日本語での説明
- **テストケース**: ユーザーストーリーベースのシナリオ

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### ブラウザの起動エラー
```bash
# Playwrightブラウザの再インストール
npx playwright install --force
```

#### テストタイムアウトエラー
- **要素の待機**: 適切な待機条件を設定
- **ネットワーク待機**: APIレスポンスの完了を待機
- **アニメーション**: CSS transitions/animationsの完了を待機

#### Docker環境でのE2Eテスト失敗
```bash
# テスト環境の確認
npm run docker:test  # テスト環境が起動されているか確認

# ログの確認
docker-compose -f docker-compose.test.yml logs
```

## 📊 CI/CD統合

### GitHub Actions設定例

```yaml
# .github/workflows/e2e.yml
- name: Run E2E Tests
  run: |
    npm run docker:test
    npm run docker:e2e:run
    npm run docker:test:down
```

### 並列実行戦略

- **環境分離**: 統合テストとE2Eテストの並列実行
- **ブラウザ並列**: 複数ブラウザでの同時テスト
- **テストスイート分割**: 機能別のテスト分割実行

## 📋 関連ドキュメント

- [TEST_ENVIRONMENTS.md](TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [UT_TEST.md](UT_TEST.md) - ユニットテストガイド
- [IT_TEST.md](IT_TEST.md) - 統合テストガイド
- [../DOCKER_TESTING.md](../DOCKER_TESTING.md) - Docker統合テスト環境
- [../DOCKER_DEVELOPMENT.md](../DOCKER_DEVELOPMENT.md) - Docker開発環境

---

**💡 まとめ**: E2Eテストにより、ユーザー体験の品質を包括的に検証し、リリース前の最終確認を確実に行えます。