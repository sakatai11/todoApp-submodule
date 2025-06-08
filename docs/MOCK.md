# MSW（Mock Service Worker）セットアップガイド

## 概要

ローカル開発環境でAPIモックを使用するためにMSW（Mock Service Worker）を導入しています。これにより、Firebaseバックエンドに接続せずにアプリケーションの開発・テストが可能になります。

## 主要機能

### 1. モックデータ管理

- **ユーザーデータ**: テスト用ユーザー情報
- **Todoデータ**: サンプルTodo項目
- **リストデータ**: Todoカテゴリとステータス

### 2. API モッキング

- **認証API**: ログイン・サインアップ・ログアウト
- **Todo API**: CRUD操作（作成・読取・更新・削除）
- **リストAPI**: カテゴリ管理
- **ダッシュボードAPI**: 統計データ取得

### 3. 環境対応

- **開発環境**: モックAPIを使用した高速開発
- **本番環境**: 実際のAPIへの自動切り替え

## ファイル詳細説明

### Core Files (mocks/)

- **`browser.ts`**: クライアントサイドでのMSW Service Worker設定
- **`server.ts`**: サーバーサイド（SSR/API Routes）でのMSWサーバー設定
- **`initMocks.ts`**: 実行環境を自動判定してMSWを初期化する統一関数

### Data Layer (mocks/data/)

- **`index.ts`**: 全モックデータを統合し、外部から使いやすい形でエクスポート
- **`lists.ts`**: Todoのカテゴリ分類とステータス管理用データ
- **`todos.ts`**: 開発・テスト用のサンプルTodo項目データ
- **`user.ts`**: 認証テスト用のユーザーアカウント情報

### API Layer (mocks/handlers/)

- **`index.ts`**: 全APIハンドラーを統合し、MSWで使用する形で整理
- **`auth.ts`**: ユーザー認証フローのモック（JWT生成、セッション管理）
- **`dashboard.ts`**: 統計情報やアナリティクス用のモックAPI
- **`lists.ts`**: Todoカテゴリの作成・編集・削除・並び替えAPI
- **`todos.ts`**: Todo項目の作成・更新・削除・ステータス変更API

## セットアップ手順

### 1. Service Workerの初期化

メインプロジェクトルート（todoApp-next）で以下のコマンドを実行してください：

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

新しいAPIエンドポイントを追加する場合は、`handlers/`に新しいハンドラーを作成し、`handlers/index.ts`に追加します。

### インポート方法

```typescript
// ユーザーデータを使用
import { user } from '@/todoApp-submodule/mocks/data';

// MSW初期化
import { initMocks } from '@/todoApp-submodule/mocks/initMocks';
```

## メインプロジェクトでの使用

### 自動初期化

MSWProviderが自動的にモック機能を初期化します：

```typescript
// app/providers/MSWProvider.tsx で自動実行
const { initMocks } = await import('@/todoApp-submodule/mocks/initMocks');
await initMocks();
```

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

## 最新化・保守

### データの定期更新

- 本番APIの仕様変更に合わせてモックデータを更新
- 新機能追加時は対応するモックハンドラーを追加

## 本番APIとの切り替え

`.env.local`の`NEXT_PUBLIC_API_MOCKING`を`disabled`に設定するか削除することで、本番のFirebase APIを使用するように切り替えられます。

## 関連ドキュメント

- [MSW公式ドキュメント](https://mswjs.io/)
- [メインプロジェクトのREADME](../README.md)
- [API仕様書](../docs/api/)

## 更新方法

### サブモジュール更新の流れ

1. サブモジュール内で変更を実施
2. サブモジュールにコミット・プッシュ
3. メインプロジェクトでサブモジュール参照を更新

```bash
# メインプロジェクトで参照更新
cd ..
git add todoApp-submodule
git commit -m "Update submodule reference"
git push origin develop
```
