# vitest.integration.config.ts - 統合テスト専用設定

## 概要

`vitest.integration.config.ts`は、Docker環境での統合テスト専用のVitest設定ファイルです。ユニットテスト用の`vitest.config.ts`とは完全に分離されており、Firebase Emulatorとの直接通信に最適化されています。

## 設定内容

### 基本設定

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup-integration.ts'],
    include: ['**/*integration*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    testTimeout: 30000, // 30秒のタイムアウト（Firebase Emulator接続用）
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
```

### 主な特徴

#### 1. 統合テスト専用のインクルード設定
- **対象**: `**/*integration*.{test,spec}.{js,ts,jsx,tsx}`
- **除外**: ユニットテストやE2Eテストは対象外
- **目的**: 統合テストファイルのみを実行

#### 2. Firebase Emulator対応
- **タイムアウト**: 30秒（通常の5倍）
- **理由**: Firebase Emulator接続とNext.jsアプリ起動の待機時間を考慮
- **環境**: Docker内でのサービス間通信に最適化

#### 3. 専用セットアップファイル
- **ファイル**: `tests/setup-integration.ts`
- **機能**: MSW無効化、Firebase Emulator接続確認
- **違い**: ユニットテスト用の`tests/setup.ts`とは完全分離

## 使用方法

### Docker環境での実行

```bash
# 統合テスト実行（推奨）
npm run docker:test:run

# 内部で以下のコマンドが実行される
npx vitest run tests/features/todo/api.integration.test.ts --config vitest.integration.config.ts
```

### 設定ファイルの使い分け

| 環境 | 設定ファイル | セットアップファイル | 対象テスト |
|------|-------------|-------------------|-----------|
| **ユニットテスト** | `vitest.config.ts` | `tests/setup.ts` | `**/*.test.ts`（統合・E2E除外） |
| **統合テスト** | `vitest.integration.config.ts` | `tests/setup-integration.ts` | `**/*integration*.test.ts` |

## 技術詳細

### MSW無効化の仕組み

1. **ユニットテスト**: `tests/setup.ts`でMSWサーバーを起動
2. **統合テスト**: `tests/setup-integration.ts`でMSWを完全無効化
3. **結果**: Firebase Emulatorとの直接通信を実現

### Docker環境での動作

```yaml
# docker-compose.test.yml
integration-test:
  command: npx vitest run tests/features/todo/api.integration.test.ts --config vitest.integration.config.ts
  depends_on:
    firebase-emulator-test:
      condition: service_healthy
    nextjs-test:
      condition: service_started
```

### ネットワーク構成

- **Firebase Emulator**: `firebase-emulator-test:8080/9099`
- **Next.js App**: `nextjs-test:3000`
- **統合テスト**: 上記2つのサービスに対してHTTPリクエストを送信

## トラブルシューティング

### よくある問題

1. **タイムアウトエラー**
   - **原因**: Firebase Emulator起動待機時間不足
   - **解決**: `testTimeout: 30000`で十分な待機時間を確保

2. **MSW競合エラー**
   - **原因**: ユニットテスト設定でMSWが有効
   - **解決**: 統合テスト専用設定で自動的に無効化

3. **サービス接続エラー**
   - **原因**: Docker依存関係の問題
   - **解決**: `depends_on`設定による適切な起動順序

### デバッグ方法

```bash
# Firebase Emulator接続確認
curl http://localhost:4001

# Next.jsアプリ確認
curl http://localhost:3001

# 統合テスト詳細ログ
docker-compose -f docker-compose.test.yml logs integration-test
```

## 関連ドキュメント

- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テスト環境選択ガイド
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド

---

**💡 まとめ**: この設定により、ユニットテストと統合テストが完全に分離され、それぞれの環境に最適化されたテスト実行が実現されています。