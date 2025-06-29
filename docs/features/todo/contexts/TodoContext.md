# TodoContext

## 1. 概要

- Todo機能全体の状態管理を行うReact Context。
- カスタムフックを組み合わせてTodoアプリケーションの全機能を提供。

## 2. 構成要素

### Provider
- `TodoProvider`: Todo関連の全状態とロジックを子コンポーネントに提供

### Context Hook
- `useTodoContext`: TodoContextを使用するためのカスタムフック

## 3. Props

```typescript
interface TodoProviderProps {
  children: React.ReactNode;
  initialTodos: TodoListProps[];
  initialLists: StatusListProps[];
}
```

## 4. 提供される機能

### 統合されたカスタムフック
1. **todoHooks** (`useTodos`)
   - Todo項目の管理（追加、削除、編集、完了切り替え）
2. **listHooks** (`useLists`)
   - リスト（カテゴリ）の管理（追加、並び替え）
3. **updateStatusAndCategoryHooks** (`useUpdateStatusAndCategory`)
   - ステータスとカテゴリの更新処理
4. **deleteListHooks** (`useDeleteList`)
   - リスト削除とそれに伴うTodo項目の処理

## 5. 使用方法

```typescript
// Provider でアプリをラップ
<TodoProvider initialTodos={todos} initialLists={lists}>
  <TodoApp />
</TodoProvider>

// 子コンポーネントで使用
const { todoHooks, listHooks } = useTodoContext();
```

## 6. エラーハンドリング

- Context外で`useTodoContext`を使用した場合にエラーをスロー
- 各機能のエラー状態は個別のカスタムフックで管理

## 7. 依存関係

- `@/types/todos` - Todo型定義
- `@/types/lists` - リスト型定義
- `@/types/components` - Context型定義
- 各カスタムフック（useTodos, useLists, etc.）