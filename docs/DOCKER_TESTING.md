# Docker統合テスト環境

Next.js TodoアプリケーションでDocker を使用してFirebase Emulatorを含む統合テスト環境を構築し、API統合テストを実施するための環境構築と使用方法について説明します。

## 🏗️ 統合テスト環境の構成

### Docker統合テスト環境

統合テストは**Docker環境専用**で、開発環境とは完全に分離されています。

#### 📍 テスト環境のポート設定

| サービス                 | テスト環境ポート |
| ------------------------ | ---------------- |
| **Next.jsアプリ**        | `localhost:3001` |
| **Firebase Emulator UI** | `localhost:4001` |
| **Firestore Emulator**   | `localhost:8081` |
| **Auth Emulator**        | `localhost:9100` |

#### 🔧 構成要素

- **Next.js App (TodoApp)**: テスト用メインアプリケーション
- **Firebase Emulator Suite**: Node.js Alpine ベースでFirestore + Auth エミュレーター
- **統合テスト専用コンテナ**: Vitest + Firebase Emulator連携

### 統合テスト対象とカバレッジ

- **Todo API**: GET/POST/PUT/DELETE 全操作
- **Lists API**: リスト管理機能
- **認証フロー**: NextAuth.js + Firebase Admin SDK
- **型安全性**: TypeScript strict mode準拠

## 🚀 統合テストの実行方法

### 📋 1. 前提条件

```bash
# 依存関係のインストール
npm install

# Firebase CLI（未インストールの場合）
npm install -g firebase-tools
```

### 🧪 2. テスト環境の起動

```bash
# テスト環境の起動
npm run docker:test

# テスト環境へのアクセス（手動確認用）
# 🌐 http://localhost:3001 - Next.jsアプリ (テスト用)
# 🔧 http://localhost:4001 - Firebase Emulator UI (テスト用)
```

**⚠️ 注意**: Firebase Emulatorは初回起動時にJavaランタイムとFirebase CLIのインストールが実行されるため、数分かかる場合があります。

### ⚡ 3. Docker統合テストの実行

**重要**: 統合テストはDocker環境でのみサポートされています。

```bash
# Docker統合テストの実行（Todo API + Lists API）
npm run docker:test:run

# 統合テスト結果例（最新成功結果）
# ✅ Test Files: 1 passed (1)
# ✅ Tests: 7 passed (7)
# ⏱️ Duration: 13.03s (Firebase Emulator + Next.js + 統合テスト完全連携)
# ✅ Todo API統合テスト (6テスト)
#   - GET /api/(general)/todos: 認証済みユーザーのTodo取得
#   - GET /api/(general)/todos: 未認証ユーザーの401エラー
#   - POST /api/(general)/todos: 新規Todo作成（201 Created）
#   - POST /api/(general)/todos: 無効データの400エラー
#   - PUT /api/(general)/todos: 既存Todo更新
#   - DELETE /api/(general)/todos: Todo削除
# ✅ Lists API統合テスト (1テスト)
#   - GET /api/(general)/lists: リスト一覧取得
```

**注意**: ローカル環境での統合テスト（`npm run test:integration`）は廃止されました。統合テストはDocker環境（`npm run docker:test:run`）でのみ実行されます。

**技術詳細**: Docker環境では統合テスト専用設定（`vitest.integration.config.ts`）によりMSW（Mock Service Worker）が自動的に無効化され、Firebase Emulatorとの直接通信を実現。Next.jsアプリ + Firebase Emulator + 統合テストの完全連携環境でテストを実行。

### 🧹 4. テスト環境の停止

```bash
# テスト環境の停止
npm run docker:test:down
```

## ⚙️ 統合テスト設定

### 📝 ポート設定の変更

統合テスト環境のポート設定を変更する場合：

| 設定ファイル              | 用途                   |
| ------------------------- | ---------------------- |
| `docker-compose.test.yml` | テスト環境のポート設定 |
| `firebase.test.json`      | Emulatorのポート設定   |

### 🗄️ テストデータの設定

`tests/setup-db.ts`でテスト用の初期データを設定できます。

## 🐛 トラブルシューティング

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
lsof -ti:8080,9099,4000,3000

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
node -r esbuild-register tests/setup-db.ts
```

## 📊 CI/CD統合

GitHub ActionsなどのCI/CD環境で統合テストを実行する場合：

```yaml
# .github/workflows/test.yml
- name: Run Docker Integration Tests
  run: |
    npm run docker:test:run
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

### 統合テスト品質の向上

- **7テスト実装**: Todo/Lists APIの完全なCRUD操作テスト（13.03秒で安定実行）
- **統一テストデータ**: サブモジュールのモックデータを統一使用
- **Firebase Emulator連携**: 実際のFirestore + Auth Emulatorとの完全統合

### Docker構成の最適化

- **軽量化**: `node:18-alpine` ベースで高速起動を実現
- **環境分離**: テスト用（ポート3001/4001）で開発環境と完全分離
- **Firebase CLI安定化**: npm経由での直接インストールで依存関係を解決
- **設定統一**: `firebase.test.json`による統一設定管理

## 📋 関連ドキュメント

- [tests/TEST_ENVIRONMENTS.md](tests/TEST_ENVIRONMENTS.md) - テスト環境ガイドライン
- [tests/UT_TEST.md](tests/UT_TEST.md) - ユニットテストガイド
- [tests/IT_TEST.md](tests/IT_TEST.md) - 統合テストガイド
- [tests/E2E_TEST.md](tests/E2E_TEST.md) - E2Eテストガイド
- [DOCKER_DEVELOPMENT.md](DOCKER_DEVELOPMENT.md) - Docker開発環境
