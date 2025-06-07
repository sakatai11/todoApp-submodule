# Todoコンポーネント仕様書

## 概要
`features/todo/components/` 配下のコンポーネント群の仕様書です。これらのコンポーネントはTodoアプリケーションの中核機能を提供します。

## コンポーネント一覧

### 1. MainContainer (`MainContainer/MainContainer.tsx`)

**役割**: Todoアプリケーションのメインコンテナコンポーネント

**機能**:
- ドラッグ&ドロップによるリストの並び替え
- リスト別のTodo表示（boolによる完了/未完了の分類）
- レスポンシブ対応

**Props**: なし

**依存関係**:
- `TodoContext`（Todoの状態管理）
- `@dnd-kit/core`, `@dnd-kit/sortable`（ドラッグ&ドロップ）
- `SortableItem`, `TodoList`, `AddList`, `AddTodo`, `StatusTitle`

**主な機能**:
- DndContextでリストのドラッグ&ドロップを制御
- リストごとにTodoを`bool`値で分類表示
- モバイル対応のレスポンシブデザイン

---

### 2. PushContainer (`PushContainer/PushContainer.tsx`)

**役割**: 新規Todo作成のボタンコンテナ

**機能**:
- 新規Todo作成ボタンの表示
- EditModalの開閉制御

**Props**: なし

**依存関係**:
- `TodoContext`
- `EditModal`

**主な機能**:
- 編集中でない場合のみ新規作成ボタンを表示
- モーダル状態の管理

---

### 3. AddList (`elements/Add/AddList.tsx`)

**役割**: 新しいリストを追加するコンポーネント

**機能**:
- リスト名の入力
- バリデーション（空文字、重複チェック）
- 追加/キャンセル操作

**Props**: なし

**依存関係**:
- `TodoContext`（listHooks）

**バリデーション**:
- `addListNull`: 空文字チェック
- `addListSame`: 重複チェック

**状態管理**:
- `addBtn`: 入力フォームの表示/非表示

---

### 4. AddTodo (`elements/Add/AddTodo.tsx`)

**役割**: 指定されたステータスに新しいTodoを追加するコンポーネント

**Props**:
- `status: string` - 追加先のステータス

**機能**:
- Todoテキストの入力（複数行対応）
- ステータスごとの表示制御
- バリデーション

**依存関係**:
- `TodoContext`（todoHooks）

**主な機能**:
- `addTodoOpenStatus`でコンポーネントの開閉状態を管理
- 複数行テキスト入力対応
- エラー時は開いたまま、成功時は自動で閉じる

---

### 5. ErrorDisplay (`elements/Error/ErrorDisplay.tsx`)

**役割**: エラー表示用の汎用コンポーネント

**Props**:
- `message: string` - エラーメッセージ
- `onRetry?: () => void` - 再試行関数（オプション）

**機能**:
- エラーアイコンとメッセージの表示
- 再試行ボタン（カスタム関数またはページリロード）

**デザイン**:
- 中央配置のエラー表示
- Material-UIのエラーカラーテーマ使用

---

### 6. DeleteModal (`elements/Modal/DeleteModal.tsx`)

**役割**: 削除確認モーダル

**Props**:
- `title: string` - 削除対象のタイトル
- `modalIsOpen: boolean` - モーダルの開閉状態
- `onDelete: () => void` - 削除実行関数
- `setModalIsOpen: (open: boolean) => void` - モーダル状態更新関数
- `setSelectModalIsOpen?: (open: boolean) => void` - 選択モーダル状態更新関数

**機能**:
- 削除確認ダイアログ
- リスト削除時の警告表示
- OK/キャンセルボタン

---

### 7. EditModal (`elements/Modal/EditModal.tsx`)

**役割**: Todo編集/新規作成モーダル

**Props**:
- `todo?: TodoType` - 編集対象のTodo（新規作成時はundefined）
- `id: string` - モーダルの識別子
- `modalIsOpen: boolean` - モーダルの開閉状態
- `setModalIsOpen: (open: boolean) => void` - モーダル状態更新関数

**機能**:
- Todo内容の編集/新規作成
- ステータス選択
- 更新日時の表示
- バリデーション

**特徴**:
- `id === 'pushContainer'`で新規作成モードを判定
- メモ化による最適化
- 複数行テキスト入力対応

---

### 8. SelectListModal (`elements/Modal/SelectListModal.tsx`)

**役割**: リスト操作メニューモーダル

**Props**:
- `id: string` - リストID
- `listNumber: number` - リストの順番
- `listLength: number` - 全リスト数
- `setSelectModalIsOpen: (open: boolean) => void` - モーダル状態更新
- `setDeleteIsModalOpen: (open: boolean) => void` - 削除モーダル状態更新
- `setTextRename: (rename: boolean) => void` - リネーム状態更新

**機能**:
- リストの左右移動
- リスト削除
- リスト名変更

**動的表示**:
- リストの位置（最初/最後/中間）に応じて移動ボタンを表示

---

### 9. StatusPullList (`elements/Status/StatusPullList.tsx`)

**役割**: ステータス選択用プルダウン

**Props**:
- `pullDownList: ListType[]` - 選択可能なリスト
- `input: {status: string}` - 現在の入力値
- `error: boolean` - エラー状態
- `setInput: (input: {status: string}) => void` - 入力値更新関数

**機能**:
- オートコンプリート形式のステータス選択
- バリデーション表示

**使用場所**:
- EditModal内でのステータス選択

---

### 10. StatusTitle (`elements/Status/StatusTitle.tsx`)

**役割**: リストタイトルとその操作機能

**Props**:
- `id: string` - リストID
- `title: string` - リストタイトル
- `listNumber: number` - リストの順番

**機能**:
- リストタイトルの表示/編集
- ドラッグ&ドロップハンドル
- メニュー表示
- リアルタイム編集

**特徴**:
- インライン編集機能
- フォーカス制御
- 外部クリック検知
- メモ化による最適化

---

### 11. TodoList (`elements/TodoList/TodoList.tsx`)

**役割**: 個別Todoアイテムの表示と操作

**Props**:
- `todo: TodoType` - 表示するTodo

**機能**:
- Todoテキストの表示（リンク・改行対応）
- 完了/未完了の切り替え（ピン機能）
- 編集・削除操作

**特徴**:
- テキストフォーマット機能（URL自動リンク、改行対応）
- useMemoによる表示最適化
- モバイル対応のアイコンサイズ調整

---

## 共通仕様

### コンテキスト依存関係
全コンポーネントは`TodoContext`を通じて以下のフックを使用：
- `todoHooks`: Todo関連の操作
- `listHooks`: リスト関連の操作
- `deleteListHooks`: リスト削除操作
- `updateStatusAndCategoryHooks`: ステータス更新操作

### レスポンシブ対応
- `@media (max-width: 767px)`: モバイル用スタイル
- フォントサイズ、パディング、アイコンサイズの調整

### 最適化
- `React.memo`による再レンダリング抑制
- `useCallback`によるコールバック最適化
- `useMemo`による計算結果キャッシュ

### バリデーション
- 空文字チェック
- 重複チェック
- エラーメッセージの表示