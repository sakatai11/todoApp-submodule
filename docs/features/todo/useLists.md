# useLists Hook

## 1. 概要

- Todoリスト（カテゴリ）の状態管理と操作を行うカスタムフック。
- リスト追加、ドラッグ&ドロップ並び替え、ボタン移動機能を提供。

## 2. パラメータ

```typescript
initialLists: StatusListProps[]
```

## 3. 戻り値

### State
- `lists`: リスト項目配列
- `input`: 入力フォームの状態（status）
- `error`: エラー状態（addListNull, addListSame）

### Actions
- `addList`: リスト追加
- `handleDragEnd`: ドラッグ&ドロップ並び替え
- `handleButtonMove`: ボタンでの左右移動

### Setters
- `setLists`, `setInput`, `setError`

## 4. 主要機能

### リスト追加 (`addList`)
1. 入力バリデーション（status必須）
2. 重複チェック（`checkDuplicateCategory`）
3. 番号の連続性確保（既存リストの番号振り直し）
4. サーバーサイドAPI呼び出し
5. クライアントサイド状態更新

### ドラッグ&ドロップ並び替え (`handleDragEnd`)
1. @dnd-kit/coreのDragEndEventを処理
2. `arrayMove`での配列並び替え
3. 番号の再設定（index + 1）
4. サーバーサイド順序更新（reorderタイプ）

### ボタン移動 (`handleButtonMove`)
1. 移動方向の計算（right/left）
2. 境界チェック（配列の範囲内）
3. 無効な移動の回避
4. 配列並び替えと番号再設定
5. サーバーサイド順序更新

## 5. バリデーション

### 重複チェック (`checkDuplicateCategory`)
- 既存リストとのカテゴリ名重複を防止
- エラー状態`addListSame`で通知

## 6. API連携

- `/api/lists` エンドポイントとの連携
- POST（追加）、PUT（順序変更）
- 型安全なAPI呼び出し：`apiRequest<ListPayload<Method>, ListResponse<Method>>`

## 7. エラー管理

- `addListNull`: リスト名が空の場合
- `addListSame`: 重複するリスト名の場合

## 8. 依存関係

- `@dnd-kit/core`: ドラッグ&ドロップ機能
- `@dnd-kit/sortable`: 配列並び替えユーティリティ