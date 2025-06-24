# テスト実装ガイド

## テスト環境

このプロジェクトではVitestを使用してテストを実装しています。

### 使用技術

- **Vitest**: 高速なテストランナー
- **@testing-library/react**: React コンポーネントのテスト
- **@testing-library/jest-dom**: 追加のマッチャー
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **MSW (Mock Service Worker)**: API モック

## テストの実行

```bash
# テストをwatch モードで実行
npm run test

# テストをUIで実行
npm run test:ui

# 一度だけテストを実行
npm run test:run

# カバレッジレポート付きでテスト実行
npm run test:coverage
```

## 環境要件

テスト環境は既に構築済みです。必要なパッケージ：

```bash
# 既にインストール済み（参考）
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react @vitest/coverage-v8
```

## テスト構成

### ディレクトリ構造

```
tests/
├── setup.ts                          # テスト環境のセットアップ
├── test-utils.tsx                     # テスト用のユーティリティ
└── features/
    └── todo/
        ├── contexts/
        │   └── TodoContext.test.tsx   # TodoContext のテスト
        ├── hooks/
        │   └── useTodos.test.ts       # useTodos フックのテスト
        └── components/
            ├── MainContainer/
            │   └── MainContainer.test.tsx
            └── elements/
                ├── TodoList/
                │   └── TodoList.test.tsx
                └── Add/
                    └── AddTodo.test.tsx
```

### 設定ファイル

- `vitest.config.ts`: Vitest の設定
- `tests/setup.ts`: テスト環境のグローバル設定
- `tests/test-utils.tsx`: カスタムレンダー関数とモックデータ

## テストの種類と分類

### 1. Unit Tests (単体テスト)
**対象**: 個別の関数・フック・ユーティリティ  
**範囲**: 1つの機能単位を分離してテスト  
**依存関係**: 外部依存をモックして排除

- **Hooks**: `useTodos.test.ts` - カスタムフックのロジック検証
- **Utils**: 個別のユーティリティ関数（例：formatter関数）

**特徴**:
```typescript
// 例：フックの単体テスト
const { result } = renderHook(() => useTodos(mockTodos));
act(() => result.current.addTodo('新しいTodo'));
expect(result.current.todos).toHaveLength(6);
```

### 2. Integration Tests (統合テスト)
**対象**: 複数のモジュール・システムの連携  
**範囲**: Context + Hooks、データフローの検証  
**依存関係**: 実際の連携を保ちつつテスト

- **Context + Hooks**: `TodoContext.test.tsx` - プロバイダーとフックの連携
- **Data Flow**: 状態管理とビジネスロジックの統合

**特徴**:
```typescript
// 例：Context統合テスト
const { result } = renderHook(() => useTodoContext(), {
  wrapper: createWrapper(mockTodos, mockLists)
});
expect(result.current.todoHooks.todos).toEqual(mockTodos);
```

### 3. Component Tests (コンポーネントテスト)
**対象**: UIコンポーネント全体  
**範囲**: レンダリング + ユーザーインタラクション + UI統合  
**依存関係**: 必要なプロバイダーと組み合わせてテスト

- **MainContainer**: UI全体 + DnD機能 + レスポンシブ対応
- **TodoList**: Todo表示 + インタラクション + モーダル制御
- **AddTodo**: フォームUI + ユーザー操作 + バリデーション

**特徴**:
```typescript
// 例：コンポーネントテスト
render(<TodoList todo={mockTodos[0]} />);
const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
fireEvent.click(deleteButton!);
expect(screen.getByText('削除しても問題ないですか？')).toBeInTheDocument();
```

## テストユーティリティ

### カスタムレンダー関数

```typescript
import { render } from '@/tests/test-utils';

// 必要なプロバイダーでラップしたレンダー
render(<Component />, {
  withTodoProvider: true,
  withSession: true,
  initialTodos: customTodos,
  initialLists: customLists,
});
```

### モックデータ

```typescript
import { mockTodos, mockLists, createTestTodo, createTestList } from '@/tests/test-utils';

// サブモジュールのモックデータを使用（Firebase Timestamp形式に変換済み）
const todos = mockTodos; // 5つのTodoアイテム
const lists = mockLists; // 3つのリスト（in-progress, done, todo）

// カスタムテストデータの作成
const customTodo = createTestTodo({ text: 'Custom Todo' });
const customList = createTestList({ category: 'custom' });
```

## モック設定

### API モック (MSW)

- `todoApp-submodule/mocks/`: MSW ハンドラーとモックデータ
- `todoApp-submodule/mocks/data/todos.ts`: 5つのTodoアイテム（MockTodoListProps形式）
- `todoApp-submodule/mocks/data/lists.ts`: 3つのステータスリスト
- テスト実行時に自動的にAPIコールをモック
- テストユーティリティでFirebase Timestamp形式に自動変換

### 外部依存関係のモック

- `next/navigation`: Next.js ルーティング
- `next-auth/react`: 認証
- `firebase-admin`: Firebase Admin SDK
- `@dnd-kit/*`: ドラッグ&ドロップライブラリ

## データ一貫性とベストプラクティス

### サブモジュールデータ統合

**重要**: 全テストファイルでサブモジュールデータを統一使用

```typescript
// ✅ 推奨: サブモジュールデータを使用
import { mockTodos, mockLists } from '@/tests/test-utils';

// 実際のデータに基づいたテスト
expect(screen.getByText('Next.js App Routerの学習')).toBeInTheDocument();
expect(screen.getByText('in-progress')).toBeInTheDocument();

// ❌ 非推奨: 独自モックデータの定義
const customMockData = [{ id: 'test-1', text: 'Custom Todo' }];
```

**サブモジュールデータ詳細**:
- **Todoデータ**: 'Next.js App Routerの学習', 'Nuxt3の学習', 'MSWの実装', 'TypeScript最適化', 'Line 1\nLine 2\nLine 3'
- **リストデータ**: 'in-progress', 'done', 'todo'
- **自動変換**: MockTodoListProps → Firebase Timestamp形式

## テストのベストプラクティス

### 1. テストの構造化

```typescript
describe('ComponentName', () => {
  describe('レンダリング', () => {
    it('正常にレンダリングされる', () => {
      // テストコード
    });
  });

  describe('インタラクション', () => {
    it('ボタンクリックで適切に動作する', () => {
      // テストコード
    });
  });

  describe('エラーハンドリング', () => {
    it('エラー時に適切に処理される', () => {
      // テストコード
    });
  });
});
```

### 2. ユーザー中心のテスト

```typescript
import userEvent from '@testing-library/user-event';

it('ユーザーがテキストを入力できる', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  const input = screen.getByLabelText('テキスト入力');
  await user.type(input, 'テストテキスト');
  
  expect(input).toHaveValue('テストテキスト');
});
```

### 3. 非同期処理のテスト

```typescript
it('非同期処理が正常に完了する', async () => {
  render(<Component />);
  
  const button = screen.getByText('送信');
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('成功')).toBeInTheDocument();
  });
});
```

## トラブルシューティング

### よくある問題

1. **TypeScriptエラー**: 必要なパッケージがインストールされているか確認
2. **MSWエラー**: `npm run msw:init` でMSWを初期化
3. **モックエラー**: `tests/setup.ts` の設定を確認
4. **Firebase Timestampエラー**: サブモジュールのモックデータが正しく変換されているか確認
5. **React 19互換性エラー**: Testing Libraryのバージョンを確認

### デバッグ

```typescript
import { screen } from '@testing-library/react';

// デバッグ情報の出力
screen.debug();

// 特定要素のデバッグ
screen.debug(screen.getByText('テキスト'));
```

## テスト実装状況

### 現在のテスト結果

✅ **全テスト成功** - 100%カバレッジ達成
- **テストファイル数**: 5ファイル（TodoContext、useTodos、MainContainer、TodoList、AddTodo）
- **総テスト数**: 76テスト
- **成功率**: 100% (76/76 passing)
- **カバレッジ**: 100% - 全コンポーネント・フック・コンテキストをカバー
- **品質**: ESLint準拠、TypeScript型安全性確保、適切なエラーハンドリング
- **データ統合**: 全テストファイルでサブモジュールモックデータを統一使用

### カバレッジの確認

```bash
npm run test:coverage
```

## 継続的な改善

### 新規テストの追加ガイドライン

新しいコンポーネントや機能を追加する際のベストプラクティス：

1. **データソース**: サブモジュールの統一モックデータを使用
2. **テストファイル作成**: 既存パターンに従った構造化
3. **期待値設定**: 実際のサブモジュールデータに基づく動的な期待値
4. **モック追加**: 必要に応じて`tests/setup.ts`に追加
5. **テスト実行**: `npm run test:coverage`で確認

### 品質チェックリスト

- [ ] サブモジュールデータを使用している
- [ ] ハードコーディングされた値がない
- [ ] ESLint準拠・TypeScript型安全性確保
- [ ] 適切なエラーハンドリング
- [ ] カバレッジ100%を維持

## 参考資料

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)