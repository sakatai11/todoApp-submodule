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
# テストの実行
npm run test

# テストの監視モード
npm run test

# テストをUIで実行
npm run test:ui

# 一度だけテストを実行
npm run test:run

# カバレッジレポート付きでテスト実行
npm run test:coverage
```

## パッケージのインストール

テスト関連パッケージをインストールしてください：

```bash
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

## テストの種類

### 1. Unit Tests (単体テスト)

- **Hooks**: `useTodos.test.ts`
- **Utils**: 個別のユーティリティ関数
- **Components**: 個別のUIコンポーネント

### 2. Integration Tests (統合テスト)

- **Context + Hooks**: `TodoContext.test.tsx`
- **Component + Context**: UIコンポーネントとステート管理の連携

### 3. Component Tests (コンポーネントテスト)

- **MainContainer**: メインコンテナの表示とDnD機能
- **TodoList**: Todo項目の表示と操作
- **AddTodo**: Todo追加フォーム

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
const todos = mockTodos; // 4つのTodoアイテム
const lists = mockLists; // 3つのリスト（in-progress, done, todo）

// カスタムテストデータの作成
const customTodo = createTestTodo({ text: 'Custom Todo' });
const customList = createTestList({ category: 'custom' });
```

## モック設定

### API モック (MSW)

- `todoApp-submodule/mocks/`: MSW ハンドラーとモックデータ
- `todoApp-submodule/mocks/data/todos.ts`: 4つのTodoアイテム（MockTodoListProps形式）
- `todoApp-submodule/mocks/data/lists.ts`: 3つのステータスリスト
- テスト実行時に自動的にAPIコールをモック
- テストユーティリティでFirebase Timestamp形式に自動変換

### 外部依存関係のモック

- `next/navigation`: Next.js ルーティング
- `next-auth/react`: 認証
- `firebase-admin`: Firebase Admin SDK
- `@dnd-kit/*`: ドラッグ&ドロップライブラリ

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

### カバレッジの確認

```bash
npm run test:coverage
```

## 継続的な改善

### テストの追加

新しいコンポーネントや機能を追加する際は、対応するテストも作成してください：

1. コンポーネント/フックの作成
2. テストファイルの作成
3. 必要に応じてモックの追加
4. テストの実行と確認

## 参考資料

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)