# Firebase Admin SDK

## 1. 概要

- Firebase Admin SDK の初期化と設定を行うライブラリ。
- サーバーサイドでのFirebase認証とFirestore操作を可能にする。

## 2. 設定

### サービスアカウント設定
```typescript
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};
```

### 環境変数バリデーション
- 必須フィールドの存在確認
- 不足時はエラーをスロー
- セキュリティ重要情報の適切な検証

## 3. 初期化プロセス

### 重複初期化の防止
```typescript
const firebaseAdminApp = getApps().length > 0 
  ? getApps()[0] 
  : initializeApp({ credential: cert(serviceAccount) });
```

- 既存インスタンスの確認
- 未初期化の場合のみ新規作成
- サーバーサイドでの安全な初期化

## 4. エクスポートされるインスタンス

### firebaseAdminApp
- Firebase Admin アプリケーションインスタンス
- 他のサービスの基盤

### adminDB
- Firestore データベースインスタンス
- ドキュメント・コレクション操作用

### adminAuth
- Firebase Authentication インスタンス
- ユーザー認証・カスタムトークン生成用

## 5. ログ出力

### 初期化確認ログ
- プロジェクトID
- クライアントメール
- 秘密鍵の長さ（セキュリティ考慮）

## 6. セキュリティ考慮事項

### 秘密鍵の処理
- 改行文字の適切な置換（`\\n` → `\n`）
- 環境変数での安全な管理

### 設定検証
- 必須パラメータの存在確認
- 不正な設定での初期化防止

## 7. 環境変数

- `FIREBASE_PROJECT_ID`: Firebase プロジェクトID
- `FIREBASE_ADMIN_PRIVATE_KEY`: サービスアカウント秘密鍵
- `FIREBASE_ADMIN_CLIENT_EMAIL`: サービスアカウントメール

## 8. 使用場面

- API ルートでのデータベース操作
- サーバーサイド認証処理
- カスタムトークン生成