# fetchUserForTemplate.ts 仕様書

## 概要
`app/libs/fetchUserForTemplate.ts` はServer Component用のユーザーデータ取得ライブラリです。開発環境ではモックデータ、本番環境では実際のAPIからデータを取得する環境適応型の関数を提供します。

## 実行環境
- **サーバーサイド専用**（Node.js環境）
- Server Componentsから呼び出される
- テンプレート描画時のユーザーデータ取得に使用

## 依存関係
```typescript
import { user } from '@/mocks/data';
import { headers } from 'next/headers';
```

## 関数詳細

### fetchUserForTemplate

**概要**: 環境に応じてユーザーデータを取得するアダプター関数

**シグネチャ**:
```typescript
export async function fetchUserForTemplate(): Promise<{user: UserData[]}>
```

#### パラメータ
- なし

#### 戻り値
```typescript
{
  user: UserData[] // ユーザーデータの配列
}
```

#### 処理フロー

**1. 環境判定**:
```typescript
if (
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
)
```

**2-A. モック環境での処理**:
```typescript
console.log('Using mock data for user in template');
const mockUserData = {
  user: [...user], // 配列として返す
};
console.log('Mock user data:', mockUserData);
return mockUserData;
```

**2-B. 本番環境での処理**:
```typescript
// Next.js headers APIでCookieを取得
const { headers } = await import('next/headers');
const incomingHeaders = await headers();
const cookieHeader = incomingHeaders.get('cookie') || '';

// 内部APIへfetchリクエスト
const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
    cookie: cookieHeader,
  },
});

if (!response.ok) {
  console.error('Fetch error:', response.status, response.statusText);
  throw new Error('Failed to fetch data');
}

return response.json();
```

## 環境設定

### 環境変数

**開発環境（モックモード）**:
```env
NODE_ENV=development
NEXT_PUBLIC_API_MOCKING=enabled
```

**本番環境**:
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

### 動作モード

| 環境 | 条件 | データソース | 特徴 |
|-----|------|-------------|-----|
| **モック** | `development` + `API_MOCKING=enabled` | `/mocks/data` | 固定データ、高速 |
| **本番** | 上記以外 | `/api/user` API | 実際のデータ、セッション依存 |

## セキュリティ

### Cookie処理
- Next.js の `headers()` APIで安全にCookie取得
- セッションCookieを内部APIに転送
- Server Component内でのみ実行可能

### API通信
- 内部API（同一ドメイン）への通信のみ
- HTTPSエンドポイントの使用
- セッション認証によるアクセス制御

## エラーハンドリング

### 本番環境でのエラー
```typescript
if (!response.ok) {
  console.error('Fetch error:', response.status, response.statusText);
  throw new Error('Failed to fetch data');
}
```

**エラー種類**:
- **401 Unauthorized**: セッション切れ
- **500 Internal Server Error**: サーバーエラー
- **Network Error**: 接続エラー

### モック環境でのエラー
- モックデータ読み込みエラー（まれ）
- メモリ不足（大量データ時）

## パフォーマンス

### キャッシュ設定
```typescript
cache: 'no-store' // 常に最新データを取得
```

### モック環境の利点
- ネットワーク通信なし
- 固定レスポンス時間
- 外部依存なし

### 本番環境の考慮事項
- APIレスポンス時間に依存
- ネットワーク遅延の影響
- セッション検証の処理時間

## デバッグ機能

### ログ出力
```typescript
console.log('Using mock data for user in template');
console.log('Mock user data:', mockUserData);
console.error('Fetch error:', response.status, response.statusText);
```

**ログの目的**:
- 動作モードの確認
- データ内容の検証
- エラー詳細の記録

## 使用場所

### Server Components
```typescript
// Server Component内での使用例
export default async function UserTemplate() {
  const { user } = await fetchUserForTemplate();
  
  return (
    <div>
      {user.map(u => <UserCard key={u.id} user={u} />)}
    </div>
  );
}
```

### layout.tsx
```typescript
// レイアウトでのユーザー情報取得
export default async function RootLayout() {
  const { user } = await fetchUserForTemplate();
  
  return (
    <html>
      <body>
        <Header user={user[0]} />
        {children}
      </body>
    </html>
  );
}
```

## 制限事項

1. **Server Component専用**: クライアントコンポーネントでは使用不可
2. **単一ユーザー**: 複数ユーザーの同時取得には対応していない
3. **キャッシュなし**: `no-store`により毎回データ取得
4. **エラー詳細**: エラー内容の詳細化が不十分

## 拡張可能性

### 今後の改善案

**1. キャッシュ機能**:
```typescript
// Next.js App Router のキャッシュ活用
fetch(url, { 
  next: { revalidate: 60 } // 60秒キャッシュ
})
```

**2. エラーハンドリング強化**:
```typescript
// より詳細なエラー分類
if (response.status === 401) {
  redirect('/login');
} else if (response.status >= 500) {
  throw new ServerError('Internal server error');
}
```

**3. 型安全性向上**:
```typescript
// 戻り値の型を厳密化
export async function fetchUserForTemplate(): Promise<UserDataResponse> {
  // 型ガードによる検証
  if (!isValidUserData(data)) {
    throw new TypeError('Invalid user data format');
  }
  return data;
}
```

**4. テスト対応**:
```typescript
// テスト環境での動作制御
if (process.env.NODE_ENV === 'test') {
  return testFixture.user;
}
```

**5. メトリクス収集**:
```typescript
// パフォーマンス監視
const startTime = performance.now();
const data = await fetchData();
const duration = performance.now() - startTime;
logger.info('Fetch duration', { duration, mode: 'production' });
```

## 関連ファイル

- `/mocks/data/user.ts`: モックユーザーデータ
- `/app/api/user/route.ts`: 本番環境で呼び出されるAPI
- `/types/auth/authData.ts`: UserData型定義