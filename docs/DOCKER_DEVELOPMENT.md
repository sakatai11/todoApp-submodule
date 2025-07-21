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
| **Firebase Emulator UI** | `localhost:4000` |
| **Firestore Emulator** | `localhost:8080` |
| **Auth Emulator** | `localhost:9099` |

#### 🔧 構成要素

- **Next.js App (TodoApp)**: メインアプリケーション
- **MSW (Mock Service Worker)**: APIリクエストのモック（優先使用）
- **Firebase Emulator Suite**: Node.js Alpine ベースでFirestore + Auth エミュレーター（バックグラウンド起動）
- **モック優先設定**: `NEXT_PUBLIC_API_MOCKING=enabled`でMSWが主要なAPI提供

## 🚀 開発環境の使用方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# Firebase CLI（未インストールの場合）
npm install -g firebase-tools
```

### 🛠️ 2. 開発環境の起動

```bash
# 開発環境の起動
npm run docker:dev

# 開発環境へのアクセス
# 🌐 http://localhost:3000 - Next.jsアプリ
# 🔧 http://localhost:4000 - Firebase Emulator UI
```

**⚠️ 注意**: Firebase Emulatorは初回起動時にJavaランタイムとFirebase CLIのインストールが実行されるため、数分かかる場合があります。

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
| `firebase.json` | Emulatorのポート設定 |

### 🗄️ 開発データの管理

開発環境では以下の方法でデータを管理できます：

- **Firebase Emulator UI**: `http://localhost:4000` でデータの確認・編集
- **データの永続化**: Emulator設定により開発データが保持される
- **データリセット**: 必要に応じてEmulatorデータをクリア可能

## 🔄 開発ワークフロー

### 典型的な開発手順

1. **環境起動**: `npm run docker:dev` で開発環境を起動
2. **開発作業**: `http://localhost:3000` でアプリケーション開発
3. **データ確認**: `http://localhost:4000` でFirebase Emulator UIを使用
4. **テスト実行**: 必要に応じてローカルテスト（`npm run test`）を実行
5. **環境停止**: 作業終了時に `docker-compose down` で停止

### 他の環境との連携

- **ユニットテスト**: ローカル環境で `npm run test` を実行
- **統合テスト**: 別途 `npm run docker:test:run` で実行
- **E2Eテスト**: 必要に応じて `npm run docker:e2e:run` で実行

## 🐛 トラブルシューティング

### Firebase Emulatorが起動しない

```bash
# Firebase CLIの更新
npm install -g firebase-tools@latest

# Java Runtime Environmentの確認
java -version

# Docker内でのEmulator起動確認
docker-compose logs firebase-emulator
```

### ポート競合エラー

```bash
# 使用中のポートを確認
lsof -ti:3000,4000,8080,9099

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

## ✅ 環境分離の利点

開発環境とテスト環境を分離することで以下の利点があります：

- **ポート競合回避**: 開発中でもテストが実行可能
- **データ分離**: 開発データとテストデータが混在しない
- **安定性向上**: テスト実行が開発環境に影響を与えない
- **並行作業**: 開発とテストを同時に実行可能
- **モック中心開発**: MSW優先のモックAPIで高速開発、必要時にEmulatorも利用可能

## 📋 関連ドキュメント

- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [PRODUCTS.md](PRODUCTS.md) - プロジェクト全体構造

---

**💡 まとめ**: Docker開発環境により、一貫した開発体験と他環境からの独立性を実現できます。