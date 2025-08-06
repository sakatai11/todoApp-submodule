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

### 🗄️ 開発データの管理と永続化

開発環境では以下の方法で開発データを管理できます：

#### データ永続化の仕組み

- **Docker Volume永続化**: `volumes: - .:/workspace` によりワークスペース全体を永続化
- **Emulatorデータ保存**: Firebase Emulatorのデータは一時的だが、開発セッション中は保持
- **データ初期化**: `USE_DEV_DB_DATA=true` により開発用テストデータを自動ロード

#### データ管理方法

- **Firebase Emulator UI**: `http://localhost:4000` でFirestoreデータを視覚的に管理
- **開発用データ**: `USE_DEV_DB_DATA=true` で開発専用データを使用
- **テストユーザー**: `dev-user-1` (一般) / `dev-admin-1` (管理者) で認証テスト
- **リアルタイム更新**: Firestoreデータの変更が即座にアプリに反映

#### データライフサイクル

- **起動時**: 開発用テストデータが自動的にEmulatorに読み込まれる
- **開発中**: Emulator UIでデータ追加・編集・削除が可能
- **セッション中**: データは保持されるため、再起動不要
- **停止時**: Emulatorデータは`firebase-emulator-data`ディレクトリに自動エクスポートされ、次回起動時に自動復元

#### データバックアップ・リストア

```bash
# データエクスポート（手動バックアップ）
# Firebase Emulator UIから手動でデータエクスポート可能

# 開発データのリセット
docker-compose down --volumes  # 全データリセット
npm run docker:dev             # 初期データで再起動

# クリーンな開発環境の構築
docker-compose down --volumes --remove-orphans
docker-compose build --no-cache
npm run docker:dev
```

### 🔧 Firebase Emulator開発環境

開発環境では以下のFirebase Emulator機能を活用：

- **本番同等環境**: 実際のFirebaseと同じAPI・機能を提供
- **高速レスポンス**: ローカル環境のため高速なデータアクセス
- **データ永続化**: 開発セッション中のデータ保持
- **認証機能**: Firebase Authenticationの完全エミュレーション

## 🔄 開発ワークフローとデータ管理

### 典型的な開発手順

1. **環境起動**: `npm run docker:dev` で開発環境を起動
   - 開発用テストデータの自動ロード
   - Firebase Emulator（Firestore + Auth + UI）起動
2. **開発作業**: `http://localhost:3000` でアプリケーション開発（Firebase Emulator環境）
3. **データ管理**: `http://localhost:4000` のEmulator UIでデータを確認・編集
   - リアルタイムでのデータ変更
   - 開発中のデータ追加・修正
4. **テスト実行**: 必要に応じてローカルテスト（`npm run test`）を実行（MSWモック使用）
5. **環境停止**: 作業終了時に `npm run docker:dev:down` で停止
   - データは自動的にリセット（クリーンな次回起動）

### データ管理ベストプラクティス

#### 開発データの効率的な利用

```bash
# 1. クリーンな開発環境での開始
npm run docker:dev
# → 初期テストデータが自動ロード

# 2. 開発中のデータ操作
# → Emulator UI (localhost:4000) でリアルタイム編集

# 3. データ状態の確認
curl http://localhost:8080  # Firestore接続確認
curl http://localhost:9099  # Auth接続確認

# 4. データリセットが必要な場合
docker-compose restart firebase-emulator
# → 初期データで再スタート

# 5. 完全クリーンアップ
docker-compose down --volumes
npm run docker:dev
# → 全て初期状態からスタート
```

#### データ開発サイクル

1. **初期データ**: 起動時に一貫したテストデータでスタート
2. **開発データ**: 作業中は自由にデータ追加・編集
3. **テストデータ**: 機能テスト用の追加データ作成
4. **リセット**: 停止時に自動的にクリーンアップ
5. **再開**: 次回起動時は再び初期データからスタート

### 他の環境との連携

- **ユニットテスト**: ローカル環境で `npm run test` を実行（MSWモック使用）
- **統合テスト**: 別環境 `npm run docker:test:run` を実行（Firebase Emulator使用）

### Firebase Emulator開発とデータ管理の利点

Firebase Emulator中心の開発環境では以下の利点があります：

#### 開発効率の向上
- **本番同等環境**: 実際のFirebaseと同じ機能・APIで開発
- **高速フィードバック**: ローカル環境のため高速レスポンス
- **データ可視化**: Emulator UIでリアルタイムデータ確認
- **認証テスト**: Firebase Authenticationの完全テスト

#### データ管理の利点
- **一貫した初期状態**: 毎回同じテストデータからスタート
- **自由なデータ操作**: 開発中は制限なくデータ編集可能
- **データ破損回避**: 停止時自動リセットによる安全性
- **高速データアクセス**: ローカルEmulatorによる瞬時レスポンス
- **オフライン開発**: インターネット接続不要でフル機能利用

## 🐛 トラブルシューティング

### Firebase Emulatorが正しく動作しない

```bash
# Firebase Emulatorの状態確認
curl http://localhost:4000  # Emulator UIアクセス確認
curl http://localhost:8080  # Firestore Emulator確認
curl http://localhost:9099  # Auth Emulator確認

# Docker環境の再起動
npm run docker:dev:down
npm run docker:dev

# Firebase設定の確認
cat firebase.json  # Firebase設定ファイル確認
```

### データが正しく表示されない

```bash
# Emulatorデータの確認
# Emulator UI (localhost:4000) でFirestoreデータを目視確認

# 初期データの再ロード
docker-compose restart firebase-emulator

# 開発データ設定の確認
docker-compose exec nextjs printenv | grep DEV_DB_DATA
# → USE_DEV_DB_DATA=true であることを確認

# 完全なデータリセット
docker-compose down --volumes
npm run docker:dev  # 初期データで再起動
```

### データ永続化に関する問題

```bash
# Docker Volumeの状態確認
docker volume ls
docker volume inspect <volume_name>

# Volume権限の問題解決
docker-compose down
sudo chown -R $USER:$USER .  # ディレクトリ権限修正
npm run docker:dev

# データ初期化スクリプトの確認
# 開発用データローダーが正常動作しているか確認
docker-compose logs firebase-emulator
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

### 開発データ管理と永続化戦略

#### データ永続化レベル

- **セッション永続化**: 開発セッション中はデータが保持される
- **Docker Volume**: ワークスペース全体 (`./workspace`) が永続化
- **一時的データ**: Emulatorデータは停止時にリセット（意図的設計）
- **初期データ復元**: 起動時に開発用テストデータを自動復元

#### データ管理機能

- **Emulator UI**: ブラウザベースでFirestoreデータを視覚的に管理
- **データ構造**: 本番環境と同等のデータ構造を維持
- **開発専用データ**: `USE_DEV_DB_DATA=true`で開発用データを使用
- **ユーザー管理**: 開発用テストユーザーでの認証テスト

#### 永続化のメリット・デメリット

**メリット**:
- 開発中のデータ変更が保持される
- 再起動時のデータロード時間短縮
- 開発途中のテストデータ継続利用

**デメリット（意図的設計）**:
- 停止時データリセットにより毎回クリーンな状態で開始
- データ破損リスクの回避
- 一貫したテスト環境の提供

## 📋 関連ドキュメント

- [DOCKER_TESTING.md](DOCKER_TESTING.md) - Docker統合テスト環境
- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [PRODUCTS.md](PRODUCTS.md) - プロジェクト全体構造

---

**💡 まとめ**: Firebase Emulator中心のDocker開発環境により、本番同等の機能を持つ高速で安定した開発体験を実現できます。データは開発セッション中は保持され、停止時にクリーンアップされることで、一貫したテスト環境と開発効率の両立を実現しています。