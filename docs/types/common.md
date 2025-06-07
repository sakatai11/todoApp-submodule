# 共通型定義 (common.ts)

## 1. 概要

- アプリケーション全体で共通利用される型定義ファイル。
- フック、モーダル、編集機能の基盤となる型を提供。

## 2. 編集機能型

### EditDataProps
```typescript
export type EditDataProps = {
  editId: string | null;
  setEditId: (id: string | null) => void;
};
```
**用途**: 編集状態の管理（編集中のアイテムID追跡）

## 3. モーダル基本型

### IsModalBaseType
```typescript
export type IsModalBaseType = {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
};
```
**用途**: モーダルの開閉状態管理

### IsModalWithSelectType
```typescript
export type IsModalWithSelectType = {
  setSelectModalIsOpen?: (selectModal: boolean) => void;
};
```
**用途**: 選択モーダルの追加制御

### IsModalWithDeleteType
```typescript
export type IsModalWithDeleteType = {
  setDeleteIsModalOpen: (deleteIsModalOpen: boolean) => void;
};
```
**用途**: 削除確認モーダルの制御

## 4. フック基本型

### BaseHookType
```typescript
export type BaseHookType<TInput, TError> = {
  input: TInput;
  error: TError;
  setInput: (input: TInput) => void;
  setError: (error: TError) => void;
};
```

**特徴**:
- ジェネリクス`TInput`による入力データ型の指定
- ジェネリクス`TError`によるエラー状態型の指定
- カスタムフックの共通インターフェース提供

**使用例**:
```typescript
// Todo用フック
BaseHookType<
  { text: string; status: string },           // 入力型
  { listPushArea: boolean; listModalArea: boolean }  // エラー型
>

// List用フック
BaseHookType<
  { status: string },                         // 入力型
  { addListNull: boolean; addListSame: boolean }     // エラー型
>
```

## 5. ステータス型

### StatusType
```typescript
export type StatusType = {
  category: string;
};
```
**用途**: プルダウンメニューでのステータス選択項目

## 6. 特化フック型

### UpdateStatusAndCategoryHooks
```typescript
export type UpdateStatusAndCategoryHooks<T extends EditDataProps> = T & {
  editList: (
    id: string,
    value: string,
    title: string,
    initialTitle: string,
  ) => Promise<boolean>;
};
```
**用途**: ステータス・カテゴリ更新機能
**特徴**: `EditDataProps`を継承し、編集機能を拡張

### DeleteListHooks
```typescript
export type DeleteListHooks = {
  deleteList: (id: string, title: string) => void;
};
```
**用途**: リスト削除機能

## 7. 設計原則

### ジェネリクス活用
- 型パラメータによる柔軟な型定義
- 再利用可能な汎用型の提供

### 継承・合成パターン
- `extends`による型の制約指定
- `&`による型の合成

### 関数型指定
- 引数・戻り値の明確な型定義
- 非同期処理（Promise）の適切な型表現

## 8. 利点

### 統一性
- アプリケーション全体での一貫した型使用
- 共通パターンの標準化

### 保守性
- 型変更時の影響範囲の明確化
- リファクタリング時の安全性向上

### 開発効率
- IDEによる型推論・自動補完の活用
- コンパイル時のエラー検出