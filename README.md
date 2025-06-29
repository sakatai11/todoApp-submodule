# todoApp-submodule

## 概要

TodoApp-nextのプロジェクトで使用するモックAPIと仕様書を管理するリポジトリです。

## ディレクトリ構造

```
todoApp-submodule/
├── mocks/                          # MSWモック関連ファイル
│   ├── browser.ts                  # ブラウザ環境用MSWワーカー設定
│   ├── server.ts                   # Node.js環境用MSWサーバー設定
│   ├── initMocks.ts                # 環境判定とMSW自動初期化
│   │
│   ├── data/                       # モックデータ定義
│   │   ├── index.ts                # 全データの統合エクスポート
│   │   ├── lists.ts                # Todoカテゴリ・ステータスデータ
│   │   ├── todos.ts                # Todo項目のサンプルデータ
│   │   └── user.ts                 # テストユーザー情報
│   │
│   └── handlers/                   # APIエンドポイントハンドラー
│       ├── index.ts                # 全ハンドラーの統合エクスポート
│       ├── auth.ts                 # 認証関連API (login/signup/logout)
│       ├── dashboard.ts            # ダッシュボード統計API
│       ├── lists.ts                # リスト管理API (CRUD操作)
│       └── todos.ts                # Todo管理API (CRUD操作)
│
├── docs/                           # プロジェクト仕様書・ドキュメント
│   ├── README.md                   # ドキュメント全体の概要
│   ├── MOCK.md                     # モック仕様の詳細説明
│   ├── TEST.md                     # テスト実装ガイド
│   │
│   ├── api/                        # API仕様書
│   │   ├── admin/                  # 管理者向けAPI
│   │   ├── auth/                   # 認証関連API
│   │   └── general/                # 一般ユーザー向けAPI
│   │
│   ├── app/                        # アプリケーション仕様
│   │   ├── libs/                   # ライブラリ関数仕様
│   │   └── *.md                    # 各ページ仕様書
│   │
│   ├── auth/                       # 認証システム仕様
│   ├── data/                       # データ構造仕様
│   ├── features/                   # 機能別仕様書
│   ├── mocks/                      # モック仕様書
│   └── types/                      # 型定義仕様
│
└── README.md                       # このファイル
```

## プロダクトについて

`docs/README.md`を参照してください。

## モック機能

`docs/MOCK.md`を参照してください。

## テスト機能

`docs/TEST.md`を参照してください。
