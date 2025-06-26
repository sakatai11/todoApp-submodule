# Server Login API

## 1. 概要

- サーバーサイドでユーザーログイン認証を処理するAPIエンドポイント。
- Firebase Authentication とモック環境の両方に対応。

## 2. URL・ルーティング

- Path：`/api/auth/server-login`
- 認証：不要（認証処理そのもの）

## 3. HTTPメソッド

### POST - ユーザー認証

#### リクエストボディ
```typescript
{
  email: string;
  password: string;
}
```

#### レスポンス
- 成功（200）：
```typescript
{
  decodedToken: {
    uid: string;
    email: string;
    exp: number;
  };
  customToken: string;
  tokenExpiry: number;
  userRole?: string;
}
```
- エラー（400）：email, passwordが不足
- エラー（401）：認証エラー
- エラー（500）：サーバーエラー

## 4. 処理フロー

### モック環境（NEXT_PUBLIC_API_MOCKING=enabled）
1. モックユーザーデータから該当ユーザーを検索
2. 固定パスワード'password'で認証
3. モックトークンとレスポンスを生成

### 本番環境
1. Firebase Auth REST APIでパスワード検証
2. IDトークンを取得・検証
3. カスタムトークンを発行
4. Firestoreからユーザーロールを取得

## 5. バリデーション

- レスポンスは`AuthResponseSchema`でZodバリデーション実施

## 6. 依存関係

- Firebase Admin SDK
- モック環境：`@/mocks/data/user`
- バリデーション：`@/data/validatedData`

## 7. 環境変数

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_API_MOCKING`
- `NODE_ENV`