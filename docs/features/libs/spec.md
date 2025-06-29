# features/libs 仕様書

## 概要
`features/libs/` は共通で使用されるライブラリ関数を提供するディレクトリです。現在は API リクエスト処理を行う汎用関数が含まれています。

## ファイル構成
```
features/libs/
└── apis.ts - API リクエスト処理の汎用関数
```

## APIs (`apis.ts`)

### apiRequest関数

**概要**: HTTP API リクエストを実行する汎用的な非同期関数

**実行環境**: **クライアントサイド専用**
- ブラウザの `fetch` API を使用
- クライアントコンポーネントやカスタムフックから呼び出される
- サーバーサイドでは実行されない（SSRでは使用不可）

**シグネチャ**:
```typescript
export const apiRequest = async <TRequest, TResponse = TRequest>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: TRequest,
): Promise<TResponse>
```

#### 型パラメータ
| 型パラメータ | 説明 | デフォルト |
|-------------|------|----------|
| `TRequest` | リクエストボディの型 | - |
| `TResponse` | レスポンスデータの型 | `TRequest` |

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|-----|
| `url` | `string` | ✓ | リクエスト先のエンドポイントURL |
| `method` | `'POST' \| 'PUT' \| 'DELETE'` | ✓ | HTTPメソッド |
| `body` | `TRequest` | - | リクエストボディ（JSON形式） |

#### 戻り値
- `Promise<TResponse>`: レスポンスのJSONデータ
- ジェネリック型`TRequest`と`TResponse`により、リクエストとレスポンスの型安全性を個別に保証

#### 機能・特徴

**1. セッション管理**
- `credentials: 'include'`でセッション情報を自動送信
- 認証が必要なAPIに対応

**2. JSON通信**
- `Content-Type: application/json`を自動設定
- リクエストボディの自動JSON変換
- レスポンスの自動JSON解析

**3. キャッシュ制御**
- `cache: 'no-store'`でキャッシュを無効化
- 常に最新データを取得

**4. エラーハンドリング**
- HTTPステータスエラーの検出
- APIレスポンスエラーメッセージの抽出
- コンソールログ出力
- 呼び出し元へのエラー再throw

**5. TypeScript対応**
- 2つのジェネリック型による型安全性
- リクエスト型（`TRequest`）とレスポンス型（`TResponse`）の個別指定
- 入力・出力の型推論

#### 使用例

**基本的な使用例**:
```typescript
// Todo作成（リクエストとレスポンスが同じ型）
const newTodo = await apiRequest<TodoPayload<'POST'>>(
  '/api/todos',
  'POST',
  { text: 'New todo', status: 'pending' }
);

// Todo更新（リクエストとレスポンスが同じ型）
const updatedTodo = await apiRequest<TodoPayload<'PUT'>>(
  '/api/todos',
  'PUT',
  { id: todoId, text: 'Updated todo' }
);
```

**型安全な使用例（リクエストとレスポンスの型が異なる場合）**:
```typescript
// Todo作成（型安全バージョン）
const newTodo = await apiRequest<
  TodoPayload<'POST', true>,
  TodoResponse<'POST'>
>('/api/todos', 'POST', {
  text: 'New todo',
  status: 'pending',
  createdTime: Date.now().toString(),
  updateTime: Date.now().toString(),
  bool: false
});

// List作成
const newList = await apiRequest<
  ListPayload<'POST'>,
  ListResponse<'POST'>
>('/api/lists', 'POST', {
  category: 'New Category',
  number: 1
});

// 削除（レスポンスは削除メッセージ）
await apiRequest<
  TodoPayload<'DELETE', true>,
  TodoResponse<'DELETE'>
>('/api/todos', 'DELETE', {
  id: todoId
});
```

#### エラーハンドリング

**サーバーエラー**:
```typescript
try {
  const result = await apiRequest('/api/todos', 'POST', todoData);
} catch (error) {
  // APIエラーまたはネットワークエラー
  console.error('Request failed:', error.message);
}
```

**エラーレスポンス形式**:
```json
{
  "error": "エラーメッセージ"
}
```

#### 制限事項

**実行環境**:
- **クライアントサイド専用**（ブラウザ環境でのみ動作）
- サーバーサイドでは使用不可（Node.js環境では `fetch` が標準で利用できない場合がある）
- SSR（Server-Side Rendering）では実行されない

**対応HTTPメソッド**:
- POST, PUT, DELETE のみ
- GET リクエストには対応していない

**Content-Type**:
- JSON形式のみサポート
- FormData や他の形式には対応していない

#### 設計思想

**1. 汎用性**
- 2つのジェネリック型による柔軟な型対応
- リクエストとレスポンスの型を個別に指定可能
- 様々なAPIエンドポイントで再利用可能

**2. 一貫性**
- 全APIリクエストで統一されたエラーハンドリング
- 共通のリクエスト設定

**3. 型安全性**
- TypeScriptの型システムを活用
- リクエストボディとレスポンスデータの個別型チェック
- コンパイル時の型チェック
- Payload型とResponse型の組み合わせによる厳密な型定義

**4. セキュリティ**
- セッション情報の自動管理
- CSRFトークンなどの認証情報を含む

## 使用箇所

この関数は以下の**クライアントサイド**の場所で使用されています：

- Todo CRUD操作（カスタムフック内）
- List CRUD操作（カスタムフック内）
- ユーザー管理機能（クライアントコンポーネント内）
- その他のAPI通信が必要な機能

**注意**: サーバーサイドのAPI Routes（`app/api/`）では使用されません。

## 拡張性

将来的な拡張として以下が考えられます：

1. **GETリクエスト対応**
2. **ファイルアップロード対応**
3. **リクエストインターセプター**
4. **レスポンスインターセプター**
5. **リトライ機能**
6. **タイムアウト設定**
7. **プログレス監視**