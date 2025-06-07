# MSW（Mock Service Worker）セットアップガイド

## 概要

todoApp-nextプロジェクトでは、ローカル開発環境でAPIモックを使用するためにMSW（Mock Service Worker）を導入しています。これにより、Firebaseバックエンドに接続せずにアプリケーションの開発・テストが可能になります。

## セットアップ手順

### 1. Service Workerの初期化

プロジェクトルートで以下のコマンドを実行してください：

```bash
npm run msw:init
```

これにより、`public/mockServiceWorker.js`ファイルが生成されます。

### 2. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加します：

```bash
NEXT_PUBLIC_API_MOCKING=enabled
```

モックを無効にする場合は、この値を`disabled`に変更するか、環境変数を削除してください。

### 3. 開発サーバーの起動

通常通り開発サーバーを起動します：

```bash
npm run dev
```

## ファイル構造

```
mocks/
├── browser.ts          # ブラウザ用MSW設定
├── server.ts           # サーバーサイド用MSW設定
├── initMocks.ts        # MSW初期化ロジック
├── data/               # モックデータ
│   ├── index.ts
│   ├── todos.ts        # Todoのモックデータ
│   ├── lists.ts        # リストのモックデータ
│   └── user.ts         # ユーザーのモックデータ
└── handlers/           # APIハンドラー
    ├── index.ts
    ├── todos.ts        # Todo API (/api/todos)
    ├── auth.ts         # 認証 API (/api/auth/*, /api/user)
    ├── dashboard.ts    # ダッシュボード API (/api/dashboards)
    └── lists.ts        # リスト API (/api/lists)
```

## 使用方法

### モックユーザーでのログイン

モック環境では、以下の認証情報でログインできます：

- Email: `example@test.com`
- Password: `password`

### モックデータの編集

`mocks/data/`ディレクトリ内のファイルを編集することで、モックデータを変更できます。

例：新しいTodoを追加する場合

```typescript
// mocks/data/todos.ts
const mockTodos: TodoListProps[] = [
  // 既存のTodo...
  {
    id: 'todo-5',
    updateTime: new Date(1746271892078).toISOString(),
    createdTime: new Date(1746271892078).toISOString(),
    text: '新しいタスク',
    status: 'todo',
    bool: false,
  },
];
```

### APIハンドラーの追加

新しいAPIエンドポイントを追加する場合は、`mocks/handlers/`に新しいハンドラーを作成し、`index.ts`に追加します。

## 注意事項

1. **本番環境での無効化**: MSWは開発環境（`NODE_ENV=development`）でのみ有効になります。
2. **Service Worker**: ブラウザのService Workerを使用するため、初回起動時はページのリロードが必要な場合があります。
3. **データの永続性**: モックデータはメモリ上に保存されるため、ページをリロードすると初期状態に戻ります。

## トラブルシューティング

### MSWが動作しない場合

1. ブラウザの開発者ツールでService Workerが登録されているか確認
2. `public/mockServiceWorker.js`が存在するか確認
3. 環境変数`NEXT_PUBLIC_API_MOCKING=enabled`が設定されているか確認

### コンソールエラーが出る場合

- ブラウザのキャッシュをクリアしてページをリロード
- Service Workerを手動で削除してから再度実行

## 本番APIとの切り替え

`.env.local`の`NEXT_PUBLIC_API_MOCKING`を`disabled`に設定するか削除することで、本番のFirebase APIを使用するように切り替えられます。
