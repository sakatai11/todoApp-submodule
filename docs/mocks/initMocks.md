# Mock 初期化 (initMocks.ts)

## 1. 概要

- MSW（Mock Service Worker）の環境別初期化を行う関数。
- 開発環境でのみ動作し、サーバー・クライアント両対応。

## 2. 関数仕様

### initMocks
```typescript
export async function initMocks(): Promise<void>
```

**目的**: 環境に応じたMSWの自動初期化

## 3. 実行フロー

### 1. 実行環境の判定
```typescript
if (typeof window === 'undefined') {
  // Server-side
} else {
  // Client-side
}
```

### 2. サーバーサイド処理
```typescript
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  const { server } = await import('./server');
  server.listen({
    onUnhandledRequest: 'bypass',
  });
  console.log('MSW: Server-side mocking enabled');
}
```

**特徴**:
- Node.js環境での実行
- `./server`からサーバーインスタンスを動的インポート
- 未処理リクエストのバイパス設定

### 3. クライアントサイド処理
```typescript
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  console.log('MSW: Client-side mocking enabled');
}
```

**特徴**:
- ブラウザ環境での実行
- `./browser`からワーカーインスタンスを動的インポート
- Service Workerの非同期開始

## 4. 有効化条件

### 環境変数チェック
1. **NODE_ENV**: 'development' 必須
2. **NEXT_PUBLIC_API_MOCKING**: 'enabled' 必須

### 目的
- 本番環境での誤作動防止
- 明示的なモック有効化の制御

## 5. 設定オプション

### onUnhandledRequest: 'bypass'
**効果**:
- モックされていないAPIリクエストを実際のサーバーに転送
- 段階的なモック導入が可能
- 既存のAPIとの併用をサポート

## 6. ログ出力

### 成功時のメッセージ
- **サーバーサイド**: "MSW: Server-side mocking enabled"
- **クライアントサイド**: "MSW: Client-side mocking enabled"

### 用途
- モック有効化の確認
- デバッグ時の状態把握

## 7. 動的インポート使用理由

### パフォーマンス最適化
- 本番ビルドからモックコードを除外
- バンドルサイズの削減

### 条件付き読み込み
- 開発環境でのみモジュール読み込み
- 不要なファイルの実行時読み込み回避

## 8. 使用場面

### アプリケーション起動時
- layout.tsx の MSWProvider で呼び出し
- アプリ全体でのモック有効化

### テスト環境
- テストセットアップでの初期化
- 一貫したテストデータの提供

## 9. エラーハンドリング

- 環境変数未設定時は何も実行しない
- インポートエラーの自然な無視
- サイレントフェイルによる本番環境への影響回避