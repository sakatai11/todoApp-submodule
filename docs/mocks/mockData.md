# モックデータ定義

## 1. 概要

- 開発・テスト用のサンプルデータ定義。
- 型安全なモックデータによる開発環境の構築。

## 2. データ構造 (data/index.ts)

### 統合エクスポート
```typescript
export const contents = {
  todos,
  lists,
};

export const user = mockUser;
```

**目的**: 各機能のモックデータを統一的に管理

## 3. ユーザーデータ (data/user.ts)

### MockUserData
```typescript
export const mockUser: MockUserData[] = [
  {
    id: 'user-data-1',
    email: 'example@test.com',
    createdAt: new Date(1744749991599).toISOString(),
    role: 'USER',
  },
];
```

**特徴**:
- `MockUserData`型の使用（日付は文字列）
- 単一ユーザーでの基本テスト対応
- USER権限での一般的な使用パターン

## 4. Todoデータ (data/todos.ts)

### サンプルTodo項目
```typescript
const mockTodos: MockTodoListProps[] = [
  {
    id: 'todo-1',
    updateTime: new Date(1746271892078).toISOString(),
    createdTime: new Date(1746271892078).toISOString(),
    text: 'Next.js App Routerの学習',
    status: 'in-progress',
    bool: true,
  },
  // ... 他のTodo項目
];
```

### データパターン
1. **技術学習系**: Next.js、Nuxt3の学習項目
2. **実装系**: MSW実装、TypeScript最適化
3. **ステータス分類**: todo、in-progress、done
4. **完了状態**: bool フィールドでの切り替え

### 時系列データ
- 異なる作成日時での並び替えテスト
- 更新日時によるソート動作確認

## 5. リストデータ (data/lists.ts)

### ステータスカテゴリ
```typescript
const mockLists: StatusListProps[] = [
  { id: 'list-1', category: 'todo', number: 1 },
  { id: 'list-2', category: 'in-progress', number: 2 },
  { id: 'list-3', category: 'done', number: 3 },
];
```

**特徴**:
- 基本的な3段階ワークフロー
- number フィールドでの順序管理
- ドラッグ&ドロップテスト対応

## 6. データ設計思想

### リアルなワークフロー
- 実際の開発プロジェクトを模擬
- 学習・実装・完了の自然な流れ

### 型安全性
- 各データが対応する型定義に準拠
- コンパイル時の整合性チェック

### テストケース網羅
- 異なるステータスでの動作確認
- 完了/未完了状態の両パターン
- 日時ソートの動作検証

## 7. 日付データの扱い

### ISO文字列形式
```typescript
new Date(1746271892078).toISOString()
```

**利点**:
- JSON シリアライゼーション対応
- タイムゾーン情報の保持
- フロントエンドでの Date オブジェクト変換容易

## 8. 拡張性

### データ追加パターン
- 配列への新規項目追加
- 既存項目の属性拡張
- 新しいステータスの導入

### 環境別データ
- 開発環境: 豊富なサンプルデータ
- テスト環境: 最小限の検証データ
- デモ環境: 見栄えの良いプレゼン用データ