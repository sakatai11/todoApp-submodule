# todoApp-submodule

## 概要

TodoAppで使用するモックAPIとテストデータを管理するサブモジュールです。MSW (Mock Service Worker) を使用してAPIリクエストをモックし、開発環境での効率的な開発をサポートします。

## ディレクトリ構造

```
todoApp-submodule/
├── mocks/
│   ├── browser.ts          # ブラウザ用MSW設定
│   ├── server.ts           # サーバー用MSW設定
│   ├── initMocks.ts        # MSW初期化関数
│   ├── data/               # モックデータ定義
│   │   ├── index.ts        # データエクスポート
│   │   ├── lists.ts        # リストモックデータ
│   │   ├── todos.ts        # Todoモックデータ
│   │   └── user.ts         # ユーザーモックデータ
│   └── handlers/           # APIエンドポイントハンドラー
│       ├── index.ts        # ハンドラーエクスポート
│       ├── auth.ts         # 認証API
│       ├── dashboard.ts    # ダッシュボードAPI
│       ├── lists.ts        # リスト管理API
│       └── todos.ts        # Todo管理API
└── README.md               # このファイル
```
