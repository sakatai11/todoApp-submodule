# 認証データ型定義 (authData.ts)

## 1. 概要

- 認証・ユーザー管理に関する型定義ファイル。
- ユーザーデータの各種バリエーションと権限管理の型を提供。

## 2. 権限型定義

### UserRole
```typescript
export type UserRole = 'ADMIN' | 'USER';
```
**用途**: ユーザー権限のリテラル型定義
**値**:
- `ADMIN`: 管理者権限
- `USER`: 一般ユーザー権限

## 3. 基本ユーザー型

### UserData
```typescript
export type UserData = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  name?: string;
  image?: string;
  updatedAt?: Timestamp;
};
```

**フィールド説明**:
- `id`: ユーザーの一意識別子
- `email`: メールアドレス（必須）
- `role`: ユーザー権限（UserRole型）
- `createdAt`: アカウント作成日時（Firestore Timestamp）
- `name`: 表示名（オプション）
- `image`: プロフィール画像URL（オプション）
- `updatedAt`: 最終更新日時（オプション）

## 4. 環境別ユーザー型

### MockUserData
```typescript
export type MockUserData = Omit<UserData, 'createdAt'> & {
  createdAt: string;
};
```
**用途**: モック環境でのユーザーデータ型
**特徴**: `createdAt`を文字列型に変更（Timestampの代替）

### AdminUser
```typescript
export type AdminUser = Omit<UserData, 'createdAt' | 'updatedAt'> & {
  createdAt: number;
  updatedAt?: number;
};
```
**用途**: 管理者API でのユーザーデータ型
**特徴**: 日付フィールドをエポック時間（ミリ秒）で表現

## 5. 拡張ユーザー型

### EnhancedUserData
```typescript
export type EnhancedUserData = UserData & {
  todos: TodoListProps[];
  lists: StatusListProps[];
};
```
**用途**: ユーザーに関連するTodo・リストデータを含む拡張型
**特徴**: 
- 基本ユーザー情報にコンテンツデータを追加
- 初期データ取得時などで使用

## 6. 日付型の使い分け

### 環境別の日付管理
1. **本番環境**: `Timestamp`（Firestore標準）
2. **モック環境**: `string`（JSON互換）
3. **API環境**: `number`（エポック時間、ミリ秒）

### 変換パターン
- **Firestore → API**: `timestamp.toMillis()`
- **API → UI**: `new Date(milliseconds)`
- **モック → UI**: `new Date(dateString)`

## 7. 使用場面

### 認証フロー
- NextAuth セッションでの`UserData`使用
- JWTトークンでの`role`フィールド参照

### 管理機能
- 管理者画面でのユーザー一覧表示（`AdminUser`）
- ユーザー詳細情報の取得

### データ統合
- ユーザーとそのコンテンツの一括取得（`EnhancedUserData`）

## 8. セキュリティ考慮

### 権限管理
- `UserRole`による明確な権限分離
- TypeScriptレベルでの権限チェック

### データ最小化
- 必要に応じたフィールドの省略（Omit型）
- オプショナルフィールドによる柔軟性確保

## 9. 依存関係

- `firebase-admin/firestore` - Timestamp型
- `@/types/todos` - TodoListProps型
- `@/types/lists` - StatusListProps型