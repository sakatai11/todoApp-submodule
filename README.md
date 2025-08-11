# todoApp-submodule

## 概要

TodoApp-nextのプロジェクトで使用するモックAPIと仕様書を管理するリポジトリです。

## ディレクトリ構造

```
todoApp-submodule/
├── mocks/                          # MSW 2.8.7モック関連ファイル
│   ├── browser.ts                  # ブラウザ環境用MSWワーカー設定
│   ├── server.ts                   # Node.js環境用MSWサーバー設定
│   ├── initMocks.ts                # 環境判定とMSW自動初期化
│   │
│   ├── data/                       # 統一モックデータ定義
│   │   ├── index.ts                # 全データの統合エクスポート
│   │   ├── lists.ts                # Todoカテゴリ・ステータスデータ
│   │   ├── todos.ts                # Todo項目のサンプルデータ
│   │   ├── user.ts                 # テストユーザー情報
│   │   └── master/                 # マスターテストデータ
│   │       └── firebase/           # Firebase Emulator用データ
│   │           ├── export_dev_data.ts   # 開発用データ
│   │           └── export_test_data.ts  # ユーザー分離テストデータ
│   │
│   └── handlers/                   # APIエンドポイントハンドラー
│       ├── index.ts                # 全ハンドラーの統合エクスポート
│       ├── auth.ts                 # NextAuth.js v5対応認証API
│       ├── dashboard.ts            # ダッシュボード統計API
│       ├── lists.ts                # リスト管理API (CRUD操作)
│       └── todos.ts                # Todo管理API (CRUD操作)
│
├── docs/                           # 包括的技術仕様書・ドキュメント
│   ├── PRODUCTS.md                 # プロジェクト全体概要・技術スタック
│   ├── PROJECT_BEST_PRACTICES.md  # 開発ベストプラクティス
│   ├── DOCKER_TESTING.md          # Docker統合テスト環境ガイド
│   ├── DOCKER_DEVELOPMENT.md      # Docker開発環境ガイド
│   ├── VITEST_INTEGRATION_CONFIG.md # Vitest統合テスト設定詳細
│   ├── MOCK.md                     # MSWモック仕様
│   │
│   ├── api/                        # API仕様書（App Router対応）
│   │   ├── admin/                  # 管理者向けAPI (app/api/(admin)/)
│   │   ├── auth/                   # 認証関連API (app/api/auth/)
│   │   └── general/                # 一般ユーザー向けAPI (app/api/(general)/)
│   │
│   ├── app/                        # Next.js App Router仕様
│   │   ├── libs/                   # 共通ライブラリ仕様
│   │   └── *.md                    # 各ページ・機能仕様書
│   │
│   ├── auth/                       # NextAuth.js v5認証システム仕様
│   ├── data/                       # データ構造・フォーム仕様
│   ├── features/                   # フィーチャーベース機能仕様
│   │   ├── todo/                   # Todo機能詳細仕様
│   │   ├── shared/                 # 共通機能仕様
│   │   └── utils/                  # ユーティリティ仕様
│   ├── tests/                      # テスト戦略・ガイドライン
│   │   ├── UT_TEST.md              # ユニットテスト（Vitest 2.1.8）
│   │   ├── IT_TEST.md              # 統合テスト（Docker + Firebase Emulator）
│   │   └── E2E_TEST.md             # E2Eテスト（Playwright 1.54.1）
│   ├── mocks/                      # モック・テストデータ仕様
│   └── types/                      # TypeScript型定義仕様
│
└── README.md                       # このファイル
```

## 主要ドキュメント

### 📋 プロジェクト概要

- **[PRODUCTS.md](docs/PRODUCTS.md)**: プロジェクト全体概要・最新技術スタック・開発コマンド
- **[PROJECT_BEST_PRACTICES.md](docs/PROJECT_BEST_PRACTICES.md)**: 開発ベストプラクティス・品質管理指針

### 🔧 開発環境

- **[DOCKER_DEVELOPMENT.md](docs/DOCKER_DEVELOPMENT.md)**: Docker開発環境ガイド
- **[DOCKER_TESTING.md](docs/DOCKER_TESTING.md)**: Docker統合テスト環境ガイド
- **[VITEST_INTEGRATION_CONFIG.md](docs/VITEST_INTEGRATION_CONFIG.md)**: Vitest統合テスト設定詳細

### 🧪 テスト戦略

- **[tests/UT_TEST.md](docs/tests/UT_TEST.md)**: ユニットテスト（Vitest 2.1.8 + React Testing Library 14.3.1）
- **[tests/IT_TEST.md](docs/tests/IT_TEST.md)**: 統合テスト（Docker + Firebase Emulator）
- **[tests/E2E_TEST.md](docs/tests/E2E_TEST.md)**: E2Eテスト（Playwright 1.54.1）

### 🎭 モック・テストデータ

- **[MOCK.md](docs/MOCK.md)**: MSW 2.8.7モック仕様・使用方法
- **[mocks/overview.md](docs/mocks/overview.md)**: モック機能概要
- **[mocks/mockData.md](docs/mocks/mockData.md)**: テストデータ仕様

## サブモジュールの役割

1. **統一モックデータ**: 全テスト環境で使用する一貫したテストデータを提供
2. **API仕様書**: App Router対応のAPI設計仕様を詳細に文書化
3. **テスト戦略**: 100%カバレッジを実現するテスト方針とガイドライン
4. **開発ガイド**: フィーチャーベース開発のベストプラクティスを提供
5. **環境管理**: Docker環境での開発・テスト環境を完全統一

これらのリソースにより、高品質で保守性の高いアプリケーション開発を継続的に支援しています。
