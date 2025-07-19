# Docker + Database 統合テスト環境

Next.js TodoアプリケーションでDocker を使用してFirebase Emulatorを含む統合テスト環境を構築し、API統合テストとE2Eテストを実施するための環境構築と使用方法について説明します。

## 🏗️ 構築された環境

### Docker構成
- **Next.js App (TodoApp)**: メインアプリケーション（ポート3000/3001）
- **Firebase Emulator Suite**: Node.js Alpine ベースでFirestore + Auth エミュレーター
- **テスト専用環境**: 開発環境と分離された統合テスト環境
- **E2Eテスト環境**: Playwright による自動ブラウザテスト
- **統合テスト専用コンテナ**: Vitest + Firebase Emulator連携

### テスト種別とカバレッジ
- **統合テスト (Integration Test)**: API ↔ Firebase Emulator間の完全なデータフロー確認
  - **Todo API**: GET/POST/PUT/DELETE 全操作
  - **Lists API**: リスト管理機能
  - **認証フロー**: NextAuth.js + Firebase Admin SDK
  - **型安全性**: TypeScript strict mode準拠
- **E2Eテスト (End-to-End Test)**: ブラウザ操作 ↔ DB反映確認
  - **Todo機能全フロー**: 作成→編集→削除→ピン留め
  - **ドラッグ&ドロップ**: @dnd-kit による並び替え
  - **レスポンシブ対応**: モバイル/デスクトップ表示

## 🚀 使用方法

### 1. 環境セットアップ

```bash
# 依存関係のインストール
npm install

# Firebase CLI（未インストールの場合）
npm install -g firebase-tools

# Playwrightブラウザのインストール
npx playwright install
```

### 2. 開発環境の起動

```bash
# 開発用Docker環境の起動（NextJS + Firebase Emulator）
npm run docker:dev

# エミュレータUIアクセス
# http://localhost:4000 - Firebase Emulator UI
# http://localhost:3000 - NextJSアプリ
```

### 3. テスト専用環境の起動

```bash
# テスト専用Docker環境の起動
npm run docker:test

# テスト環境へのアクセス
# http://localhost:4001 - Firebase Emulator UI (テスト用)
# http://localhost:3001 - NextJSアプリ (テスト用)
```

**注意**: Firebase Emulatorは初回起動時にJavaランタイムとFirebase CLIのインストールが実行されるため、数分かかる場合があります。

### 4. 統合テスト（API Integration Test）の実行

```bash
# 統合テストの実行（Todo API + Lists API）
npm run test:integration

# 統合テストの監視モード（UI付き）
npm run test:integration:ui

# Dockerコンテナ内で統合テストを実行
npm run docker:test:run

# 統合テスト結果例
# ✅ Todo API統合テスト (4テスト)
#   - GET /api/(general)/todos: 認証済みユーザーのTodo取得
#   - POST /api/(general)/todos: 新規Todo作成（201 Created）
#   - PUT /api/(general)/todos: 既存Todo更新
#   - DELETE /api/(general)/todos: Todo削除
# ✅ Lists API統合テスト (1テスト)
#   - GET /api/(general)/lists: リスト一覧取得
```

### 5. E2Eテストの実行

```bash
# E2Eテストの実行
npm run test:e2e

# E2EテストのUIモード
npm run test:e2e:ui

# Dockerコンテナ内でE2Eテストを実行
npm run docker:e2e:run
```

### 6. 環境のクリーンアップ

```bash
# テスト環境の停止
npm run docker:test:down

# 開発環境の停止
docker-compose down
```

**ファイル構成の詳細は[PRODUCTS.md - プロジェクト構造](PRODUCTS.md#プロジェクト構造)を参照してください。**

## 🔧 カスタマイズ

### ポート設定の変更

必要に応じて以下のファイルでポートを変更できます：

- `docker-compose.yml`: 開発環境のポート
- `docker-compose.test.yml`: テスト環境のポート
- `firebase.json` / `firebase.test.json`: Emulatorのポート

### テストデータの設定

`tests/setup-db.ts`でテスト用の初期データを設定できます。

### E2Eテストの拡張

`tests/e2e/`ディレクトリに新しい`.spec.ts`ファイルを追加してテストケースを拡張できます。

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

GitHub ActionsなどのCI/CD環境で使用する場合：

```yaml
# .github/workflows/test.yml
- name: Run IT Tests (Integration Tests)
  run: |
    npm run docker:test
    npm run test:integration
    npm run docker:test:down

- name: Run E2E Tests  
  run: |
    npm run docker:test
    npm run test:e2e
    npm run docker:test:down
```

## 🎯 ベストプラクティス

1. **テストの独立性**: 各テストは他のテストに依存しない
2. **データクリーンアップ**: テスト後のデータクリアを確実に実行
3. **並列実行**: ITテスト（統合テスト）とE2Eテストは分離して実行
4. **環境分離**: 開発環境とテスト環境のポートを分ける
5. **モックデータ**: サブモジュールの統一されたテストデータを使用
6. **Docker最適化**: Node.js Alpineベースで軽量なEmulator環境を構築
7. **初回起動時間**: Firebase Emulatorの初回起動は時間がかかることを考慮
8. **設定ファイル管理**: `firebase.test.json`でホスト設定を適切に管理

## 🔄 最新の変更内容（2024年実装）

### 完全な統合テスト環境の構築
- **Docker統合**: Next.js + Firebase Emulator のフル統合テスト環境
- **API統合テスト**: Todo/Lists APIの完全なCRUD操作テスト（5テスト実装）
- **型安全性の確保**: TypeScript strict mode + ESLint `@typescript-eslint/no-explicit-any` 準拠
- **REST API標準化**: HTTPステータスコードの適切な使い分け（POST: 201 Created, PUT: 200 OK）

### テスト品質の向上
- **100%カバレッジ達成**: 22ファイル、413テスト、全成功
- **統一テストデータ**: サブモジュールのモックデータを全テストで統一使用
- **表記統一ルール**: テスト説明文の一貫した表記（「正常に〜」パターン）
- **Firebase Emulator連携**: 実際のFirestore + Auth Emulatorとの完全統合

### Docker構成の最適化
- **軽量化**: `node:18-alpine` ベースで高速起動を実現
- **環境分離**: 開発用（ポート3000/4000）とテスト用（ポート3001/4001）の完全分離
- **Firebase CLI安定化**: npm経由での直接インストールで依存関係を解決
- **設定統一**: `firebase.test.json`による統一設定管理

### API実装の改善
- **withAuthenticatedUser**: 認証ミドルウェアの型安全な実装
- **Firebase Admin SDK**: サーバーサイド認証とデータベース操作の統合
- **エラーハンドリング**: 適切なHTTPステータスコードと詳細なエラーメッセージ
- **Zodバリデーション**: リクエスト/レスポンスデータの型安全性確保

### E2Eテストの拡充
- **認証フロー**: NextAuth.js + Firebase Admin SDK の完全なテスト
- **Todo全機能**: 作成→編集→削除→ピン留めの包括的テスト
- **ドラッグ&ドロップ**: @dnd-kit/core による並び替え機能テスト
- **レスポンシブ対応**: モバイル/デスクトップ表示の自動テスト
- **リアルタイム同期**: Firebase Emulatorとの実データ連携テスト