# Admin Users API

## 1. 概要

- 管理者がユーザー一覧を取得するAPIエンドポイント。
- ADMIN権限必須。

## 2. URL・ルーティング

- Path：`/api/users`
- 認証：必須（ADMIN権限）

## 3. HTTPメソッド

### GET - ユーザー一覧取得

#### リクエスト
- パラメータなし
- セッション情報から権限を確認

#### レスポンス
- 成功（200）：
```typescript
{
  users: Array<{
    id: string;
    email: string;
    role: string;
    createdAt: number; // timestamp in milliseconds
    name: string | null;
    image: string | null;
  }>;
}
```
- エラー（401）：未認証
- エラー（403）：権限不足（非ADMIN）
- エラー（500）：サーバーエラー

## 4. 処理フロー

1. セッション情報の取得・認証確認
2. ADMIN権限チェック
3. Firestoreからユーザー一覧を取得（createdAt降順）
4. ユーザーデータを整形して返却

## 5. データベース構造

- コレクション：`users`
- ソート：`createdAt`降順
- 取得フィールド：id, email, role, createdAt, name, image

## 6. セキュリティ

- セッション認証必須
- ADMIN権限必須
- 他の権限ユーザーは403エラー