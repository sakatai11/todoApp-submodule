# Mock Service Worker 概要

## 1. 概要

- Mock Service Worker (MSW) を使用したAPI モッキングシステム。
- 開発・テスト環境でのフロントエンド開発を支援。
- サーバーサイドとクライアントサイドの両方に対応。

## 2. アーキテクチャ

### 初期化システム (initMocks.ts)
- 環境検出による自動初期化
- サーバーサイド・クライアントサイドの分岐処理
- 条件付きモック有効化

### データ管理
- `mocks/data/`: モックデータの定義
- `mocks/handlers/`: APIハンドラーの実装
- 型安全なモックデータ提供

### ハンドラー統合
- 機能別ハンドラーの集約
- 統一されたAPIエンドポイント管理

## 3. 有効化条件

### 環境変数制御
```typescript
NODE_ENV === 'development' && NEXT_PUBLIC_API_MOCKING === 'enabled'
```

### 実行環境分岐
- **サーバーサイド**: `typeof window === 'undefined'`
- **クライアントサイド**: ブラウザ環境

## 4. モックデータ構造

### ユーザーデータ
- `MockUserData`型を使用
- 認証テスト用のサンプルユーザー
- 権限レベル（USER/ADMIN）の設定

### Todo・リストデータ
- `MockTodoListProps`型によるTodoデータ
- `StatusListProps`型によるリストデータ
- 実際の使用パターンを反映したサンプル

## 5. ハンドラー分類

### 機能別ハンドラー
- `todosHandlers`: Todo CRUD操作
- `authHandlers`: 認証関連API
- `dashboardHandlers`: ダッシュボードデータ
- `listsHandlers`: リスト管理操作

### 統合エクスポート
```typescript
export const handlers = [
  ...todosHandlers,
  ...authHandlers,
  ...dashboardHandlers,
  ...listsHandlers,
];
```

## 6. 利点

### 開発効率向上
- バックエンドAPIの完成を待たずに開発可能
- リアルなデータでのフロントエンド検証

### テスト環境構築
- 一貫したテストデータの提供
- ネットワーク依存のないテスト実行

### デバッグ支援
- リクエスト・レスポンスのログ出力
- 開発時の問題特定の容易化

## 7. 設定詳細

### onUnhandledRequest: 'bypass'
- モックされていないリクエストの通過許可
- 段階的なモック導入の支援

### 動的インポート
- 本番ビルドでのモックコード除外
- バンドルサイズの最適化

## 8. 使用場面

- ローカル開発環境
- E2Eテスト
- デモ・プロトタイプ作成
- API設計の検証