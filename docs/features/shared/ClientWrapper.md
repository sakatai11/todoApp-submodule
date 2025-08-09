# ClientWrapper

## 1. 概要

- HeaderWrapperコンポーネントのクライアントサイド実行を担当するラッパーコンポーネント
- 動的インポートによるSSR無効化でクライアント専用実行を実現

## 2. Props

```typescript
interface ClientWrapperProps {
  data: LinkSection[]; // マークダウンから取得したリンク情報
  user: UserData[];    // ユーザー情報配列
}
```

## 3. 主要機能

### 動的インポート

```typescript
'use client';

const HeaderWrapper = dynamic(
  () => import('@/features/shared/components/elements/heading/HeaderWrapper'),
  { ssr: false },
);
```

### ラッパー機能

```typescript
export const ClientWrapper: React.FC<ClientWrapperProps> = ({ data, user }) => {
  return <HeaderWrapper data={data} user={user} />;
};
```

## 4. 使用例

```typescript
import ClientWrapper from '@/features/shared/templates/ClientWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientWrapper data={linkData} user={userData} />
      {children}
    </>
  );
}
```

## 5. 依存関係

- **Next.js**: `dynamic`関数
- **型定義**: `LinkSection`, `UserData`
- **コンポーネント**: `HeaderWrapper`