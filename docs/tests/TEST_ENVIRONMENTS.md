# テスト環境ガイドライン

## 概要

このドキュメントでは、TodoApp-Nextにおけるテスト種別ごとの推奨実行環境について説明します。効率的な開発とテスト品質の両立を目指した最適なアプローチを提供します。

## 🧪 テスト種別と推奨実行環境

### 📊 推奨アプローチ一覧

| テスト種別 | 推奨実行環境 | コマンド | 理由 |
|-----------|-------------|----------|------|
| **ユニットテスト** | ローカル環境 | `npm run test` | 高速性・開発効率 |
| **統合テスト** | Docker環境 | `npm run docker:test:run` | 実環境での動作保証 |
| **E2Eテスト** | Docker環境またはローカル環境 | `npm run test:e2e` / `npm run docker:e2e:run` | 柔軟性 |

## 🔬 ユニットテスト - ローカル環境推奨

### 実行コマンド
```bash
# ユニットテストの実行
npm run test

# UIモードでの実行
npm run test:ui

# カバレッジ付き実行
npm run test:coverage
```

### 推奨理由
- ⚡ **高速実行**: Docker起動のオーバーヘッドなし
- 🔄 **即座のフィードバック**: ファイル変更時の自動再実行
- 💻 **開発効率**: IDEとの統合による快適な開発体験
- 🎯 **単体テストの本質**: 外部依存を排除した純粋なロジックテスト

### 適用範囲
- コンポーネントの描画テスト
- フック（Hooks）の動作テスト
- ユーティリティ関数のテスト
- Context APIの状態管理テスト

## 🔗 統合テスト - Docker環境専用

### 実行コマンド
```bash
# Docker統合テストの実行
npm run docker:test:run

# テスト環境の起動（手動テスト用）
npm run docker:test

# テスト環境の停止
npm run docker:test:down
```

### 推奨理由
- 🏗️ **実環境再現**: Firebase EmulatorとNext.jsの完全統合
- 🔒 **MSW無効化**: 統合テスト専用設定（`vitest.integration.config.ts`）でMock Service Workerを自動停止し、実際のAPI通信を実現
- 📊 **データ整合性**: 実際のデータベース操作による確実な検証
- 🌐 **ネットワーク分離**: テスト専用環境による安定した実行

### 適用範囲
- Todo/Lists APIのCRUD操作
- Firebase Emulatorとの通信テスト
- 認証フローの統合テスト
- データベース操作の整合性確認

### 技術詳細
- **MSW自動無効化**: Docker環境でMock Service Workerを自動停止
- **タイムアウト最適化**: データベース初期化を30秒に延長
- **ポート分離**: 開発環境（3000番台）とテスト環境（3001番台）を分離

## 🎭 E2Eテスト - 柔軟な実行環境

### 実行コマンド
```bash
# ローカル環境でのE2Eテスト
npm run test:e2e

# E2EテストのUIモード
npm run test:e2e:ui

# Docker環境でのE2Eテスト
npm run docker:e2e:run
```

### 環境選択の指針

#### ローカル環境での実行が適している場合
- 🚀 **開発中のテスト**: 素早いフィードバックが必要
- 🐛 **デバッグ作業**: ブラウザの開発者ツールを活用
- 🔍 **テストケース作成**: Playwrightの録画機能を使用

#### Docker環境での実行が適している場合
- ✅ **CI/CD環境**: 継続的インテグレーションでの自動実行
- 🏗️ **本番環境再現**: より本番に近い環境でのテスト
- 👥 **チーム共有**: 環境差異を排除した一貫したテスト実行

## 🎯 ベストプラクティス

### 開発フロー
1. **ユニットテスト**: ローカル環境で高速に実行し、基本機能を確認
2. **統合テスト**: Docker環境で実際のAPI動作を検証
3. **E2Eテスト**: 必要に応じてローカルまたはDockerで実行

### CI/CD環境
```yaml
# 推奨のGitHub Actions構成例
- name: Run Unit Tests
  run: npm run test:coverage

- name: Run Integration Tests
  run: npm run docker:test:run

- name: Run E2E Tests
  run: npm run docker:e2e:run
```

### パフォーマンス最適化
- **並行実行**: ユニットテストと統合テストの並行実行が可能
- **環境分離**: 開発作業中でもテストが実行可能
- **リソース効率**: 必要最小限のDocker環境を起動

## 🔄 環境切り替えガイド

### 開発中の典型的なワークフロー
1. **コード修正**: 機能追加・バグ修正
2. **ユニットテスト**: `npm run test` でローカル実行
3. **統合テスト**: `npm run docker:test:run` で実環境確認
4. **E2Eテスト**: 必要に応じて `npm run docker:e2e:run` で最終確認

### トラブルシューティング時
1. **ローカルテスト失敗**: コンポーネント・ロジックの問題
2. **統合テスト失敗**: API・データベース・設定の問題
3. **E2Eテスト失敗**: UI・UX・統合機能の問題

## 📋 関連ドキュメント

- [UT_TEST.md](UT_TEST.md) - ユニットテストガイド
- [IT_TEST.md](IT_TEST.md) - 統合テストガイド
- [E2E_TEST.md](E2E_TEST.md) - E2Eテストガイド
- [../DOCKER_TESTING.md](../DOCKER_TESTING.md) - Docker環境の詳細設定
- [../PRODUCTS.md](../PRODUCTS.md) - プロジェクト全体構造
- [../../../tests/CLAUDE.md](../../../tests/CLAUDE.md) - テスト実装ガイドライン

---

**💡 まとめ**: 各テスト種別の特性を活かした適切な環境選択により、開発効率とテスト品質の両立を実現できます。