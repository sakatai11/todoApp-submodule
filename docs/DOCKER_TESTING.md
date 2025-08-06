# Dockerテスト環境

Next.js TodoアプリケーションでDocker を使用してFirebase Emulatorを含むテスト環境を構築し、APIテストを実施するための環境構築と使用方法について説明します。

## 🏗️ テスト環境の構成

### Dockerテスト環境

統合テスト、E2Eテストは**Docker環境専用**で、開発環境とは完全に分離されています。

#### 📍 テスト環境のポート設定

| サービス                 | テスト環境ポート |
| ------------------------ | ---------------- |
| **Next.jsアプリ**        | `localhost:3002` |
| **Firebase Emulator UI** | `localhost:4000` |
| **Firestore Emulator**   | `localhost:8080` |
| **Auth Emulator**        | `localhost:9099` |

#### 🔧 構成要素

- **Next.js App (TodoApp)**: テスト用メインアプリケーション
- **Firebase Emulator Suite**: Node.js Alpine ベースでFirestore + Auth エミュレーター
- **テスト専用コンテナ**: Vitest + Firebase Emulator連携

## 🚀 テストの実行方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# Firebase CLI（未インストールの場合）
npm install -g firebase-tools

# TypeScript実行環境（Docker環境で使用）
npm install -g tsx
```

### 🧪 2. テスト環境の起動

```bash
# テスト環境の起動
npm run docker:test

# テスト環境へのアクセス（手動確認用）
# 🌐 http://localhost:3002 - Next.jsアプリ (テスト用)
# 🔧 http://localhost:4000 - Firebase Emulator UI (テスト用)
```

**⚠️ 注意**: Firebase Emulator用カスタムDockerfile (`firebase-emulator.Dockerfile`) によりビルド時に依存関係を事前インストールするため、2回目以降の起動は大幅に高速化されます。初回のみ `docker-compose build` でのイメージビルドが必要です。Docker環境では自動的にTypeScriptファイル（`scripts/init-firebase-data.ts`）を実行してテストデータを初期化します。

**🔒 セキュリティ**: 全ポートが `127.0.0.1` にバインドされ、localhostからのみアクセス可能に制限されています。

### ⚡ 3. Docker統合テストの実行

**重要**: 統合テストはDocker環境でのみサポートされています。

```bash
# Docker統合テストの実行（Todo API + Lists API）
npm run docker:test:run

```

**技術詳細**: Docker環境では統合テスト専用設定（`vitest.integration.config.ts`）によりMSW（Mock Service Worker）が自動的に無効化され、Firebase Emulatorとの直接通信を実現。tsx実行環境により`scripts/init-firebase-data.ts`で自動的にユーザー分離テストデータを初期化し、Next.jsアプリ + Firebase Emulator + 統合テストの完全連携環境でテストを実行。**データ管理**: テスト実行毎にクリーンなデータで開始し、テスト終了時に完全リセット。

### 🧹 4. テスト環境の停止

```bash
# テスト環境の停止
npm run docker:test:down
```

## ⚙️ テスト設定

### 📝 ポート設定の変更

統合テスト環境のポート設定を変更する場合：

| 設定ファイル              | 用途                   |
| ------------------------- | ---------------------- |
| `docker-compose.test.yml` | テスト環境のポート設定 |
| `firebase.test.json`      | Emulatorのポート設定   |

### 🗄️ テストデータの管理と永続化

#### テストデータの構造と管理

テストデータは以下のファイルで管理されます：

- **初期データ投入**: `scripts/init-firebase-data.ts` で自動実行（tsx使用）
- **テストデータ定義**: `todoApp-submodule/mocks/data/master/firebase/export_test_data.ts`
- **ユーザー分離**: `test-user-1` / `test-admin-1` による個別データ構造
- **データクリーンアップ**: `scripts/cleanup-db.ts` で必要時に実行

#### テスト環境でのデータ永続化

**重要**: テスト環境は開発環境と異なり、データの永続化は一時的です。

- **Docker Volume**: ワークスペースは永続化されるが、Emulatorデータは停止時にリセット
- **データ初期化**: テスト実行前に毎回クリーンな状態でスタート
- **テスト用データ**: `USE_TEST_DB_DATA=true` でテスト専用データを使用
- **ユーザー分離データ**: 各テストユーザーが独立したデータを持つ

#### データライフサイクル（テスト環境）

1. **テスト環境起動**: Firebase Emulatorがクリーン状態で起動
2. **データ初期化**: `scripts/init-firebase-data.ts` が自動実行され、テスト用データを投入
3. **テスト実行**: 各統合テストが独立したデータセットで実行
4. **テスト完了**: テスト結果の収集後、コンテナ停止
5. **データクリア**: 停止時にEmulatorデータは完全にリセット

#### テストデータの特徴

- **一貫性**: 毎回同じ初期データでテスト開始
- **分離性**: ユーザー別の独立したデータ構造
- **信頼性**: テスト間でのデータ汚染を防止
- **再現性**: 同じ条件でのテスト繰り返しが可能

## 🐛 トラブルシューティングとデータ問題解決

### Firebase Emulatorが起動しない

```bash
# Firebase CLIの更新
npm install -g firebase-tools@latest

# Java Runtime Environmentの確認
java -version

# Docker内でのEmulator起動確認
docker-compose -f docker-compose.test.yml logs firebase-emulator-test

# Node.js Alpine イメージでの手動確認
docker run -it node:18-alpine sh
apk add --no-cache openjdk11-jre
npm install -g firebase-tools
```

### ポート競合エラー

```bash
# 使用中のポートを確認
lsof -ti:8080,9099,4000,3002

# プロセスの終了
kill -9 <PID>
```

### Docker関連エラー

```bash
# Dockerコンテナの強制停止・削除
docker-compose -f docker-compose.test.yml down --volumes --remove-orphans

# Docker imageの再ビルド
docker-compose -f docker-compose.test.yml build --no-cache

# 孤立コンテナのクリーンアップ
docker-compose -f docker-compose.test.yml down --remove-orphans

# Firebase Emulatorコンテナの個別確認
docker-compose -f docker-compose.test.yml up firebase-emulator-test
```

### テスト実行エラー

```bash
# テストデータベースの手動初期化
npm run emulator:test &
tsx scripts/init-firebase-data.ts

# テストデータのクリーンアップ
tsx scripts/cleanup-db.ts
```

### テストデータの問題

```bash
# テストデータの状態確認
# Emulator UI (localhost:4000) でFirestoreデータを目視確認

# テスト用ユーザーデータの確認
curl "http://localhost:9099/identitytoolkit.googleapis.com/v1/projects/todoapp-test/accounts" \
  -H "Authorization: Bearer owner"

# Firestoreテストデータの確認
curl "http://localhost:8080/v1/projects/todoapp-test/databases/(default)/documents" \
  -H "Authorization: Bearer owner"

# データ初期化スクリプトの手動実行
docker-compose -f docker-compose.test.yml exec firebase-emulator-test \
  tsx scripts/init-firebase-data.ts

# テスト環境の完全リセット
npm run docker:test:down
docker volume prune -f  # 全テストデータ削除
npm run docker:test:run  # クリーンデータで再実行
```

### データ永続化に関する問題

```bash
# Docker Volumeの確認
docker volume ls | grep todoapp
docker volume inspect <volume_name>

# テストデータの意図しない永続化確認
# テスト環境ではデータは一時的であるべき
docker-compose -f docker-compose.test.yml logs firebase-emulator-test | grep -i export

# テストデータの完全クリア
rm -rf firebase-emulator-data  # テスト用データキャッシュ削除
docker-compose -f docker-compose.test.yml down --volumes --remove-orphans
docker system prune -f
```

## 📊 CI/CD統合

GitHub ActionsなどのCI/CD環境で統合テストを実行する場合：

```yaml
# .github/workflows/test.yml
- name: Run Docker Integration Tests
  run: |
    npm run docker:test:run
```

## 🔄 テスト環境の特徴とデータ管理戦略

### 🎯 テストデータ管理の基本原則

#### 開発環境との違い

| 項目             | 開発環境                             | テスト環境                 |
| ---------------- | ------------------------------------ | -------------------------- |
| **データ永続化** | 部分的永続化                         | 一時的（テスト毎リセット） |
| **初期データ**   | 1回目のみ自動ロード                  | 毎回自動ロード             |
| **データ復元**   | 停止時エクスポート・起動時インポート | 毎回クリーン状態           |
| **データ目的**   | 開発作業用                           | テスト検証用               |
| **ポート番号**   | 3000/4000/8080/9099                  | 3002/4000/8080/9099        |

#### テストデータ管理の利点

- **一貫性保証**: 毎回同じ初期状態からテスト開始
- **テスト間独立性**: 各テストが他のテストに影響しない
- **データ汚染防止**: テスト実行後のデータが次回に影響しない
- **デバッグ容易性**: 予測可能なデータ状態でデバッグ可能

### テストワークフローとデータサイクル

#### 統合テストの実行サイクル

1. **環境初期化** (0-10秒)
   - Firebase Emulator起動（クリーン状態）
   - Next.jsアプリ起動（テストポート3002）
   - サービス間の連携確認

2. **データ初期化** (10-15秒)
   - `scripts/init-firebase-data.ts` 自動実行
   - ユーザー分離テストデータ投入
   - Firestoreサブコレクション構造構築

3. **テスト実行** (15-30秒)
   - 7テストの統合テスト実行
   - Todo/Lists APIのCRUD操作検証
   - ユーザー権限・認証テスト

4. **結果収集・クリーンアップ** (30-35秒)
   - テスト結果の収集とレポート
   - コンテナ停止とデータクリア
   - 次回テストのためのリセット

#### テストデータのベストプラクティス

```bash
# 高速テスト実行（推奨）
npm run docker:test:run  # 全環境自動構築+テスト

# 手動デバッグ用（開発時）
npm run docker:test      # 環境のみ起動
# → localhost:4000 でEmulator UI確認
# → localhost:3002 でNext.jsアプリ確認

# 問題がある場合のリセット
npm run docker:test:down
docker system prune -f   # 完全クリーンアップ
npm run docker:test:run  # クリーン環境で再実行
```

## 🔄 最新の変更内容（2025年実装）

### 完全なDocker統合テスト環境の構築

- **Docker専用統合テスト**: Next.js + Firebase Emulator のフル統合テスト環境
- **API統合テスト**: Todo/Lists APIの完全なCRUD操作テスト（7テスト実装、13.03秒で安定実行）
- **統合テスト専用設定**: `vitest.integration.config.ts`による統合テスト専用のVitest設定
- **MSW自動無効化**: Docker環境でMock Service Workerを自動停止し、実Emulatorとの直接通信を実現
- **タイムアウト最適化**: データベース初期化処理を30秒に延長し、安定性を向上
- **ローカル統合テスト廃止**: Docker環境でのみ統合テストをサポート
- **型安全性の確保**: TypeScript strict mode + ESLint `@typescript-eslint/no-explicit-any` 準拠
- **REST API標準化**: HTTPステータスコードの適切な使い分け（POST: 201 Created, PUT: 200 OK）

### TypeScript統合とユーザー分離データ管理

- **tsx実行環境**: Docker環境でのTypeScriptファイル直接実行
- **ユーザー分離テストデータ**: `export_test_data.ts`による本番同等のデータ構造
- **自動初期化**: `scripts/init-firebase-data.ts`による自動テストデータ投入
- **データクリーンアップ**: `scripts/cleanup-db.ts`による効率的なデータ管理
- **テストアカウント分離**: `test-user-1` / `test-admin-1` による役割別データ構造

### 統合テスト品質の向上

- **7テスト実装**: Todo/Lists APIの完全なCRUD操作テスト（13.03秒で安定実行）
- **ユーザー分離データ**: 本番環境と同等のFirestore subcollection構造
- **Firebase Emulator連携**: 実際のFirestore + Auth Emulatorとの完全統合
- **型安全性**: 全スクリプトでTypeScript型チェック

### Docker構成の最適化

- **軽量化**: `node:18-alpine` ベースで高速起動を実現
- **環境分離**: テスト用（ポート3002/4000）で開発環境と完全分離
- **Firebase CLI + tsx統合**: npm経由での統一インストールで依存関係を解決
- **設定統一**: `firebase.test.json`による統一設定管理

## 📋 関連ドキュメント

- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [DOCKER_DEVELOPMENT.md](DOCKER_DEVELOPMENT.md) - Docker開発環境
