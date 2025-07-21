# 統合テスト（Integration Test）ガイド

## 概要

統合テストは、TodoApp-Nextにおいて複数のコンポーネントやサービスが連携して正常に動作することを検証するテストです。Firebase Emulator + Next.js アプリケーションの完全統合環境で実行され、実際のAPI通信を通じてシステム全体の動作を確認します。

## 🏗️ 統合テスト環境の構成

### Docker専用環境

統合テストは**Docker環境でのみ**実行され、以下の完全統合環境で動作します：

- **Firebase Emulator**: Firestore + Auth エミュレーター
- **Next.js App**: 実際のアプリケーション（ポート3001）
- **統合テスト**: Vitest + 専用設定ファイル

### ポート構成

| サービス | ポート | 説明 |
|---------|--------|------|
| Next.js App | `localhost:3001` | テスト用アプリケーション |
| Firebase Emulator UI | `localhost:4001` | Emulator管理画面 |
| Firestore Emulator | `localhost:8081` | データベース |
| Auth Emulator | `localhost:9100` | 認証サービス |

## 🚀 統合テストの実行

### 基本実行

```bash
# 統合テストの実行（推奨）
npm run docker:test:run

# テスト環境の手動起動
npm run docker:test

# テスト環境の停止
npm run docker:test:down
```

### 実行結果例

```bash
✅ Test Files: 1 passed (1)
✅ Tests: 7 passed (7)
⏱️ Duration: 13.03s (Firebase Emulator + Next.js + 統合テスト完全連携)

✅ Todo API統合テスト (6テスト)
  - GET /api/(general)/todos: 認証済みユーザーのTodo取得
  - GET /api/(general)/todos: 未認証ユーザーの401エラー
  - POST /api/(general)/todos: 新規Todo作成（201 Created）
  - POST /api/(general)/todos: 無効データの400エラー
  - PUT /api/(general)/todos: 既存Todo更新
  - DELETE /api/(general)/todos: Todo削除

✅ Lists API統合テスト (1テスト)
  - GET /api/(general)/lists: リスト一覧取得
```

## ⚙️ 統合テスト設定

### 専用設定ファイル

統合テストは専用の設定ファイルを使用します：

- **vitest.integration.config.ts**: 統合テスト専用のVitest設定
- **tests/setup-integration.ts**: 統合テスト用セットアップファイル

### 主要設定内容

```typescript
// vitest.integration.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup-integration.ts'],
    include: ['**/*integration*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    testTimeout: 30000, // Firebase Emulator接続用30秒タイムアウト
  },
});
```

### MSW無効化

統合テストでは、Mock Service Worker（MSW）が自動的に無効化され、Firebase Emulatorとの直接通信を実現：

```typescript
// tests/setup-integration.ts
// MSWサーバーは起動せず、Firebase Emulator接続確認のみ実行
beforeAll(async () => {
  // Firebase Emulator接続確認
  // MSWは完全無効化
});
```

## 📊 テスト対象と範囲

### API統合テスト

#### Todo API（6テスト）
- **GET /api/(general)/todos**
  - 認証済みユーザーのTodoリスト取得
  - 未認証ユーザーの401エラー
- **POST /api/(general)/todos**
  - 新規Todo作成（201 Created）
  - 無効データの400エラー
- **PUT /api/(general)/todos**
  - 既存Todo更新（200 OK）
- **DELETE /api/(general)/todos**
  - 既存Todo削除（200 OK）

#### Lists API（1テスト）
- **GET /api/(general)/lists**
  - 認証済みユーザーのリスト取得

### 認証フロー統合

- **NextAuth.js + Firebase Admin SDK**: カスタム認証プロバイダーの統合
- **テスト認証**: `X-User-ID`ヘッダーによるテストユーザー認証
- **権限制御**: ユーザー固有データの適切な分離

### データベース統合

- **Firestore Emulator**: 実際のデータベース操作
- **データ初期化**: テスト前の確実なデータクリア
- **テストデータ投入**: サブモジュールの統一モックデータ使用

## 🔧 技術詳細

### Docker Compose設定

```yaml
# docker-compose.test.yml
services:
  integration-test:
    command: npx vitest run tests/features/todo/api.integration.test.ts --config vitest.integration.config.ts
    depends_on:
      firebase-emulator-test:
        condition: service_healthy
      nextjs-test:
        condition: service_started
    environment:
      - NODE_ENV=test
      - NEXT_PUBLIC_API_MOCKING=disabled
      - FIRESTORE_EMULATOR_HOST=firebase-emulator-test:8080
      - FIREBASE_AUTH_EMULATOR_HOST=firebase-emulator-test:9099
```

### 環境変数

| 変数名 | 値 | 説明 |
|--------|----|----- |
| `NODE_ENV` | `test` | テスト環境として識別 |
| `NEXT_PUBLIC_API_MOCKING` | `disabled` | MSW無効化 |
| `FIRESTORE_EMULATOR_HOST` | `firebase-emulator-test:8080` | Firestore接続先 |
| `FIREBASE_AUTH_EMULATOR_HOST` | `firebase-emulator-test:9099` | Auth接続先 |

### API通信ログ例

```
GET /api/todos 200 in 5539ms    # 認証済みユーザーのTodo取得
GET /api/todos 401 in 64ms      # 未認証ユーザーの401エラー
POST /api/todos 201 in 96ms     # 新規Todo作成
POST /api/todos 400 in 66ms     # 無効データの400エラー
PUT /api/todos 200 in 166ms     # Todo更新
DELETE /api/todos 200 in 43ms   # Todo削除
GET /api/lists 200 in 1346ms    # リスト取得
```

## 🐛 トラブルシューティング

### よくある問題

#### Firebase Emulator接続エラー
```bash
# Emulator起動確認
docker-compose -f docker-compose.test.yml logs firebase-emulator-test

# 手動接続テスト
curl http://localhost:4001
```

#### Next.jsアプリ接続エラー
```bash
# Next.jsサービス確認
docker-compose -f docker-compose.test.yml logs nextjs-test

# 手動接続テスト
curl http://localhost:3001
```

#### タイムアウトエラー
- **原因**: Firebase Emulator起動時間
- **解決**: `testTimeout: 30000`で十分な待機時間を確保

### デバッグ方法

```bash
# 統合テスト詳細ログ
docker-compose -f docker-compose.test.yml logs integration-test

# 全サービスログ
docker-compose -f docker-compose.test.yml logs

# コンテナ状態確認
docker-compose -f docker-compose.test.yml ps
```

## 📈 パフォーマンス指標

### 実行時間
- **総実行時間**: 13.03秒
- **環境起動**: 約5秒（Firebase Emulator + Next.js）
- **テスト実行**: 約8秒（7テスト）

### リソース使用量
- **メモリ**: Docker環境で最適化済み
- **CPU**: 統合テスト専用設定で効率化
- **ネットワーク**: 内部通信による高速化

## 🎯 ベストプラクティス

### テスト設計
- **独立性**: 各テストは他のテストに依存しない
- **データ初期化**: テスト前の確実なデータクリア
- **実環境再現**: 本番環境に近い条件でのテスト

### CI/CD統合
```yaml
# GitHub Actions例
- name: Run Integration Tests
  run: npm run docker:test:run
```

### 開発ワークフロー
1. **ユニットテスト**: ローカルで高速フィードバック
2. **統合テスト**: Docker環境で実環境検証
3. **デプロイ**: 全テスト成功後にリリース

## 📋 関連ドキュメント

- [TEST_ENVIRONMENTS.md](TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [UT_TEST.md](UT_TEST.md) - ユニットテストガイド
- [E2E_TEST.md](E2E_TEST.md) - E2Eテストガイド
- [../DOCKER_TESTING.md](../DOCKER_TESTING.md) - Docker統合テスト環境
- [../VITEST_INTEGRATION_CONFIG.md](../VITEST_INTEGRATION_CONFIG.md) - 統合テスト専用設定

---

**💡 まとめ**: 統合テストにより、Firebase Emulator + Next.js の完全統合環境で実際のAPI通信を検証し、システム全体の品質を確保できます。