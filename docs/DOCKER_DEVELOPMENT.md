# Docker開発環境ガイド

## 概要

Next.js TodoアプリケーションのDocker開発環境の構築と使用方法について説明します。開発環境はテスト環境と完全に分離されており、日常の開発作業に最適化されています。

## 🏗️ 開発環境の構成

### Docker開発環境

開発環境は**日常の開発作業**に特化した構成で、テスト環境とは独立して動作します。Firebase Emulator環境を使用し、実際のFirebaseサービスと同等の機能を提供します。

#### 🔧 Docker構成の最適化

開発環境では以下の最適化が施されています：

- **カスタムDockerfile**: Firebase Emulator用の専用Dockerfile (`firebase-emulator.Dockerfile`) でビルド時に依存関係をインストール
- **高速起動**: パッケージの事前インストールにより起動時間を大幅短縮（数分→数秒）
- **セキュリティ強化**: ポートバインドを `127.0.0.1` に制限してlocalhostのみアクセス許可

#### 📍 開発環境のポート設定

| サービス | 開発環境ポート | 説明 |
|----------|----------------|------|
| **Next.jsアプリ** | `localhost:3000` | メインアプリケーション |
| **Firebase Emulator UI** | `localhost:4000` | Firebase管理画面 |
| **Firestore Emulator** | `localhost:8080` | Firestore データベース |
| **Firebase Auth Emulator** | `localhost:9099` | 認証サービス |
| **Firebase Functions** | `localhost:5001` | Cloud Functions（将来拡張用） |

#### 🔧 構成要素

- **Next.js App (TodoApp)**: メインアプリケーション
- **Firebase Emulator**: Firestore + Auth + UIを提供する開発環境
- **開発データベース**: `USE_DEV_DB_DATA=true`で開発用データを使用
- **Emulator Mode**: `NEXT_PUBLIC_EMULATOR_MODE=true`でFirebase Emulator接続
- **開発用認証**: `dev-user-1` / `dev-admin-1` テストユーザー

## 🚀 開発環境の使用方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# Firebase設定ファイルの確認
# firebase.json（開発用設定）が存在することを確認
```

### 🛠️ 2. 開発環境の起動

```bash
# 初回のみ: Dockerイメージのビルド（カスタムDockerfile適用）
docker-compose build

# 開発環境の起動
npm run docker:dev

# 開発環境へのアクセス
# 🌐 http://localhost:3000 - Next.jsアプリ（Firebase Emulator環境）
# 🔧 http://localhost:4000 - Firebase Emulator UI（データベース管理）
```

**💡 特徴**: 
- Firebase Emulatorによる本番同等の開発環境
- カスタムDockerfileにより2回目以降の起動が大幅に高速化
- セキュリティ強化されたポート設定でlocalhostのみアクセス許可
- 開発用テストデータの自動セットアップ

### 🧹 3. 開発環境の停止

```bash
# 開発環境の停止
npm run docker:dev:down

# または直接Docker Composeコマンド
docker-compose down
```

## ⚙️ 開発環境設定

### 📝 ポート設定の変更

開発環境のポート設定を変更する場合：

| 設定ファイル | 用途 |
|-------------|------|
| `docker-compose.yml` | 開発環境のポート設定 |
| `firebase.json` | Firebase Emulatorのポート設定 |

### 🗄️ 開発データの管理

開発環境では以下の方法で開発データを管理できます：

- **Firebase Emulator UI**: `http://localhost:4000` でFirestoreデータを視覚的に管理
- **開発用データ**: `USE_DEV_DB_DATA=true` で開発専用データを使用
- **テストユーザー**: `dev-user-1` (一般) / `dev-admin-1` (管理者) で認証テスト
- **リアルタイム更新**: Firestoreデータの変更が即座にアプリに反映

### 🔧 Firebase Emulator開発環境

開発環境では以下のFirebase Emulator機能を活用：

- **本番同等環境**: 実際のFirebaseと同じAPI・機能を提供
- **高速レスポンス**: ローカル環境のため高速なデータアクセス
- **データ永続化**: 開発セッション中のデータ保持
- **認証機能**: Firebase Authenticationの完全エミュレーション

## 🔄 開発ワークフロー

### 典型的な開発手順

1. **環境起動**: `npm run docker:dev` で開発環境を起動
2. **開発作業**: `http://localhost:3000` でアプリケーション開発（Firebase Emulator環境）
3. **データ管理**: `http://localhost:4000` のEmulator UIでデータを確認・編集
4. **テスト実行**: 必要に応じてローカルテスト（`npm run test`）を実行（MSWモック使用）
5. **環境停止**: 作業終了時に `npm run docker:dev:down` で停止

### 他の環境との連携

- **ユニットテスト**: ローカル環境で `npm run test` を実行（MSWモック使用）
- **統合テスト**: 別環境 `npm run docker:test:run` を実行（Firebase Emulator使用）

### Firebase Emulator開発の利点

Firebase Emulator中心の開発環境では以下の利点があります：

- **本番同等環境**: 実際のFirebaseと同じ機能・APIで開発
- **高速フィードバック**: ローカル環境のため高速レスポンス
- **データ可視化**: Emulator UIでリアルタイムデータ確認
- **認証テスト**: Firebase Authenticationの完全テスト

## 🐛 トラブルシューティング

### Firebase Emulatorが正しく動作しない

```bash
# Firebase Emulatorの状態確認
curl http://localhost:4000  # Emulator UIアクセス確認
curl http://localhost:8080  # Firestore Emulator確認

# Docker環境の再起動
npm run docker:dev:down
npm run docker:dev

# Firebase設定の確認
cat firebase.json  # Firebase設定ファイル確認
```

### ポート競合エラー

```bash
# 使用中のポートを確認
lsof -ti:3000,4000,8080,9099,5001

# プロセスの終了
kill -9 <PID>

# Docker環境の完全停止
docker-compose down --volumes --remove-orphans
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

## ✅ Firebase Emulator開発環境の利点

Firebase Emulator中心の開発環境により以下の利点を実現：

- **本番同等開発**: 実際のFirebaseと同じ機能・APIで開発
- **完全オフライン**: インターネット接続不要で開発可能
- **データ可視化**: Emulator UIでリアルタイムデータ確認・管理
- **安定性**: 外部API障害の影響を受けない
- **並行作業**: 開発とテストを同時に実行可能（環境分離）
- **認証機能**: Firebase Authenticationの完全エミュレーション
- **高速動作**: ローカル環境のため高速なデータベースアクセス

## 🔧 技術詳細

### Firebase Emulator + Docker統合

本プロジェクトでは以下のFirebase Emulator統合により開発効率を向上：

- **本番同等環境**: Firebase本番環境と同じAPI・機能を提供
- **TypeScript対応**: Firebase SDKの完全な型安全性
- **リアルタイム反映**: Firestoreデータ変更が即座にアプリに反映
- **認証統合**: NextAuth.js + Firebase Authenticationの完全統合

### 開発データ管理

- **Emulator UI**: ブラウザベースでFirestoreデータを視覚的に管理
- **データ構造**: 本番環境と同等のデータ構造を維持
- **開発専用データ**: `USE_DEV_DB_DATA=true`で開発用データを使用
- **ユーザー管理**: 開発用テストユーザーでの認証テスト

## 📋 関連ドキュメント

- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [PRODUCTS.md](PRODUCTS.md) - プロジェクト全体構造

---

**💡 まとめ**: Firebase Emulator中心のDocker開発環境により、本番同等の機能を持つ高速で安定した開発体験を実現できます。