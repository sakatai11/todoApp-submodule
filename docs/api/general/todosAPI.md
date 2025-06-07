# Todos API

## 1. 概要

- ユーザーのTodo項目を管理するAPIエンドポイント。
- 認証されたユーザーのみアクセス可能。

## 2. URL・ルーティング

- Path：`/api/todos`
- 認証：必須（withAuthenticatedUser使用）

## 3. HTTPメソッド

### POST - Todo作成

#### リクエストボディ
```typescript
{
  text: string;
  status: string;
  updateTime: string;
  createdTime: string;
}
```

#### レスポンス
- 成功（200）：作成されたTodoオブジェクト（IDを含む）
- エラー（400）：text, statusが不足
- エラー（500）：サーバーエラー

### PUT - Todo更新

#### リクエストボディパターン

1. **完了状態の切り替え**
```typescript
{
  id: string;
  bool: boolean;
}
```

2. **Todo内容の更新**
```typescript
{
  id: string;
  text: string;
  status: string;
  updateTime: string;
}
```

3. **ステータス一括変更**
```typescript
{
  type: 'restatus';
  data: {
    oldStatus: string;
    status: string;
  };
}
```

#### レスポンス
- 成功（200）：更新完了メッセージ
- エラー（400）：必須フィールド不足
- エラー（500）：サーバーエラー

### DELETE - Todo削除

#### リクエストボディ
```typescript
{
  id: string;
}
```

#### レスポンス
- 成功（200）：削除完了メッセージ
- エラー（400）：ID不足
- エラー（500）：サーバーエラー

## 4. データベース構造

- コレクション：`users/{uid}/todos`
- フィールド：text, bool, status, updateTime, createdTime