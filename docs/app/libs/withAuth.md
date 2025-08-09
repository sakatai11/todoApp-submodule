# withAuth ライブラリ

## 1. 概要

- API ルートでの認証処理を簡素化するヘルパー関数。
- 認証済みユーザーのリクエストを安全に処理するためのラッパー。

## 2. 関数仕様

### withAuthenticatedUser

#### 型パラメータ
```typescript
<T, R>
- T: リクエストボディの型
- R: レスポンスデータの型
```

#### パラメータ
```typescript
req: Request                    // HTTPリクエストオブジェクト
handler: (uid: string, body: T) => Promise<NextResponse<R>>  // 処理関数
```

#### 戻り値
```typescript
Promise<NextResponse<R>>
```

## 3. 環境別認証処理

### 認証方法の切り替え

```typescript
// テスト環境・開発環境では X-User-ID ヘッダーから認証情報を取得
if (
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_EMULATOR_MODE === 'true'
) {
  uid = req.headers.get('X-User-ID') || undefined;
} else {
  // 本番環境では通常のセッション認証
  const session = await auth();
  uid = session?.user?.id;
}
```

### 環境別設定

- **テスト・開発・Emulator環境**: `X-User-ID`ヘッダーから認証
- **本番環境**: NextAuth.jsセッションから認証

## 4. 処理フロー

### 1. 認証チェック
- `auth()`でセッション情報を取得
- `session?.user?.id`の存在確認
- 未認証時は401エラーを返却

### 2. リクエスト処理
- リクエストオブジェクトのクローン作成
- JSONボディの解析
- handlerに`uid`と`body`を渡して実行

### 3. エラーハンドリング
- try-catch でランタイムエラーをキャッチ
- エラーログ出力
- 500エラーレスポンスを返却

## 4. 使用例

```typescript
export async function POST(req: Request) {
  return withAuthenticatedUser<TodoPayload<'POST'>, TodoResponse<'POST'>>(
    req,
    async (uid, body) => {
      // 認証済みユーザーの処理
      const { text, status } = body;
      // Firestoreへの保存処理など
      return NextResponse.json(result);
    }
  );
}
```

## 5. 利点

### 認証ロジックの統一
- 全API ルートで一貫した認証処理
- 重複コードの削減

### 型安全性
- TypeScript ジェネリクスによる型保証
- リクエスト・レスポンスの型安全性

### エラーハンドリング
- 統一されたエラーレスポンス
- 適切なHTTPステータスコード

## 6. セキュリティ

### 認証確認
- NextAuth セッションベースの認証
- 未認証リクエストの確実な拒否

### リクエスト処理
- 安全なリクエストクローン
- JSON パース エラーの適切な処理

## 7. 依存関係

- NextAuth (`auth`)
- Next.js (`NextResponse`)
- TypeScript ジェネリクス