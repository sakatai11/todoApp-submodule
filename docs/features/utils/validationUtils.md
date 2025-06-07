# バリデーションユーティリティ (validationUtils.ts)

## 1. 概要

- フォーム入力のバリデーション判定とエラーメッセージ生成を行うユーティリティ。
- メール・パスワードフィールドのエラー状態管理を提供。

## 2. 関数

### getValidationStatus

#### 概要
- バリデーション結果を基にフィールドのエラー状態を判定。

#### パラメータ
```typescript
{
  success: boolean;           // バリデーション成功フラグ
  message: string;           // エラーメッセージ
  option: string;           // 追加オプション
  fieldType: 'password' | 'email'; // フィールドタイプ
}
```

#### 戻り値
```typescript
boolean // エラー状態（true: エラーあり）
```

#### 判定ロジック

1. **基本エラー判定**
   - `success === false` でエラー状態を確認

2. **パスワードエラー判定**
   - messageType.password または passwordError
   - option が 'password' または 'default'

3. **メールエラー判定**
   - messageType.mail, addressError, mailError
   - option が 'email' または 'default'

4. **全般エラー判定**
   - 認証失敗メッセージ
   - サーバーエラーメッセージ

### getErrorMessage

#### 概要
- バリデーション結果を基に適切なエラーメッセージを返す。

#### パラメータ
```typescript
{
  message: string;
  option: string;
  fieldType: 'password' | 'email';
}
```

#### 戻り値
```typescript
string | null // エラーメッセージまたはnull
```

#### メッセージ判定

1. **パスワードフィールド**
   - messageType.password: パスワード関連エラー
   - messageType.passwordError: パスワード形式エラー

2. **メールフィールド**
   - messageType.mail: メール必須エラー
   - messageType.addressError: メール形式エラー
   - messageType.mailError: メール関連エラー

## 3. エラー条件の詳細

### パスワードエラー
- パスワード未入力
- パスワード形式不正
- デフォルト状態でのエラー表示

### メールエラー
- メールアドレス未入力
- メール形式不正（@マーク、ドメインなど）
- 既存メールアドレスとの重複

### 認証エラー
- ログイン認証失敗
- サーバーサイドエラー
- ネットワークエラー

## 4. 依存関係

- `@/data/form` からのメッセージタイプ定義
- `@/types/form/formData` からの型定義

## 5. 使用場面

- サインイン・サインアップフォームのバリデーション
- リアルタイム入力検証
- エラー状態のUI表示制御