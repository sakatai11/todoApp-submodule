# Todoページ

## 1. 概要

- ユーザーのTodoリストを表示・管理するダッシュボードページ。

## 2. URL・ルーティング

- Path：`/todo`
- 認証済みユーザー向けのページ。

## 3. レンダリング方式

- サーバーコンポーネント（`TodoPage`）
  - `<Template showHeader={true}>` でラップし、`<Todo.TodoWrapper />` を表示。

## 4. 実行内容

1. `<Template showHeader={true}>` でヘッダー付きレイアウトを適用
2. `<Todo.TodoWrapper />` をレンダリング
