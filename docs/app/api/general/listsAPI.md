# Lists API

## 1. 概要

- ユーザーのTodoリスト（カテゴリ）を管理するAPIエンドポイント。
- 認証されたユーザーのみアクセス可能。

## 2. URL・ルーティング

- Path：`/api/lists`
- 認証：必須（withAuthenticatedUser使用）

## 3. HTTPメソッド

### POST - リスト作成

#### リクエストボディ
```typescript
{
  category: string;
  number: number;
}
```

#### レスポンス
- 成功（200）：作成されたリストオブジェクト（IDを含む）
- エラー（400）：category, numberが不足
- エラー（500）：サーバーエラー

### PUT - リスト更新

#### リクエストボディパターン

1. **カテゴリ名更新**
```typescript
{
  type: 'update';
  id: string;
  data: {
    category: string;
  };
}
```

2. **リスト順序変更**
```typescript
{
  type: 'reorder';
  data: string[]; // リストIDの配列（新しい順序）
}
```

#### レスポンス
- 成功（200）：更新完了メッセージ
- エラー（400）：必須フィールド不足または無効なtype
- エラー（500）：サーバーエラー

### DELETE - リスト削除

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

- コレクション：`users/{uid}/lists`
- フィールド：category, number

## 5. 特記事項

- リスト削除時は番号を自動的に再割り振り
- リスト順序変更はトランザクションで実行
- numberフィールドでソート順を管理