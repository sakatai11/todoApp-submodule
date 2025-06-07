# Admin User Lists API

## 1. 概要

- 管理者が特定ユーザーのリスト一覧を取得するAPIエンドポイント。
- ADMIN権限必須。

## 2. URL・ルーティング

- Path：`/api/users/[userId]/lists`
- 認証：必須（ADMIN権限）

## 3. HTTPメソッド

### GET - ユーザーリスト一覧取得

#### パラメータ
- `userId`: 取得対象のユーザーID（パスパラメータ）

#### レスポンス
- 成功（200）：
```typescript
{
  lists: Array<{
    id: string;
    category: string;
    number: number;
  }>;
}
```
- エラー（401）：未認証
- エラー（403）：権限不足（非ADMIN）
- エラー（500）：サーバーエラー

## 4. 処理フロー

1. パスパラメータからuserIdを取得
2. セッション情報の取得・認証確認
3. ADMIN権限チェック
4. Firestoreから指定ユーザーのリスト一覧を取得（number昇順）
5. StatusListProps型でデータを整形して返却

## 5. データベース構造

- コレクション：`users/{userId}/lists`
- ソート：`number`昇順
- 取得フィールド：id, category, number

## 6. 型定義

- レスポンスは`StatusListProps`配列を使用

## 7. セキュリティ

- セッション認証必須
- ADMIN権限必須
- 他ユーザーのデータにアクセス可能（管理者権限）