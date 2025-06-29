# useTodos Hook

## 1. 概要

- Todo項目の状態管理と操作を行うカスタムフック。
- 追加、削除、編集、完了切り替えなどの機能を提供。

## 2. パラメータ

```typescript
initialTodos: TodoListProps[]
```

## 3. 戻り値

### State
- `todos`: Todo項目リスト
- `input`: 入力フォームの状態（text, status）
- `editId`: 編集中のTodoのID
- `error`: エラー状態（listPushArea, listModalArea）
- `addTodoOpenStatus`: 開いているAddTodoコンポーネントのステータス

### Actions
- `addTodo`: Todo追加
- `deleteTodo`: Todo削除
- `editTodo`: Todo編集開始
- `saveTodo`: Todo保存
- `toggleSelected`: 完了状態切り替え

### Setters
- `setTodos`, `setEditId`, `setInput`, `setError`, `setAddTodoOpenStatus`

## 4. 主要機能

### Todo追加 (`addTodo`)
1. 入力バリデーション（text, status必須）
2. サーバーサイドAPI呼び出し
3. クライアントサイド状態更新（作成日時順ソート）
4. エラーハンドリング

### Todo削除 (`deleteTodo`)
1. クライアントサイド即座削除
2. サーバーサイドAPI呼び出し

### Todo編集 (`editTodo` + `saveTodo`)
1. 編集対象の設定と入力フォーム初期化
2. 変更検知と不要な更新の回避
3. サーバーサイド更新
4. クライアントサイド状態反映

### 完了切り替え (`toggleSelected`)
1. クライアントサイド即座反映
2. サーバーサイドAPI呼び出し

## 5. API連携

- `/api/todos` エンドポイントとの連携
- POST（追加）、PUT（更新、切り替え）、DELETE（削除）
- 型安全なAPI呼び出し：`apiRequest<TodoPayload<Method>, TodoResponse<Method>>`

## 6. エラー管理

- `listPushArea`: Todo追加時のエラー
- `listModalArea`: Todo編集時のエラー

## 7. 日時管理

- `jstTime()`: 日本時間での作成日時・更新日時設定
- タイムスタンプは文字列形式でサーバーに送信（`IsMock = true`を使用）
- サーバーサイドで`Timestamp.fromMillis()`により適切なFirestore Timestampオブジェクトに変換

## 8. タイムスタンプソート処理

共通の`getTime`ヘルパー関数により、多様なタイムスタンプ形式に対応：

### 対応形式
1. **number型**: 直接数値として処理
2. **Firestore Timestamp**: `toMillis()`メソッドを呼び出し
3. **文字列**: `parseInt(String(timestamp), 10)`で数値に変換
4. **無効値**: フォールバック値として0を返却

### 使用箇所
- Todo追加時のソート処理
- Todo保存時のソート処理
- 作成日時の降順ソート（最新が上位）