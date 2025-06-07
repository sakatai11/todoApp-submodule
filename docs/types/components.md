# コンポーネント型定義 (components.ts)

## 1. 概要

- UIコンポーネントのProps型定義を集約したファイル。
- Context、Modal、各種コンポーネントの型安全性を提供。

## 2. Context型定義

### TodoContextType
```typescript
export type TodoContextType = {
  todoHooks: TodoHookType<EditDataProps>;
  listHooks: ListHookType;
  updateStatusAndCategoryHooks: UpdateStatusAndCategoryHooks<EditDataProps>;
  deleteListHooks: DeleteListHooks;
};
```
**用途**: TodoContextで提供される全機能の型統合

## 3. Todo関連コンポーネント型

### TodoPropsType
```typescript
export type TodoPropsType = {
  todo: TodoListProps;
};
```
**用途**: 個別Todo項目表示コンポーネント

### PullDownPropsType
```typescript
export type PullDownPropsType = Omit<
  BaseHookType<{ status: string }, boolean>,
  'setError'
> & {
  pullDownList: StatusType[];
};
```
**用途**: ステータス選択プルダウンコンポーネント
**特徴**: BaseHookTypeから`setError`を除外

## 4. Modal関連型定義

### モーダル基本型（IsModalBaseType）
```typescript
export type IsModalBaseType = {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
};
```

### 編集モーダル（ModalPropType）
```typescript
export type ModalPropType = IsModalBaseType & {
  todo?: TodoListProps;
  id: string;
};
```

### 削除確認モーダル（DeletePropType）
```typescript
export type DeletePropType = IsModalBaseType & IsModalWithSelectType & {
  title?: string;
  onDelete: () => void;
};
```

### リスト選択モーダル（HandleClickPropsType）
```typescript
export type HandleClickPropsType = IsModalWithDeleteType & IsModalWithSelectType & {
  id: string;
  listNumber: number;
  listLength: number;
  setTextRename: (textRename: boolean) => void;
};
```

### サインアウトモーダル（SignOutPropType）
```typescript
export type SignOutPropType = IsModalBaseType & {
  onSignOut: () => void;
};
```

## 5. UI部品型定義

### StatusTitlePropType
```typescript
export type StatusTitlePropType = {
  id: string;
  title: string;
  listNumber: number;
};
```
**用途**: ステータスタイトル表示コンポーネント

### NavigationContentsProps
```typescript
export type NavigationContentsProps = IsModalBaseType & {
  user: UserData;
  initial: string;
  onCloseNav: () => void;
};
```
**用途**: ナビゲーションドロップダウンコンポーネント

## 6. モーダル拡張型

### IsModalWithSelectType
```typescript
export type IsModalWithSelectType = {
  setSelectModalIsOpen?: (selectModal: boolean) => void;
};
```

### IsModalWithDeleteType
```typescript
export type IsModalWithDeleteType = {
  setDeleteIsModalOpen: (deleteIsModalOpen: boolean) => void;
};
```

## 7. 設計パターン

### 型の合成
- `&`演算子による型の組み合わせ
- 基本型の拡張による再利用性向上

### オプショナル型の活用
- `?`による任意フィールドの定義
- 柔軟なコンポーネント設計

### 関数型プロパティ
- コールバック関数の型安全な定義
- イベントハンドラーの統一的な管理

## 8. 依存関係

- `@/types/todos` - Todo関連の基本型
- `@/types/lists` - リスト関連の基本型
- `@/types/auth/authData` - ユーザー情報型
- `@/types/common` - 共通型定義

## 9. 特徴

### 型安全性
- コンポーネント間のProps受け渡しの保証
- TypeScriptの型推論活用

### 再利用性
- 共通パターンの型化
- モーダル機能の統一的な管理