# ステータス更新ユーティリティ (updateStatusUtils.ts)

## 1. 概要

- リストとTodoのステータス更新処理を行うユーティリティ関数群。
- カテゴリ名の重複チェックと状態同期機能を提供。

## 2. 関数

### isDuplicateCategory

#### 概要
- 指定されたカテゴリ名が既存リストと重複するかをチェック。

#### パラメータ
```typescript
lists: StatusListProps[]  // 既存リスト配列
category: string         // チェック対象のカテゴリ名
id: string              // 除外するリストID（編集時用）
```

#### 戻り値
```typescript
boolean // 重複の場合true
```

#### 処理詳細
1. 既存リストを走査
2. 同じカテゴリ名かつ異なるIDのリストを検索
3. 該当があれば重複として判定

#### 使用例
```typescript
const isDupe = isDuplicateCategory(lists, "新カテゴリ", "list-1");
if (isDupe) {
  // 重複エラー処理
}
```

### updateListsAndTodos

#### 概要
- リストのカテゴリ名変更時に、関連するTodoのステータスも同期更新。

#### パラメータ
```typescript
setLists: React.Dispatch<React.SetStateAction<StatusListProps[]>>  // リスト状態更新関数
setTodos: React.Dispatch<React.SetStateAction<TodoListProps[]>>   // Todo状態更新関数
id: string               // 更新対象のリストID
finalCategory: string    // 新しいカテゴリ名
oldCategory: string      // 元のカテゴリ名
```

#### 処理フロー

1. **リスト更新関数の定義**
   ```typescript
   const updateLists = (prevLists) => {
     return prevLists.map(list => 
       list.id === id ? { ...list, category: finalCategory } : list
     );
   };
   ```

2. **Todo更新関数の定義**
   ```typescript
   const updateTodos = (prevTodos) => {
     return prevTodos.map(todo =>
       todo.status === oldCategory ? { ...todo, status: finalCategory } : todo
     );
   };
   ```

3. **状態の同期更新**
   - リスト状態を更新
   - 更新完了後にTodo状態も更新
   - データの整合性を保持

## 3. データ整合性の保証

### リスト・Todo間の一貫性
- カテゴリ名変更時の自動同期
- 参照関係の維持

### 状態更新の順序制御
- リスト更新 → Todo更新の順序
- React state の適切な管理

## 4. 使用場面

### カテゴリ編集機能
- リスト名称の変更処理
- 重複カテゴリ名の防止

### データ同期
- UI状態とデータベース状態の同期
- 関連データの一括更新

## 5. 依存関係

- React Hooks (useState のDispatch型)
- StatusListProps, TodoListProps 型定義