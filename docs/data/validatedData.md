# バリデーションスキーマ定義 (validatedData.ts)

## 1. 概要

- Zodライブラリを使用したデータバリデーションスキーマ定義。
- 認証関連データの型安全性とランタイム検証を提供。

## 2. スキーマ定義

### AuthDecodedTokenSchema
```typescript
export const AuthDecodedTokenSchema = z.object({
  uid: z.string(),
  email: z.string().email().optional(),
});
```

**目的**: デコードされたJWTトークンの構造検証
**フィールド**:
- `uid`: 必須の文字列（ユーザーID）
- `email`: オプションのメール形式文字列

### AuthResponseSchema
```typescript
export const AuthResponseSchema = z.object({
  decodedToken: AuthDecodedTokenSchema,
  customToken: z.string(),
  tokenExpiry: z.number(),
  userRole: z.string().optional(),
});
```

**目的**: 認証API レスポンスの構造検証
**フィールド**:
- `decodedToken`: AuthDecodedTokenSchema準拠
- `customToken`: 必須の文字列（カスタムトークン）
- `tokenExpiry`: 必須の数値（有効期限）
- `userRole`: オプションの文字列（ユーザー権限）

### CredentialsSchema
```typescript
export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

**目的**: ログイン認証情報の検証
**フィールド**:
- `email`: 必須のメール形式文字列
- `password`: 最小6文字の文字列

## 3. バリデーション機能

### 型安全性
- コンパイル時とランタイムの両方で型チェック
- TypeScript型との自動同期

### エラーハンドリング
- `.safeParse()` で安全なパース処理
- 詳細なエラー情報の提供

### データ変換
- 自動的な型変換（文字列→数値など）
- バリデーション通過後の型保証

## 4. 使用例

### API でのリクエスト検証
```typescript
const result = CredentialsSchema.safeParse(credentials);
if (!result.success) {
  throw new Error('認証情報が不正です');
}
const { email, password } = result.data;
```

### レスポンス検証
```typescript
const validatedResponse = AuthResponseSchema.parse(apiResponse);
return NextResponse.json(validatedResponse);
```

## 5. 依存関係

- **Zod**: スキーマ定義・バリデーションライブラリ
- TypeScript連携による型推論

## 6. セキュリティ効果

### 入力検証
- 不正なデータ形式の早期検出
- SQLインジェクション等の予防

### API 安全性
- 予期しないデータ構造の拒否
- 型安全なデータ処理の保証