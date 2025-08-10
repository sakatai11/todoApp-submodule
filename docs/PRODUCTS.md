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

- **フレームワーク**: Next.js 15.2.4 (App Router + Turbopack)
- **ランタイム**: React 19.0.0, React DOM 19.0.0
- **言語**: TypeScript 5.7.3
- **認証**: NextAuth.js 5.0.0-beta.25
- **バックエンド**: Firebase Admin SDK 13.2.0 (Authentication, Firestore)
- **UIライブラリ**: Material-UI (MUI) 6.4.3 + Tailwind CSS 3.4.17
- **状態管理**: React Context + SWR 2.3.3
- **ドラッグ＆ドロップ**: @dnd-kit/core 6.3.1
- **バリデーション**: Zod 3.24.2
- **テスト**: Vitest 2.1.8 + React Testing Library 14.3.1 + MSW 2.8.7 + Playwright 1.54.1
- **開発ツール**: ESLint 9.20.0, Prettier 3.5.0
- **Container**: Docker + Docker Compose (統合テスト・開発環境)
- **デプロイ**: Vercel

## プロジェクト構造

**注意**: この構造は開発環境でのファイル構成を示しています。本番環境（Vercel等）では、Docker関連ファイル、テスト関連ファイル、開発用設定ファイルは含まれません。

```
todoApp-next/
├── docker-compose.yml          # 開発用Docker構成
├── docker-compose.test.yml     # テスト用Docker構成
├── Dockerfile                  # Next.jsアプリ用Dockerfile
├── Dockerfile.test             # E2Eテスト用Dockerfile
├── firebase-emulator.test.Dockerfile # Firebase Emulator用テスト専用Dockerfile
├── firebase.json               # Firebase設定（開発用）
├── firebase.test.json          # Firebase設定（テスト用）
├── playwright.config.ts        # Playwright設定
├── vitest.integration.config.ts # 統合テスト設定
├── app/                        # Next.jsのApp Routerベースのルート定義
│   ├── (admin)/                # 管理者関連のルート（グループ化）
│   │   └── admin/              # 管理者ページ
│   │       └── page.tsx
│   ├── (auth)/                 # 認証機能関連のルート（グループ化）
│   │   ├── _signIn/            # サインイン用ロジック
│   │   │   └── signIn.ts
│   │   ├── _signOut/           # サインアウト用ロジック
│   │   │   └── signOut.ts
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
│   ├── providers/              # React プロバイダーコンポーネント
│   │   ├── MSWProvider.tsx     # Mock Service Worker プロバイダー（開発環境用）
│   │   └── SessionProvider.tsx # NextAuth.js セッションプロバイダー
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
├── scripts/                    # プロジェクト運用スクリプト
│   ├── init-firebase-data.ts   # Firebase Emulator初期データ投入（tsx実行）
│   ├── cleanup-db.ts           # テストデータベースクリーンアップ
│   └── helpers/                # スクリプト用ヘルパー関数
│       └── testDbDataFetcher.ts # テストデータ取得ユーティリティ
├── tests/                      # テストファイルと設定（24ファイル、413テスト）
│   ├── setup.ts                # グローバルテスト環境セットアップ（ユニットテスト用）
│   ├── setup-integration.ts    # 統合テスト環境セットアップ
│   ├── test-utils.tsx          # カスタムレンダー関数とユーティリティ
│   ├── fixtures/               # テストフィクスチャ（Firebase Emulator用）
│   │   ├── auth_export/        # 認証データエクスポート
│   │   └── firestore_export/   # Firestoreデータエクスポート
│   ├── e2e/                    # E2Eテストファイル（Playwright）
│   │   ├── global-setup.ts     # E2Eテスト用グローバルセットアップ
│   │   ├── global-teardown.ts  # E2Eテスト用グローバルクリーンアップ
│   │   └── todo-flow.spec.ts   # Todo機能の包括的E2Eテスト
│   └── features/               # フィーチャーベースのテスト構造
│       ├── libs/               # 共通ライブラリテスト
│       ├── shared/             # 共通コンポーネントテスト
│       ├── todo/               # Todo機能のテスト
│       │   ├── api.integration.test.ts    # Todo API統合テスト
│       │   ├── components/                # Todoコンポーネントテスト（13ファイル）
│       │   ├── contexts/                  # TodoContextテスト
│       │   ├── hooks/                     # Todo関連フックテスト（4ファイル）
│       │   └── templates/                 # TodoWrapperテンプレートテスト
│       └── utils/              # ユーティリティ関数テスト（4ファイル）
├── todoApp-submodule/          # モックAPIとドキュメント用のサブモジュール
│   ├── mocks/                  # MSWハンドラーとモックデータ
│   │   ├── data/               # モックデータ定義
│   │   │   └── master/         # マスターテストデータ
│   │   │       └── firebase/   # Firebase用テストデータ
│   │   │           └── export_test_data.ts # ユーザー分離テストデータ
│   │   └── handlers/           # APIハンドラー定義
│   └── docs/                   # プロジェクトドキュメント
│       └── features/           # 機能別仕様書
│           └── todo/           # Todo機能の詳細仕様
│               ├── contexts/   # Context仕様書
│               ├── hooks/      # カスタムフック仕様書
│               ├── components/ # コンポーネント仕様書
│               └── templates/  # テンプレート仕様書
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

## 開発コマンド

```bash
# 開発サーバー（ローカル）
npm run dev              # Turbopackで開発サーバーを起動 (localhost:3000)
npm run build           # プロダクションビルド（.nextディレクトリクリア+ビルド）
npm run start           # プロダクションサーバーを起動

# Docker開発環境
npm run docker:dev       # Docker開発環境起動（MSW + Firebase Emulator）
npm run docker:dev:down  # Docker開発環境停止

# コード品質・フォーマット
npm run lint            # ESLint 9.20.0を自動修正で実行
npm run prettier        # Prettier 3.5.0でコードをフォーマット
npm run format          # prettierとlintの両方を実行

# ユニットテスト（MSW使用）
npm run test            # Vitest 2.1.8でユニットテスト実行
npm run test:coverage   # カバレッジ付きテスト実行（100%達成済み）
npm run test:ui         # Vitest UIモードでテスト実行
npm run msw:init        # Mock Service Worker 2.8.7を初期化

# Docker統合テスト（Firebase Emulator使用）
npm run docker:test     # Firebase Emulator環境を起動（ポート4000/8080/9099）
npm run docker:test:run # 統合テスト実行（Docker + tsx環境、7テスト）
npm run docker:test:down # Docker環境完全停止
npm run docker:e2e:run  # E2Eテスト実行（Playwright 1.54.1）

# Firebase Emulator（ローカル開発用）
npm run emulator:start  # 開発用Firebase Emulator起動
npm run emulator:test   # テスト用Firebase Emulator起動
```

## Claude Code指示書

- **プロジェクト全体**: `/CLAUDE.md` - プロジェクト開発ガイドライン
- **Todo機能**: `/features/todo/CLAUDE.md` - Todo機能の技術仕様
- **テスト**: `/tests/CLAUDE.md` - テスト戦略とガイドライン

## 認証フロー

- カスタム認証プロバイダーを使用したNextAuth.js
- サーバーサイドトークン検証用のFirebase Admin SDK
- `/api/auth/server-login`経由でのカスタムトークン交換
- ロールベースアクセス制御（admin/userロール）
- **SessionProvider統合**: `app/layout.tsx`でアプリ全体の認証状態管理
- **環境別認証**: 開発環境（X-User-ID）と本番環境（NextAuth.js）の自動切り替え
- **セキュリティ強化**: customToken等の機密情報をセッションから除外

## データ管理

- Todo状態管理用のReact Context（`TodoContext`）
- サーバー状態管理とキャッシュ用のSWR
- データベースとしてのFirebase Firestore
- より良いUXのための楽観的更新

## テスト戦略

- **フレームワーク**: Vitest 2.1.8 + React Testing Library 14.3.1 + MSW 2.8.7
- **カバレッジ**: 100%達成済み（24ファイル、413テスト）
- **ユニットテスト**: MSWによるAPIモック、高速実行（秒単位）
- **統合テスト**: Docker + Firebase Emulator環境、7テスト実行
- **E2Eテスト**: Playwright 1.54.1による完全なユーザーフロー検証
- **テスト構造**: フィーチャーベースの組織化（features/テスト構造に対応）
- **テストデータ**: ユーザー分離型データ（export_test_data.ts）とサブモジュール統一データ

### Docker統合テスト環境

- **Firebase Emulator**: Firestore + Auth + UI（ポート4000/8080/9099）
- **Next.jsアプリ**: ポート3002（テスト専用、開発環境と分離）
- **TypeScript実行**: tsx によるリアルタイムトランスパイル
- **データ初期化**: init-firebase-data.ts による自動テストデータ投入
- **ユーザー分離**: test-user-1（一般） / test-admin-1（管理者）の個別データ構造
- **設定分離**: vitest.integration.config.ts による統合テスト専用設定（60秒タイムアウト）
- **環境変数**: Firebase Emulator接続とMSW無効化の自動設定
