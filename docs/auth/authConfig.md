# 認証設定 (auth.config.ts)

## 1. 概要

- NextAuth.jsの設定ファイル。
- JWT戦略、セッション管理、認可ロジックを定義。
- トークンリフレッシュ機能を実装。

## 2. 基本設定

### Pages Configuration
- `signIn: '/signin'` - カスタムサインインページ

### Session Strategy
- `strategy: 'jwt'` - JWTベースのセッション
- `maxAge: 24 * 60 * 60` - 24時間有効期限

## 3. Callbacks

### authorized Callback
**役割**: Middlewareでの認証・認可チェック

**処理フロー**:
1. 管理者ページ保護（`/admin/*`）
   - ADMIN権限必須
2. 認証ページ保護（`/todo/*`）
   - customToken必須
3. サインインページでのリダイレクト制御
   - 認証済みユーザーは`/todo`へ

### jwt Callback
**役割**: JWTトークンの作成・更新・リフレッシュ

**初回ログイン時**:
- ユーザー情報をトークンにコピー
- customToken、tokenExpiry、roleを保存
- tokenIssuedAtを記録

**トークンリフレッシュ**:
- 45分経過またはリフレッシュから5分経過で実行
- `/api/auth/refresh`への内部API呼び出し
- 新しいcustomTokenで更新

**セッション更新**:
- updateトリガーでcustomTokenを更新

### session Callback
**役割**: セッションデータの公開制御

**公開データ**:
- user: id, email, customToken, role
- tokenExpiry, tokenIssuedAt

## 4. トークンリフレッシュ機能

### リフレッシュ条件
- トークン年齢が45分以上
- 最後のリフレッシュから5分以上経過

### リフレッシュフロー
1. `/api/auth/refresh`にPOSTリクエスト
2. uid, emailを送信
3. 新しいcustomTokenを取得
4. トークン情報を更新

## 5. ログ出力

- Middleware認証チェックの詳細ログ
- トークンリフレッシュのタイミング
- セッション・トークン情報の出力

## 6. セキュリティ考慮

- 適切な認可チェック（ADMIN権限）
- トークンの自動リフレッシュ
- セッション有効期限の管理

## 7. 環境変数

- `NEXTAUTH_SECRET`: JWT署名用シークレット
- `NEXTAUTH_URL`: リフレッシュAPI用ベースURL