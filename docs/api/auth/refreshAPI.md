# Refresh Token API

## 1. 概要

- Firebase カスタムトークンの更新を行うAPIエンドポイント。
- セッション延長時に使用。

## 2. URL・ルーティング

- Path：`/api/auth/refresh`
- 認証：UIDが必要

## 3. HTTPメソッド

### POST - トークンリフレッシュ

#### リクエストボディ
```typescript
{
  uid: string;
}
```

#### レスポンス
- 成功（200）：
```typescript
{
  customToken: string;
  success: true;
  message: 'トークンが更新されました';
}
```
- エラー（400）：無効なリクエスト（UID不足）
- エラー（500）：サーバーエラー

## 4. 処理フロー

1. リクエストボディをZodでバリデーション（`AuthDecodedTokenSchema`）
2. Firebase Admin SDKで新しいカスタムトークンを発行
3. トークンとメッセージを返却

## 5. バリデーション

- リクエストは`AuthDecodedTokenSchema`でZodバリデーション実施

## 6. 依存関係

- Firebase Admin SDK（`adminAuth`）
- バリデーション：`@/data/validatedData`

## 7. セキュリティ

- UIDの存在確認とフォーマット検証
- Firebase Admin SDKによる安全なトークン発行