# Admin User Todos API

## 1. 概要

- 管理者が特定ユーザーのTodo一覧を取得するAPIエンドポイント。
- ADMIN権限必須。

## 2. URL・ルーティング

- Path：`/api/users/[userId]/todos`
- 認証：必須（ADMIN権限）

## 3. HTTPメソッド

### GET - ユーザーTodo一覧取得

#### パラメータ
- `userId`: 取得対象のユーザーID（パスパラメータ）

#### レスポンス
- 成功（200）：
```typescript
{
  todos: Array<{
    id: string;
    updateTime: string;
    createdTime: string;
    text: string;
    status: string;
    bool: boolean;
  }>;
}
```
- エラー（401）：未認証
- エラー（403）：権限不足（非ADMIN）
- エラー（500）：サーバーエラー

## 4. 処理フロー

1. パスパラメータからuserIdを取得
2. セッション情報の取得・認証確認
3. ADMIN権限チェック
4. Firestoreから指定ユーザーのTodo一覧を取得（updateTime降順）
5. TodoListProps型でデータを整形して返却

## 5. データベース構造

- コレクション：`users/{userId}/todos`
- ソート：`updateTime`降順
- 取得フィールド：id, updateTime, createdTime, text, status, bool

## 6. 型定義

- レスポンスは`TodoListProps`配列を使用

## 7. セキュリティ

- セッション認証必須
- ADMIN権限必須
- 他ユーザーのデータにアクセス可能（管理者権限）