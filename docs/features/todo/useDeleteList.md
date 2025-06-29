# useDeleteList Hook

## 1. 概要

- Todoリスト（カテゴリ）とそれに関連するTodo項目を一括削除するカスタムフック。
- リスト削除時に関連するTodo項目も自動的に削除する。

## 2. パラメータ

```typescript
{
  todos: TodoListProps[];
  setTodos: React.Dispatch<React.SetStateAction<TodoListProps[]>>;
  setLists: React.Dispatch<React.SetStateAction<StatusListProps[]>>;
}
```

## 3. 戻り値

### Actions
- `deleteList`: リストと関連Todo項目の一括削除

## 4. 主要機能

### リスト削除 (`deleteList`)
1. **リスト削除**
   - サーバーサイドでリストを削除
   - クライアントサイドでリスト状態を更新
   - 削除後のリスト番号を連続番号に再設定

2. **関連Todo削除**
   - 削除対象リストのstatusと一致するTodo項目を特定
   - 並列処理（Promise.all）で効率的な一括削除
   - クライアントサイドでTodo状態を更新

3. **番号再設定**
   - 削除後のリストを番号順にソート
   - インデックス+1で連続番号を振り直し

## 5. API連携

- `/api/lists` エンドポイント（DELETE）
- `/api/todos` エンドポイント（DELETE）
- 型安全なAPI呼び出し：
  - `apiRequest<ListPayload<'DELETE'>, ListResponse<'DELETE'>>`
  - `apiRequest<TodoPayload<'DELETE', true>, TodoResponse<'DELETE'>>`

## 6. エラーハンドリング

- try-catch文でエラーをキャッチ
- コンソールエラーログ出力
- クライアントサイドでの楽観的更新により即座にUI反映

## 7. パフォーマンス最適化

- **並列削除**: Promise.allで複数Todo項目を同時削除
- **楽観的更新**: サーバー処理前にUI状態を更新
- **効率的フィルタリング**: filter関数で不要な項目を除外

## 8. 使用例

```typescript
const { deleteList } = useDeleteList({
  todos,
  setTodos,
  setLists,
});

// リスト削除実行
await deleteList(listId, listTitle);
```