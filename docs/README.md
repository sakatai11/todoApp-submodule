# TodoApp-Next

## 概要

TodoApp-Nextは、Next.jsをベースにしたタスク管理アプリケーションです。このアプリは、ユーザー認証、タスクの作成・編集・削除、ドラッグ＆ドロップによるタスクの並び替えなど、効率的なタスク管理をサポートする機能を提供します。

## 主な機能

- **ユーザー認証**: サインイン、サインアップ機能を提供。NextAuth.jsによる安全な認証。
- **タスク管理**: タスクの作成、編集、削除、ステータス管理。
- **ピン留め機能**: 重要なタスクをピン留めして優先度を視覚化。
- **ドラッグ＆ドロップ**: @dnd-kit/coreを使用したタスクの並び替え。
- **モーダル機能**: タスク削除や編集用のモーダルインターフェース。
- **リアルタイムデータ**: Firebaseとの連携によるリアルタイムデータ更新。
- **レスポンシブデザイン**: モバイルからデスクトップまで対応したUI設計。

## アプリケーション構造

- **フィーチャーベース構成**: 機能ごとに分離されたモジュール構造。
- **APIルート**: Next.jsのAPIルートを活用したサーバーサイド処理。
- **コンテキストAPI**: Reactコンテキストを使用した状態管理。
- **SWR対応**: データフェッチングとキャッシュ戦略の最適化。

## 使用技術

- **フロントエンド**: Next.js React
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Material UI (MUI)
- **バックエンド**: Firebase Admin SDK (Authentication, Firestore)
- **認証**: NextAuth.js
- **データフェッチング**: SWR
- **ドラッグ＆ドロップ**: @dnd-kit/core
- **型定義**: TypeScript
- **バリデーション**: Zod
- **Lint/フォーマット**: ESLint, Prettier
- **デプロイ**: Vercel

## プロジェクト構造

```
todoApp-next/
├── app/                        # Next.jsのApp Routerベースのルート定義
│   ├── (admin)/                # 管理者関連のルート（グループ化）
│   │   └── admin/              # 管理者ページ
│   │       └── page.tsx
│   ├── (auth)/                 # 認証機能関連のルート（グループ化）
│   │   ├── _signIn/            # サインイン用ロジック
│   │   │   └── signIn.ts
│   │   ├── _signUp/            # サインアップ用ロジック
│   │   │   └── signUp.ts
│   │   ├── account/            # アカウント関連
│   │   │   └── error/          # アカウントエラー画面
│   │   │       └── page.tsx
│   │   ├── signin/             # サインインページ
│   │   │   └── page.tsx
│   │   └── signup/             # サインアップページ
│   │       └── page.tsx
│   ├── (dashboards)/            # ダッシュボード関連のルート（グループ化）
│   │   ├── loading.tsx         # ダッシュボードのローディング画面
│   │   └── todo/               # タスク管理ページ
│   │       └── page.tsx
│   ├── api/                    # APIルート
│   │   ├── (admin)/            # 管理者用API
│   │   │   └── users/          # 管理者ユーザーAPI
│   │   │       ├── [userId]/   # 個別ユーザーAPI
│   │   │       │   ├── lists/  # ユーザーのリスト管理API
│   │   │       │   │   └── route.ts
│   │   │       │   └── todos/  # ユーザーのタスク管理API
│   │   │       │       └── route.ts
│   │   │       └── route.ts
│   │   ├── (general)/          # 一般ユーザー用API
│   │   │   ├── dashboards/     # コンテンツ情報API
│   │   │   │   └── route.ts
│   │   │   ├── lists/          # リスト管理API
│   │   │   │   └── route.ts
│   │   │   ├── todos/          # タスク管理API
│   │   │   │   └── route.ts
│   │   │   └── user/           # ユーザー情報API
│   │   │       └── route.ts
│   │   ├── auth/               # 認証関連API
│   │   │   ├── [...nextauth]/  # NextAuth.js認証API
│   │   │   ├── refresh/        # トークンリフレッシュAPI
│   │   │   │   └── route.ts
│   │   │   └── server-login/   # サーバーサイドログインAPI
│   │   │       └── route.ts
│   ├── libs/                   # 共通ライブラリ
│   ├── static/                 # 静的CSSファイル
│   │   ├── input.css
│   │   └── output.css
│   └── utils/                  # ユーティリティ関数
├── features/                   # 機能ごとのコンポーネントとロジック
│   ├── admin/                  # 管理者機能
│   │   ├── components/         # 管理者用UIコンポーネント
│   │   └── templates/          # 管理者用テンプレート
│   ├── libs/                   # 共通ライブラリ
│   ├── shared/                 # 共通機能
│   │   ├── components/         # 共通UIコンポーネント
│   │   │   └── elements/       # 汎用UIパーツ
│   │   └── templates/          # 共通テンプレート
│   ├── sign/                   # サインイン・サインアップ機能
│   │   ├── components/         # サイン用UIコンポーネント
│   │   │   └── elements/       # サイン用UIパーツ
│   │   └── templates/          # サイン用テンプレート
│   ├── todo/                   # タスク管理機能
│   │   ├── components/         # タスク用UIコンポーネント
│   │   │   └── elements/       # タスク用UIパーツ
│   │   ├── contexts/           # タスク用コンテキスト
│   │   ├── dnd/                # ドラッグ＆ドロップ関連
│   │   ├── hooks/              # タスク用カスタムフック
│   │   └── templates/          # タスク用テンプレート
│   ├── top/                    # トップページ機能
│   │   ├── components/         # トップページ用UIコンポーネント
│   │   └── templates/          # トップページ用テンプレート
│   └── utils/                  # 機能共通ユーティリティ
├── data/                       # 静的データとリンク定義
│   ├── form.ts                 # フォーム定義
│   ├── validatedData.ts        # バリデーション済みデータ
│   └── links/                  # 外部リンク定義
├── public/                     # 静的アセット、画像関連
├── todoApp-submodule/          # モックデータとドキュメント
└── types/                      # TypeScript型定義
    ├── common.ts               # 共通型定義
    ├── components.ts           # コンポーネント型定義
    ├── lists.ts                # リスト型定義
    ├── next-auth.d.ts          # NextAuth型定義
    ├── todos.ts                # タスク型定義
    ├── auth/                   # 認証関連型定義
    ├── form/                   # フォーム関連型定義
    └── markdown/               # マークダウン関連型定義
```
