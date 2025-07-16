# TodoWrapper

## 1. 概要

- Todo機能全体のエントリーポイント兼データ取得レイヤー
- SWRを使用したサーバーサイドデータ取得とクライアントサイド状態管理の橋渡し
- エラーバウンダリと事前読み込み最適化を統合したラッパーコンポーネント

## 2. 構成要素

### メインコンポーネント

- `TodoWrapper`: 最上位のラッパーコンポーネント
- `TodoContent`: データ取得とレンダリングを担当
- `TodoErrorBoundary`: エラー境界のフォールバックコンポーネント

### 設定要素

- `fetcher`: SWR用のデータ取得関数
- `apiUrl`: 環境別API URLの動的構築
- `preload`: クライアント事前読み込み設定

## 3. Props

### TodoWrapper

```typescript
// Propsなし - 完全に自己完結型
```

### TodoContent

```typescript
// 内部コンポーネント - 外部Propsなし
```

### TodoErrorBoundary

```typescript
interface TodoErrorBoundaryProps {
  error: Error;
}
```

## 4. データフェッチング戦略

### API エンドポイント

- **URL**: `/api/dashboards`
- **メソッド**: GET
- **認証**: セッション情報（`credentials: 'include'`）

### 環境別URL構築

```typescript
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXTAUTH_URL // サーバー環境
    : ''; // クライアント環境（相対パス）
```

### レスポンス型

```typescript
type DataProps = {
  contents: {
    todos: TodoListProps[];
    lists: StatusListProps[];
  };
};
```

## 5. SWR設定

### グローバル設定（SWRConfig）

```typescript
{
  suspense: true,                // Suspenseモード有効
  revalidateOnFocus: false      // フォーカス時の再検証無効
}
```

### ローカル設定（useSWR）

```typescript
{
  revalidateOnMount: true,      // マウント時の再検証有効
  revalidateOnFocus: false,     // フォーカス時の再検証無効
  revalidateOnReconnect: false, // 再接続時の再検証無効
  suspense: false,              // ローカルではSuspense無効
  shouldRetryOnError: false     // エラー時の自動リトライ無効
}
```

## 5.1. useSWR使用パターン

### 基本的な使用方法
```typescript
// TodoWrapper.tsx - 初期データ取得のみ
const { data, error, isLoading } = useSWR<DataProps>(
  '/api/dashboards',
  fetcher,
  {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    suspense: false,
    shouldRetryOnError: false,
  },
);

// データ取得完了後、TodoProviderに初期データを渡す
if (isLoading || !data || !data.contents) return <TodosLoading />;
if (error) return <ErrorDisplay message={error.message} />;

const { contents } = data;
const { todos, lists } = contents;

<TodoProvider initialTodos={todos} initialLists={lists}>
  <Box>
    <PushContainer />
    <MainContainer />
  </Box>
</TodoProvider>
```

### 使用箇所と役割
- **使用箇所**: TodoWrapperコンポーネントでの初期データ取得のみ
- **役割**: サーバーからのTodo・リストデータ取得とContext初期化
- **制約**: 初期データ取得後は、useSWRではなくuseStateベースの状態管理を使用

## 6. エラーハンドリング

### 3層エラーハンドリング

1. **Fetch レベル**: HTTPステータスエラーの検出と変換
2. **SWR レベル**: データ取得エラーの状態管理
3. **ErrorBoundary レベル**: 予期しないエラーのキャッチとフォールバック

### エラー表示

- 全てのエラーは`ErrorDisplay`コンポーネントで統一表示
- エラーメッセージはサーバーから取得またはデフォルトメッセージ

## 7. 最適化機能

### 事前読み込み（Preload）

```typescript
if (typeof window !== 'undefined') {
  preload(apiUrl, fetcher);
}
```

- クライアントサイドでのみ実行（SSR対応）
- 初回ページ表示の高速化

### ローディング状態

- `TodosLoading`コンポーネントによる一貫したローディング表示
- データ取得完了まで表示継続

## 8. 使用方法

### 基本的な使用

```typescript
import TodoWrapper from '@/features/todo/templates/TodoWrapper';

// ページコンポーネント内
export default function TodoPage() {
  return <TodoWrapper />;
}
```

### 依存関係の自動解決

- 初期データ（todos, lists）は自動取得
- `TodoProvider`への注入も自動実行
- 子コンポーネント（`PushContainer`, `MainContainer`）も自動レンダリング

## 9. セキュリティ考慮事項

### 認証

- セッション情報の自動送信（`credentials: 'include'`）
- サーバーサイド認証チェックに依存

### エラー情報

- サーバーエラーメッセージをそのまま表示
- 機密情報の露出を避けるためサーバー側でのエラーメッセージ制御が重要

## 10. 依存関係

### 主要ライブラリ

- `swr` - データ取得とキャッシュ管理
- `react-error-boundary` - エラーバウンダリ実装
- `@mui/material` - UI コンポーネント

### 内部依存

- `@/types/todos` - Todo型定義
- `@/types/lists` - リスト型定義
- `@/features/todo/contexts/TodoContext` - 状態管理
- `@/features/todo/components` - 子コンポーネント群
- `@/app/(dashboards)/loading` - ローディングコンポーネント

### API依存

- `/api/dashboards` - データ取得エンドポイント
- NextAuth.js認証システム

## 11. パフォーマンス特性

### 初回読み込み

- 事前読み込みによる高速化
- Suspenseモードでの並列読み込み

### 再レンダリング最適化

- 不要な再検証の無効化
- エラー時のリトライ制御

### メモリ使用量

- SWRによる自動キャッシュ管理
- 単一インスタンスでのデータ共有

## 12. 開発・デバッグ

### 開発時の注意点

- 環境変数`NEXTAUTH_URL`の設定確認
- API エンドポイントの可用性確認
- ネットワークエラー時の挙動確認

### デバッグ支援

- SWR DevToolsとの連携可能
- エラーメッセージの詳細表示
- ローディング状態の視覚的確認

## 13. 今後の対応（予定）

### mutate使用パターン（将来の改良案）

#### useSWRにおいて、基本的なmutate使用方法

```typescript
import useSWR, { mutate } from 'swr';

const { data, mutate: boundMutate } = useSWR('/api/dashboards', fetcher);

// 楽観的更新パターン
const addTodoWithMutate = async (newTodo: Omit<TodoListProps, 'id'>) => {
  const currentData = data?.contents || { todos: [], lists: [] };
  const tempId = `temp-${Date.now()}`;
  const optimisticData = {
    contents: {
      ...currentData,
      todos: [...currentData.todos, { ...newTodo, id: tempId }],
    },
  };

  try {
    // 1. 即座にUI更新（再検証なし）
    await boundMutate(optimisticData, false);

    // 2. API呼び出し
    const result = await apiRequest('/api/todos', 'POST', newTodo);

    // 3. 成功時：正しいデータで更新（一時IDを正式IDに置換）
    const finalData = {
      contents: {
        ...currentData,
        todos: [...currentData.todos, result],
      },
    };
    await boundMutate(finalData, false);
  } catch (error) {
    // 4. エラー時：元のデータに復元
    await boundMutate(data, false);
    throw error;
  }
};
```

#### 現在の実装 vs mutate実装の比較

| 項目               | 現在の実装       | mutate使用時             |
| ------------------ | ---------------- | ------------------------ |
| 状態管理           | useState         | SWRキャッシュ + useState |
| データ同期         | 手動             | 自動（mutate）           |
| 複数コンポーネント | Context経由      | SWRキャッシュ共有        |
| エラー処理         | 手動ロールバック | mutateでロールバック     |
| 再検証             | なし             | 自動・手動選択可能       |

#### mutate導入時の改良案

```typescript
// TodoWrapper.tsx改良案
const TodoContent = (): React.ReactElement => {
  const { data, error, isLoading, mutate } = useSWR<DataProps>(
    '/api/dashboards',
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      suspense: false,
      shouldRetryOnError: false,
    },
  );

  if (isLoading || !data || !data.contents) return <TodosLoading />;
  if (error) return <ErrorDisplay message={error.message} />;

  const { contents } = data;
  const { todos, lists } = contents;

  return (
    <TodoProvider
      initialTodos={todos}
      initialLists={lists}
      swrMutate={mutate} // mutate関数をContextに渡す
    >
      <Box>
        <PushContainer />
        <MainContainer />
      </Box>
    </TodoProvider>
  );
};

// TodoContext.tsx改良案（型定義追加）
interface TodoProviderProps {
  children: React.ReactNode;
  initialTodos: TodoListProps[];
  initialLists: StatusListProps[];
  swrMutate?: (data?: DataProps, shouldRevalidate?: boolean) => Promise<DataProps | undefined>;
}

// useTodos.ts改良案
export const useTodos = (
  initialTodos: TodoListProps[],
  swrMutate?: (data?: DataProps, shouldRevalidate?: boolean) => Promise<DataProps | undefined>
) => {
  const [todos, setTodos] = useState<TodoListProps[]>(initialTodos);

  const addTodo = async (newTodo: Omit<TodoListProps, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = { ...newTodo, id: tempId };

    // ローカル状態の楽観的更新
    setTodos(prev => [...prev, optimisticTodo]);

    // SWRキャッシュの楽観的更新
    if (swrMutate) {
      const currentCache = await swrMutate(); // 現在のキャッシュを取得
      if (currentCache?.contents) {
        const optimisticData = {
          contents: {
            ...currentCache.contents,
            todos: [...currentCache.contents.todos, optimisticTodo],
          },
        };
        await swrMutate(optimisticData, false);
      }
    }

    try {
      // API呼び出し
      const result = await apiRequest('/api/todos', 'POST', newTodo);

      // 成功時：正式なデータで更新
      setTodos(prev => prev.map(todo =>
        todo.id === tempId ? result : todo
      ));

      if (swrMutate) {
        const currentCache = await swrMutate();
        if (currentCache?.contents) {
          const finalData = {
            contents: {
              ...currentCache.contents,
              todos: currentCache.contents.todos.map(todo =>
                todo.id === tempId ? result : todo
              ),
            },
          };
          await swrMutate(finalData, false);
        }
      }
    } catch (error) {
      // エラー時：ロールバック
      setTodos(prev => prev.filter(todo => todo.id !== tempId));

      if (swrMutate) {
        // SWRキャッシュもロールバック
        await swrMutate(undefined, true); // 再検証で元に戻す
      }

      throw error;
    }
  };

  return { todos, addTodo /* ...other methods */ };
};
```

#### 使い分けガイドライン

**現在の実装で十分な場合：**

- 単一ページアプリケーション
- シンプルなCRUD操作
- データ同期の複雑さが低い
- コンポーネント間でのデータ共有が限定的

**mutate導入を推奨する場合：**

- 複数ページでの同一データ共有が必要
- リアルタイム性が重要（他タブとの同期など）
- 複雑な楽観的更新パターンが多数存在
- キャッシュ戦略の統一が重要

**移行検討タイミング：**

- パフォーマンス問題（不要な再レンダリング）が顕在化
- データ同期のバグが頻発
- コンポーネント間のデータ整合性維持が困難
- より細かいキャッシュ制御が必要になった時

#### 移行時の注意点

- **段階的移行**: 一度に全体を変更せず、機能単位で移行
- **型安全性**: mutate関数の型定義を正確に行う
- **エラーハンドリング**: 現在のエラー処理パターンを維持
- **テスト**: mutateのモックを含むテスト戦略を策定
