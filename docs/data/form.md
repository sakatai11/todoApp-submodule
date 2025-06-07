# フォームデータ定義 (form.ts)

## 1. 概要

- フォームバリデーション用のメッセージ定数とその型定義。
- 認証フォームでのエラーメッセージ統一を提供。

## 2. メッセージ定数

### messageType
```typescript
export const messageType = {
  password: 'パスワードを入力してください',
  passwordAndmail: 'パスワードとメールアドレス項目を入力して下さい',
  passwordError: 'パスワードは12文字以上で大文字と数字を含めてください',
  mail: 'メールアドレスを確認して下さい',
  addressError: 'メールアドレスに問題があります',
  mailError: 'このメールアドレスは既に登録されています',
  messagingError: '入力内容に問題があります',
} as const;
```

## 3. メッセージ分類

### パスワード関連
- **password**: 未入力時のメッセージ
- **passwordError**: 形式不正時のメッセージ（12文字以上、大文字・数字含む）

### メール関連
- **mail**: 未入力・形式確認メッセージ
- **addressError**: メール形式エラー
- **mailError**: 重複登録エラー

### 複合・全般
- **passwordAndmail**: 両方の項目未入力
- **messagingError**: 一般的な入力エラー

## 4. 型定義

### validationMessage
```typescript
export type validationMessage =
  | typeof messageType.password
  | typeof messageType.passwordAndmail
  | typeof messageType.passwordError
  | typeof messageType.mail
  | typeof messageType.addressError
  | typeof messageType.mailError
  | typeof messageType.messagingError;
```

**特徴**:
- Union型による型安全なメッセージ管理
- TypeScriptの型チェック活用
- エラーメッセージの統一性保証

## 5. 使用場面

### バリデーション処理
- フォーム入力時のリアルタイム検証
- サーバーサイドエラーの表示

### UI表示
- エラーメッセージの一貫した表示
- 多言語対応の基盤

## 6. 利点

### 一元管理
- エラーメッセージの統一管理
- 変更時の影響範囲最小化

### 型安全性
- コンパイル時のメッセージ妥当性検証
- IDEでの自動補完対応