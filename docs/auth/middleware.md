# Middleware (middleware.ts)

## 1. 概要

- Next.js Middlewareによるルート保護機能。
- JWTトークンベースの認証・認可チェック。
- 管理者権限とユーザー認証の両方に対応。

## 2. 設定

### Matcher Configuration
```typescript
matcher: ['/admin/:path*', '/todo/:path*']
```
- `/admin/*`: 管理者権限必須
- `/todo/*`: 認証ユーザー必須

## 3. 機能

### トークン取得
- `getToken`でNextAuth JWTトークンを取得
- 本番環境では`secureCookie: true`

### ルート保護ロジック

#### 管理者ルート (`/admin/*`)
1. トークン存在確認
2. `token.role === 'ADMIN'`チェック
3. 条件未満足時は`/signin`にリダイレクト
4. `callbackUrl`パラメータで元URLを保持

#### ユーザールート (`/todo/*`)
1. トークン存在確認のみ
2. 未認証時は`/signin`にリダイレクト
3. `callbackUrl`パラメータで元URLを保持

## 4. リダイレクト処理

### URLクローンとパラメータ設定
```typescript
const url = req.nextUrl.clone();
url.pathname = '/signin';
url.searchParams.set('callbackUrl', path);
return NextResponse.redirect(url);
```

### callbackUrl機能
- 認証後に元のページに戻る
- UXの向上とブックマーク対応

## 5. セキュリティ特徴

### 階層化された保護レベル
1. **一般認証**: `/todo/*` - 基本認証のみ
2. **管理者認証**: `/admin/*` - ADMIN権限必須

### トークンベース認証
- JWTトークンによる無状態認証
- サーバーサイドでのトークン検証

## 6. パフォーマンス考慮

- 必要なルートのみにマッチング適用
- トークン取得の最適化
- 不要なミドルウェア実行の回避

## 7. エラーハンドリング

- トークン取得失敗時の適切な処理
- 権限不足時の安全なリダイレクト

## 8. 環境変数

- `NEXTAUTH_SECRET`: JWT署名検証用
- `NODE_ENV`: Cookie設定用（production判定）