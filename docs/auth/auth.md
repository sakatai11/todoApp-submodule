# 認証システム (auth.ts)

## 1. 概要

- NextAuth.jsを使用したカスタム認証システム。
- Credentials Providerによるメール・パスワード認証。
- Firebase Custom Tokenとの連携。

## 2. 設定

### NextAuth Configuration
- `authConfig`を継承してプロバイダーを追加
- `trustHost: true`で本番環境対応

### Credentials Provider
```typescript
credentials: {
  email: { label: 'Email', type: 'email' },
  password: { label: 'Password', type: 'password' }
}
```

## 3. 認証フロー

### authorize関数の処理
1. **入力バリデーション**
   - `CredentialsSchema`でZodバリデーション
   - email, password必須チェック

2. **環境変数確認**
   - `NEXTAUTH_URL`の存在確認

3. **サーバーサイド認証**
   - `/api/auth/server-login`への内部API呼び出し
   - メール・パスワードでFirebase認証

4. **レスポンス処理**
   - Custom Token、Decoded Token、User Roleを取得
   - NextAuthのUserオブジェクトを返却

## 4. エラーハンドリング

- 認証情報不足時の適切なエラーメッセージ
- ネットワークエラー・API エラーのキャッチ
- 日本語エラーメッセージで UX 向上

## 5. セキュリティ

- パスワード平文での送信（内部API経由）
- Custom Tokenによる安全な認証状態管理
- 適切なエラー情報の隠蔽

## 6. 依存関係

- NextAuth.js
- Firebase Admin SDK（間接的）
- Zod バリデーション
- auth.config.ts（設定ファイル）

## 7. 環境変数

- `NEXTAUTH_URL`: NextAuth のベースURL
- `NEXTAUTH_SECRET`: JWT署名用シークレット