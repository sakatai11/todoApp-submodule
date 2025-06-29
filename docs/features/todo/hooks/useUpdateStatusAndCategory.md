# useUpdateStatusAndCategory Hook

## 1. 概要

- Todoリスト（カテゴリ）名の更新と、それに関連するTodo項目のstatus一括更新を行うカスタムフック。
- リスト名変更時に関連するTodo項目のstatusも自動的に更新する。

## 2. パラメータ

```typescript
{
  lists: StatusListProps[];
  setTodos: React.Dispatch<React.SetStateAction<TodoListProps[]>>;
  setLists: React.Dispatch<React.SetStateAction<StatusListProps[]>>;
}
```

## 3. 戻り値

### State
- `editId`: 編集中のリストID

### Actions
- `editList`: リスト名更新と関連Todo項目のstatus更新

### Setters
- `setEditId`: 編集状態の制御

## 4. 主要機能

### リスト編集 (`editList`)
1. **入力値処理**
   - 新しいカテゴリ名または初期タイトルを最終カテゴリとして設定
   - 空文字の場合は初期タイトルを使用

2. **重複チェック**
   - `isDuplicateCategory`ユーティリティで重複確認
   - 同じID以外で同名カテゴリの存在をチェック
   - 重複時はアラート表示して処理中断

3. **サーバーサイド更新**
   - **リストカテゴリ更新**: `/api/lists` (PUT - update)
   - **Todo項目status更新**: `/api/todos` (PUT - restatus)
   - 旧statusから新statusへの一括変更

4. **クライアントサイド更新**
   - `updateListsAndTodos`ユーティリティでUI状態を更新
   - リスト名とTodo項目のstatusを同期更新

## 5. バリデーション

### 重複チェック (`isDuplicateCategory`)
- 編集対象以外のリストで同名カテゴリをチェック
- ユーティリティ関数で実装（`@/features/utils/updateStatusUtils`）

## 6. API連携

- `/api/lists` エンドポイント（PUT - update）
- `/api/todos` エンドポイント（PUT - restatus）
- 型安全なAPI呼び出し：
  - `apiRequest<ListPayload<'PUT'>, ListResponse<'PUT'>>`
  - `apiRequest<TodoPayload<'PUT', true>, TodoResponse<'PUT'>>`

## 7. エラーハンドリング

- try-catch文でエラーをキャッチ
- コンソールエラーログ出力
- ユーザーフレンドリーなアラート表示

## 8. ユーティリティ依存

### updateStatusUtils
- `isDuplicateCategory`: 重複カテゴリチェック
- `updateListsAndTodos`: 状態更新ロジック

## 9. 使用例

```typescript
const { editId, editList, setEditId } = useUpdateStatusAndCategory({
  lists,
  setTodos,
  setLists,
});

// 編集開始
setEditId(listId);

// リスト名更新実行
const success = await editList(
  listId,
  newCategoryName,
  oldCategoryName,
  initialTitle
);
```

## 10. 処理フロー

1. 入力値の正規化（空文字対応）
2. 重複チェック（既存リストとの比較）
3. サーバーサイド更新（リスト → Todo）
4. クライアントサイド状態更新
5. 成功/失敗の結果返却