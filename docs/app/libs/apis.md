# APIs ライブラリ

## 1. 概要

- Firestore データベースからの初期データ取得を行うライブラリ。
- ユーザー情報、Todo、リストデータの一括取得機能を提供。

## 2. 関数

### getServerApiRequest

#### 概要

- メールアドレスによるユーザー存在確認。

#### パラメータ

```typescript
email: string;
```

#### 戻り値

```typescript
boolean | null;
```

#### 処理フロー

1. Firestoreでemail条件でクエリ実行
2. 該当ユーザーの存在をブール値で返却

## 3. データ取得の特徴

### ソート順序

- **Todos**: updateTime降順（最新更新順）
- **Lists**: number昇順（表示順序）

### エラーハンドリング

- try-catch でFirestoreエラーをキャッチ
- エラーログ出力後、上位にエラーを再スロー

## 4. 依存関係

- Firebase Admin SDK (`adminDB`)
- NextAuth Session
- 型定義（UserData, TodoListProps, StatusListProps）

## 5. 使用場面

- サーバーコンポーネントでの初期データ取得
- API ルートでのデータフェッチ
- ユーザー認証状況の確認
