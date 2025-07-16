# Todo型定義 (todos.ts)

## 1. 概要

- Todo機能に関する型定義ファイル。
- APIペイロード、レスポンス、フック型などを包括的に定義。

## 2. 基本型定義

### TodoListProps
```typescript
export type TodoListProps = {
  id: string;
  updateTime: Timestamp;
  createdTime: Timestamp;
  text: string;
  status: string;
  bool: boolean;
};
```
**用途**: Firestoreから取得するTodoデータの型

### MockTodoListProps
```typescript
export type MockTodoListProps = Omit<TodoListProps, 'updateTime' | 'createdTime'> & {
  updateTime: string;
  createdTime: string;
};
```
**用途**: モック環境でのTodoデータ型（日付を文字列で扱う）

## 3. 動的型定義

### DateType
```typescript
type DateType<IsMock extends boolean> = IsMock extends true ? string : Timestamp;
```
**用途**: モック環境と本番環境での日付型の切り替え

### TodoPayload
```typescript
export type TodoPayload<
  T extends 'POST' | 'DELETE' | 'PUT',
  IsMock extends boolean = false,
>
```

#### HTTPメソッド別の型定義

**POST**: Todo作成時
```typescript
{
  text: string;
  status: string;
  bool: boolean;
}
```

**DELETE**: Todo削除時
```typescript
{ id: string }
```

**PUT**: Todo更新時（Union型）
```typescript
| { id: string; bool: boolean }                    // 完了状態切り替え
| { id: string; text: string; status: string; }   // 内容更新（updateTimeはサーバーサイド生成）
| { type: 'restatus'; data: { oldStatus: string; status: string; } }          // ステータス一括変更
```

## 4. フック型定義

### TodoHookType
```typescript
export type TodoHookType<T extends EditDataProps> = T & BaseHookType<...> & {
  todos: TodoListProps[];
  addTodoOpenStatus: string | null;
  setTodos: (todos: TodoListProps[]) => void;
  addTodo: () => Promise<boolean>;
  deleteTodo: (id: string) => void;
  editTodo: (id: string) => void;
  saveTodo: () => void;
  toggleSelected: (id: string) => void;
  setAddTodoOpenStatus: (status: string | null) => void;
};
```

**特徴**:
- ジェネリクス`T`による編集機能の動的型定義
- `BaseHookType`による共通フック型の継承
- 入力型: `{ text: string; status: string }`
- エラー型: `{ listPushArea: boolean; listModalArea: boolean }`

## 5. レスポンス型定義

### TodoResponse
HTTPメソッド別のAPIレスポンス型

**POST**: 作成完了時
```typescript
{
  id?: string;
  text?: string;
  status?: string;
  bool?: boolean;
  createdTime?: Timestamp;
  updateTime?: Timestamp;
  error?: string;
}
```

**PUT**: 更新完了時
```typescript
// 内容更新の場合：更新されたTodoオブジェクト
{
  id?: string;
  text?: string;
  status?: string;
  bool?: boolean;
  createdTime?: Timestamp;
  updateTime?: Timestamp;
  error?: string;
}

// その他の場合：更新完了メッセージ
{
  message?: string;
  error?: string;
}
```

**DELETE**: 削除完了時
```typescript
{
  message?: string;
  error?: string;
}
```

## 6. 設計特徴

### 型安全性
- 条件型によるHTTPメソッド別の厳密な型定義
- Union型による複数パターンの更新処理対応

### サーバーサイドタイムスタンプ生成
- `createdTime`と`updateTime`はサーバーサイドで自動生成
- クライアントからのタイムスタンプ送信は不要（型定義から除外）
- Firebase Timestamp形式での一貫した時間管理

### 環境対応
- モック・本番環境での日付型の自動切り替え
- 型レベルでの環境差異の吸収

### 拡張性
- ジェネリクスによる機能拡張への対応
- 共通型の継承による保守性向上