# Admin User Detail API

## 1. 概要

- 管理者が特定ユーザーの詳細情報を取得するAPIエンドポイント。
- ADMIN権限必須。

## 2. URL・ルーティング

- Path：`/api/users/[userId]`
- 認証：必須（ADMIN権限）

## 3. HTTPメソッド

### GET - ユーザー詳細取得

#### パラメータ
- `userId`: 取得対象のユーザーID（パスパラメータ）

#### レスポンス
- 成功（200）：
```typescript
{
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: number; // timestamp in milliseconds
    name: string | null;
    image: string | null;
    updatedAt: number | null; // timestamp in milliseconds
  };
}
```
- エラー（401）：未認証
- エラー（403）：権限不足（非ADMIN）
- エラー（404）：ユーザーが存在しない
- エラー（500）：サーバーエラー

## 4. 処理フロー

1. パスパラメータからuserIdを取得
2. セッション情報の取得・認証確認
3. ADMIN権限チェック
4. Firestoreから指定ユーザー情報を取得
5. ユーザー存在確認
6. UserData型でデータを整形して返却

## 5. データベース構造

- コレクション：`users`
- ドキュメント：`userId`
- 取得フィールド：全フィールド

## 6. 型定義

- レスポンスは`UserData`型を使用
- タイムスタンプはmilliseconds形式で返却

## 7. セキュリティ

- セッション認証必須
- ADMIN権限必須
- 存在しないユーザーへのアクセスは404エラー