# ユニットテストガイド

## 概要

Next.js Todoアプリケーションのユニットテスト（Unit Test）の実行方法とガイドラインについて説明します。Vitestを使用した高速で効率的なテスト実行により、コンポーネントとロジックの品質を確保します。

## 🧪 ユニットテストの対象

### テスト種別と分類

#### 1. Unit Tests (単体テスト)
**対象**: 個別の関数・フック・ユーティリティ  
**範囲**: 1つの機能単位を分離してテスト  
**依存関係**: 外部依存をモックして排除

- **Hooks**: `useTodos.test.ts` - カスタムフックのロジック検証
- **Utils**: 個別のユーティリティ関数（例：formatter関数）

#### 2. Integration Tests (統合テスト)
**対象**: 複数のモジュール・システムの連携  
**範囲**: Context + Hooks、データフローの検証  
**依存関係**: 実際の連携を保ちつつテスト

- **Context + Hooks**: `TodoContext.test.tsx` - プロバイダーとフックの連携
- **Data Flow**: 状態管理とビジネスロジックの統合

#### 3. Component Tests (コンポーネントテスト)
**対象**: UIコンポーネント全体  
**範囲**: レンダリング + ユーザーインタラクション + UI統合  
**依存関係**: 必要なプロバイダーと組み合わせてテスト

- **MainContainer**: UI全体 + DnD機能 + レスポンシブ対応
- **TodoList**: Todo表示 + インタラクション + モーダル制御
- **AddTodo**: フォームUI + ユーザー操作 + バリデーション

### 使用技術スタック
- **Vitest**: 高速なテストランナー
- **@testing-library/react**: React コンポーネントのテスト
- **@testing-library/jest-dom**: 追加のマッチャー
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **MSW (Mock Service Worker)**: API モック

### テスト実行結果
✅ **全テスト成功** - 高品質テストコードベース達成
- **テストファイル数**: 22ファイル（全機能網羅）
- **総テスト数**: 413テスト
- **成功率**: 100% (413/413 passing)
- **カバレッジ**: 高カバレッジ - 全主要コンポーネント・フック・コンテキストをカバー
- **品質**: ESLint準拠、TypeScript型安全性確保、表記統一ルール適用
- **データ統合**: 全テストファイルでサブモジュールモックデータを統一使用

## 🚀 ユニットテストの実行方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install
```

### ⚡ 2. ローカル環境での実行（推奨）

```bash
# ユニットテストの実行（watchモード）
npm run test

# UIモードでの実行（推奨：視覚的なテスト管理）
npm run test:ui

# 1回だけ実行
npm run test:run

# カバレッジレポート付きで実行
npm run test:coverage
```

#### ローカル実行のメリット
- ⚡ **高速実行**: Docker起動のオーバーヘッドなし
- 🔄 **即座のフィードバック**: ファイル変更時の自動再実行
- 💻 **開発効率**: IDEとの統合による快適な開発体験
- 🎯 **単体テストの本質**: 外部依存を排除した純粋なロジックテスト

## 🎯 テスト設計原則

### テストの独立性
- 各テストは他のテストに依存しない
- テスト実行順序に関係なく成功する
- モック・スタブを適切に使用して外部依存を排除

### データ統一性
- **サブモジュールデータの使用**: 全テストで統一されたモックデータを使用
- **表記統一ルール**: テスト説明文の一貫した表記（「正常に〜」パターン）
- **型安全性**: TypeScript strict mode + ESLint準拠

## ⚙️ テスト設定と環境

### Vitest設定

ユニットテストの設定は `vitest.config.ts` で管理されています：

- **jsdom環境**: ブラウザAPIのモック
- **プラグイン設定**: React テスト用プラグイン
- **パスエイリアス**: `@/` による絶対パス解決
- **グローバル設定**: テスト用のグローバル設定

### モック設定

#### 外部ライブラリのモック
```typescript
// @dnd-kit関連
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  closestCenter: vi.fn(),
}));

// API関数のモック
vi.mock('@/features/libs/apis', () => ({
  apiRequest: vi.fn(),
}));
```

#### ブラウザAPIのモック
- **matchMedia**: メディアクエリテスト用
- **ResizeObserver**: レスポンシブ動作テスト用
- **DragEvent**: ドラッグ&ドロップテスト用
- **IntersectionObserver**: スクロール動作テスト用

### テストデータ管理

#### サブモジュールデータの統一使用

**重要**: 全テストファイルでサブモジュールデータを統一使用

```typescript
// ✅ 推奨: サブモジュールデータを使用
import { mockTodos, mockLists } from '@/tests/test-utils';

// サブモジュールのモックデータを使用（Firebase Timestamp形式に自動変換済み）
const todos = mockTodos; // 5つのTodoアイテム
const lists = mockLists; // 3つのステータスリスト（'in-progress', 'done', 'todo'）

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

#### カスタムテストデータの作成
```typescript
import { createTestTodo, createTestList } from '@/tests/test-utils';

// カスタムテストデータの作成
const customTodo = createTestTodo({ text: 'Custom Todo' });
const customList = createTestList({ category: 'custom' });
```

#### API モック (MSW)
- `todoApp-submodule/mocks/`: MSW ハンドラーとモックデータ
- `todoApp-submodule/mocks/data/todos.ts`: 5つのTodoアイテム（MockTodoListProps形式）
- `todoApp-submodule/mocks/data/lists.ts`: 3つのステータスリスト
- テスト実行時に自動的にAPIコールをモック
- テストユーティリティでFirebase Timestamp形式に自動変換

## 📁 テストファイル構造

### ディレクトリ構成
```
tests/
├── setup.ts                    # グローバルテスト環境設定
├── test-utils.tsx              # カスタムレンダー関数とユーティリティ
└── features/                   # 機能別テストファイル（22ファイル）
    ├── libs/                   # 共通ライブラリテスト
    ├── shared/                 # 共通コンポーネントテスト
    ├── todo/                   # Todo機能のテスト
    │   ├── components/         # Todoコンポーネントテスト（13ファイル）
    │   ├── contexts/           # TodoContextテスト
    │   ├── hooks/              # Todo関連フックテスト（4ファイル）
    │   └── templates/          # TodoWrapperテンプレートテスト
    └── utils/                  # ユーティリティ関数テスト（4ファイル）
```

### 命名規則
- **ファイル名**: `{ComponentName}.test.tsx` or `{hookName}.test.ts`
- **テストID**: `data-testid` 属性を使用してコンポーネント要素を識別
- **describe構造**: 機能別にグループ化

## 🔄 テストパターンとベストプラクティス

### テストの構造化

```typescript
describe('ComponentName', () => {
  describe('レンダリング', () => {
    it('正常にレンダリングされる', () => {
      // テストコード
    });
  });

  describe('インタラクション', () => {
    it('ユーザー操作が正常に動作する', () => {
      // テストコード
    });
  });

  describe('エラーハンドリング', () => {
    it('エラー時に正常に処理される', () => {
      // テストコード
    });
  });
});
```

### コンポーネントテスト例
```typescript
// 例：コンポーネントテスト
describe('TodoList', () => {
  it('Todo削除モーダルが正常に表示される', () => {
    render(<TodoList todo={mockTodos[0]} />);
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    fireEvent.click(deleteButton!);
    expect(screen.getByText('削除しても問題ないですか？')).toBeInTheDocument();
  });
});
```

### フックテスト例
```typescript
// 例：フックの単体テスト
describe('useTodos', () => {
  it('Todoを正常に追加する', () => {
    const { result } = renderHook(() => useTodos(mockTodos));
    act(() => result.current.addTodo('新しいTodo'));
    expect(result.current.todos).toHaveLength(6);
  });
});
```

### Context統合テスト例
```typescript
// 例：Context統合テスト
describe('TodoContext', () => {
  it('プロバイダーとフックの連携が正常に動作する', () => {
    const { result } = renderHook(() => useTodoContext(), {
      wrapper: createWrapper(mockTodos, mockLists)
    });
    expect(result.current.todoHooks.todos).toEqual(mockTodos);
  });
});
```

### ユーザー中心のテスト

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

### 非同期処理のテスト

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

### カスタムレンダー関数の使用

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

## 🐛 トラブルシューティング

### よくある問題と解決方法

1. **TypeScriptエラー**: 必要なパッケージがインストールされているか確認
2. **MSWエラー**: `npm run msw:init` でMSWを初期化
3. **モックエラー**: `tests/setup.ts` の設定を確認
4. **Firebase Timestampエラー**: サブモジュールのモックデータが正しく変換されているか確認
5. **React 19互換性エラー**: Testing Libraryのバージョンを確認

#### Firebase Timestampエラー
```typescript
// 解決: test-utils.tsxのconvertMockTodosToTimestamp関数を使用
const todos = convertMockTodosToTimestamp(mockTodos);
```

#### React 19互換性エラー
```bash
# 適切なバージョンを使用
npm install --legacy-peer-deps
```

#### MSW関連エラー
```bash
# MSWを初期化
npm run msw:init
```

### デバッグテクニック
```typescript
// DOM構造の確認
screen.debug();

// 特定要素の確認
screen.debug(screen.getByTestId('element-id'));

// エラーログの抑制
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
// テスト実行
consoleSpy.mockRestore();
```

## 📊 品質指標とカバレッジ

### カバレッジ目標
- **目標**: 100%カバレッジ維持
- **現状**: 高カバレッジ達成済み
- **監視**: CI/CDでのカバレッジ低下検知

### カバレッジ未達成コンポーネント

**StatusTitle.tsx** (78.69%)
- **未カバー範囲**: 86行目、111-128行目、132行目
- **理由**: 編集モードの高度に複雑な条件分岐
- **具体的な未カバー範囲**:
  - `setIsStatus(updateStatus)` - 編集処理失敗時の状態更新
  - 編集モード時の入力フィールドレンダリング (111-128行目)
  - `title` 表示の条件分岐 (132行目)

**TodoWrapper.tsx** (80.64%)
- **未カバー範囲**: 21-31行目、36行目、80-81行目
- **理由**: fetcher関数とErrorBoundaryのエラーハンドリングの一部条件
- **具体的な未カバー範囲**:
  - fetcher関数のエラーレスポンス処理 (21-31行目)
  - 環境変数を使用したbaseURL構築 (36行目)
  - TodoErrorBoundaryコンポーネント (80-81行目)

**100%達成が困難な技術的理由**:
1. **モック環境の限界**: モックされた関数では実際の非同期処理やエラーケースを完全に再現できない
2. **Reactライフサイクル**: useEffectの依存関係やErrorBoundaryのエラーキャッチ機能はテスト環境での再現が限定的
3. **環境依存コード**: Node.js環境変数やブラウザAPIの完全なシミュレーションは困難

### パフォーマンス
- **実行速度**: 高速なローカル実行
- **フィードバック**: 即座のテスト結果表示
- **開発効率**: watchモードによる自動再実行

### 継続的な改善

#### 新規テストの追加ガイドライン

新しいコンポーネントや機能を追加する際のベストプラクティス：

1. **データソース**: サブモジュールの統一モックデータを使用
2. **テストファイル作成**: 既存パターンに従った構造化
3. **期待値設定**: 実際のサブモジュールデータに基づく動的な期待値
4. **モック追加**: 必要に応じて`tests/setup.ts`に追加
5. **テスト実行**: `npm run test:coverage`で確認

## 🔗 CI/CD統合

### GitHub Actions設定例
```yaml
# .github/workflows/unit-tests.yml
- name: Run Unit Tests
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### 並列実行
- **高速実行**: 他のテスト種別と並列実行可能
- **リソース効率**: ローカル実行による軽量性
- **継続的実行**: 開発中の常時テスト実行

## 📋 関連ドキュメント

- [IT_TEST.md](IT_TEST.md) - 統合テスト環境選択ガイド
- [E2E_TEST.md](E2E_TEST.md) - E2Eテストガイド
- [../DOCKER_TESTING.md](../DOCKER_TESTING.md) - Docker統合テスト環境
- [../../tests/CLAUDE.md](../../../tests/CLAUDE.md) - テスト実装ガイドライン

---

**💡 まとめ**: ユニットテストにより、コンポーネントとロジックの基盤となる品質を高速かつ確実に検証できます。