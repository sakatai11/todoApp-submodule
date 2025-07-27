# Docker開発環境ガイド

## 概要

Next.js TodoアプリケーションのDocker開発環境の構築と使用方法について説明します。開発環境はテスト環境と完全に分離されており、日常の開発作業に最適化されています。

## 🏗️ 開発環境の構成

### Docker開発環境

開発環境は**日常の開発作業**に特化した構成で、テスト環境とは独立して動作します。

#### 📍 開発環境のポート設定

| サービス | 開発環境ポート |
|----------|----------------|
| **Next.jsアプリ** | `localhost:3000` |

#### 🔧 構成要素

- **Next.js App (TodoApp)**: メインアプリケーション
- **MSW (Mock Service Worker)**: APIリクエストのモック（完全なモック環境）
- **モックデータ**: `todoApp-submodule/mocks/`ディレクトリ管理
- **モック設定**: `NEXT_PUBLIC_API_MOCKING=enabled`でMSW完全有効化

## 🚀 開発環境の使用方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# MSWモックの初期化
npm run msw:init
```

### 🛠️ 2. 開発環境の起動

```bash
# 開発環境の起動
npm run docker:dev

# 開発環境へのアクセス
# 🌐 http://localhost:3000 - Next.jsアプリ（MSWモック環境）
```

**💡 特徴**: MSWによる完全なモック環境のため、外部依存なしで即座に開発開始可能です。

### 🧹 3. 開発環境の停止

```bash
# 開発環境の停止
docker-compose down
```

## ⚙️ 開発環境設定

### 📝 ポート設定の変更

開発環境のポート設定を変更する場合：

| 設定ファイル | 用途 |
|-------------|------|
| `docker-compose.yml` | 開発環境のポート設定 |

### 🗄️ モックデータの管理

開発環境では以下の方法でモックデータを管理できます：

- **MSWハンドラー**: `todoApp-submodule/mocks/handlers/`でAPIレスポンスをカスタマイズ
- **モックデータ**: `todoApp-submodule/mocks/data/`でテストデータを編集
- **リアルタイム反映**: ファイル編集後、即座にモックレスポンスが更新

### 🔧 MSW開発環境

開発環境では以下のMSW機能を活用：

- **完全オフライン**: 外部API依存なしで開発可能
- **高速レスポンス**: ネットワーク遅延なしで即座にレスポンス
- **カスタマイズ容易**: TypeScriptでモックロジックを記述

## 🔄 開発ワークフロー

### 典型的な開発手順

1. **環境起動**: `npm run docker:dev` で開発環境を起動
2. **開発作業**: `http://localhost:3000` でアプリケーション開発（MSWモック環境）
3. **モックデータ編集**: 必要に応じて `todoApp-submodule/mocks/` でデータをカスタマイズ
4. **テスト実行**: 必要に応じてローカルテスト（`npm run test`）を実行
5. **環境停止**: 作業終了時に `docker-compose down` で停止

### 他の環境との連携

- **ユニットテスト**: ローカル環境で `npm run test` を実行（MSWモック使用）

### モック開発の利点

MSW中心の開発環境では以下の利点があります：

- **即座の開発開始**: 外部サービス起動待ちなし
- **高速フィードバック**: APIレスポンスが瞬時
- **オフライン開発**: インターネット接続不要

## 🐛 トラブルシューティング

### MSWが正しく動作しない

```bash
# MSWの再初期化
npm run msw:init

# モック設定の確認
echo $NEXT_PUBLIC_API_MOCKING  # "enabled"であることを確認

# Next.js開発サーバーの再起動
npm run docker:dev
```

### ポート競合エラー

```bash
# 使用中のポートを確認
lsof -ti:3000

# プロセスの終了
kill -9 <PID>
```

### Docker関連エラー

```bash
# Dockerコンテナの強制停止・削除
docker-compose down --volumes --remove-orphans

# Docker imageの再ビルド
docker-compose build --no-cache

# 孤立コンテナのクリーンアップ
docker-compose down --remove-orphans
```

## ✅ MSW開発環境の利点

MSW中心の開発環境により以下の利点を実現：

- **高速開発**: 外部サービス起動待ちなしで即座に開発開始
- **完全オフライン**: インターネット接続不要で開発可能
- **データ制御**: モックデータを自由にカスタマイズ可能
- **安定性**: 外部API障害の影響を受けない
- **並行作業**: 開発とテストを同時に実行可能（環境分離）
- **デバッグ容易**: 予測可能なレスポンスでデバッグが簡単

## 🔧 技術詳細

### MSW + Docker統合

本プロジェクトでは以下のMSW統合により開発効率を向上：

- **完全モック環境**: 外部API依存なしの開発環境
- **TypeScript対応**: モックハンドラーも型安全で記述
- **リアルタイム反映**: モックデータ変更が即座に反映
- **本番同等レスポンス**: 本番APIと同じ構造のレスポンス

### モックデータ管理

- **ハンドラー分離**: API別にモックハンドラーを管理
- **データ構造**: 本番環境と同等のデータ構造を維持
- **簡単カスタマイズ**: TypeScriptファイル編集で即座にモック変更

## 📋 関連ドキュメント

- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [PRODUCTS.md](PRODUCTS.md) - プロジェクト全体構造

---

**💡 まとめ**: MSW中心のDocker開発環境により、外部依存なしの高速で安定した開発体験を実現できます。