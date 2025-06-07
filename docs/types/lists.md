# リスト型定義 (lists.ts)

## 1. 概要

- Todoリスト（カテゴリ）機能に関する型定義ファイル。
- リストのCRUD操作、ドラッグ&ドロップ、並び替え機能の型を定義。

## 2. 基本型定義

### StatusListProps
```typescript
export type StatusListProps = {
  id: string;
  category: string;
  number: number;
};
```
**フィールド説明**:
- `id`: リストの一意識別子
- `category`: カテゴリ名（表示名）
- `number`: 表示順序（ソート用）

## 3. APIペイロード型定義

### ListPayload
```typescript
export type ListPayload<T extends 'POST' | 'DELETE' | 'PUT'>
```

#### HTTPメソッド別の型定義

**POST**: リスト作成時
```typescript
Omit<StatusListProps, 'id'>  // id以外のフィールドが必要
// { category: string; number: number; }
```

**DELETE**: リスト削除時
```typescript
Pick<StatusListProps, 'id'>  // idのみ必要
// { id: string; }
```

**PUT**: リスト更新時（Union型）
```typescript
| {
    type: 'reorder';
    data: string[];  // 新しい順序のID配列
  }
| {
    type: 'update';
    id: string;
    data: Partial<Pick<StatusListProps, 'category'>>;  // カテゴリ名のみ更新
  }
```

## 4. フック型定義

### ListHookType
```typescript
export type ListHookType = BaseHookType<
  { status: string },                                    // 入力型
  { addListNull: boolean; addListSame: boolean }       // エラー型
> & {
  lists: StatusListProps[];
  setLists: (lists: StatusListProps[]) => void;
  addList: () => Promise<boolean>;
  handleDragEnd: (event: DragEndEvent) => void;
  handleButtonMove: (id: string, direction: 'right' | 'left') => void;
};
```

**機能説明**:
- `addList`: リスト追加（重複チェック付き）
- `handleDragEnd`: ドラッグ&ドロップでの並び替え
- `handleButtonMove`: ボタンクリックでの左右移動

**エラー型**:
- `addListNull`: リスト名が空の場合
- `addListSame`: 重複するリスト名の場合

## 5. レスポンス型定義

### ListResponse
HTTPメソッド別のAPIレスポンス型

**POST**: 作成完了時
```typescript
{
  id?: string;
  category?: string;
  number?: number;
  error?: string;
}
```

**PUT/DELETE**: 更新・削除完了時
```typescript
{
  message?: string;
  error?: string;
}
```

## 6. ドラッグ&ドロップ対応

### DragEndEvent
```typescript
import { DragEndEvent } from '@dnd-kit/core';
```
- `@dnd-kit/core`ライブラリのイベント型を使用
- ドラッグ&ドロップ操作の詳細情報を提供

### 並び替え処理
1. **reorderタイプ**: ID配列による順序変更
2. **number フィールド**: 表示順序の管理
3. **一括更新**: トランザクションでの整合性保証

## 7. 設計特徴

### 型安全な操作分類
- 条件型による操作種別の厳密な分離
- Union型による複数更新パターンの対応

### 順序管理
- `number`フィールドによる明示的な順序制御
- ドラッグ&ドロップとボタン操作の両対応

### バリデーション対応
- 重複チェック機能の型定義
- エラー状態の詳細な分類