# セキュリティレビュー CI ツール

このリポジトリでは、GitHub Actionsを使用した包括的なセキュリティチェックシステムを導入しています。

## 🔒 セキュリティ機能概要

### AI駆動セキュリティレビュー（オプション）
- **Claude Code Security Review**: コンテキストを理解したAI駆動の脆弱性検出（現在無効化）
- **差分対応スキャン**: Pull Requestの変更に焦点を当てたスマートな分析
- **偽陽性フィルタリング**: 高度な偽陽性除去による精度向上

### 従来型セキュリティスキャン（有効）
- **CodeQL Analysis**: GitHub標準の静的解析
- **Dependency Vulnerability Scan**: 依存関係の脆弱性検出
- **Secret Scanning**: 機密情報の検出（gitleaks使用）
- **ESLint Security Rules**: カスタムセキュリティルール
- **Custom Security Checks**: プロジェクト固有のセキュリティチェック

## 🚀 セットアップ方法

### 基本セットアップ（従来型スキャンのみ）

**追加設定不要** - ワークフローは自動的に以下のタイミングで実行されます：
- Pull Request作成・更新時
- main/develop-v2ブランチへのpush時
- 手動実行時（workflow_dispatch）

### 拡張セットアップ（Claude Code AI レビュー有効化）

Claude Code Security Review を有効化する場合：

#### 1. 必要なシークレットの設定
GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

```
CLAUDE_API_KEY: Claude APIキー（必須）
GITLEAKS_LICENSE: Gitleaksライセンス（オプション）
```

#### 2. Claude APIキーの取得
1. [Claude Console](https://console.anthropic.com/) にアクセス
2. API キーを生成
3. GitHub リポジトリのシークレットに `CLAUDE_API_KEY` として設定

#### 3. リポジトリ変数の設定
Settings > Secrets and variables > Actions > Variables タブで：

```
ENABLE_CLAUDE_REVIEW: true
```

#### 4. ワークフローファイルの編集
`.github/workflows/security-review.yml` でClaude Codeのジョブをコメントアウト解除：

```yaml
# 以下の行のコメントアウトを解除
claude-security-review:
  name: Claude Security Review
  # ... 残りの設定
```

## 📋 セキュリティチェック項目

### 現在有効なチェック項目

#### 従来型セキュリティスキャン
- **CodeQL Analysis**: 静的コード解析による脆弱性検出
- **Dependency Vulnerability Scan**: npm/yarn依存関係の既知脆弱性検出
- **Secret Scanning**: 機密情報・APIキー・パスワードの検出

#### カスタムセキュリティチェック
- Firebase設定の機密情報チェック
- Next.js セキュリティヘッダーの確認
- API Routes の認証チェック
- 環境変数の適切な使用確認
- 認証設定（NextAuth.js）の検証
- TypeScript 型安全性の確認
- Docker設定のセキュリティ検証
- Git設定の確認

#### ESLintセキュリティルール
- `eval()` の使用禁止
- `dangerouslySetInnerHTML` の制限
- TypeScript strict mode の強制
- 不安全な型操作の検出

### オプション項目（Claude Code有効化時）

#### Claude Code AI レビュー
- インジェクション攻撃の検出
- 認証・認可の不備
- データ露出リスク
- 暗号化の問題
- 入力検証の不備
- ビジネスロジックの脆弱性

## 🛠️ カスタマイズ

### ワークフロー設定の調整

`.github/workflows/security-review.yml` で以下を調整可能：

```yaml
- name: Claude Code Security Review
  uses: anthropics/claude-code-security-review@main
  with:
    claude-api-key: ${{ secrets.CLAUDE_API_KEY }}
    comment-pr: true  # PRへの自動コメント
    claude-model: 'claude-3-5-sonnet-20241022'  # モデル選択
    claudecode-timeout: 300  # タイムアウト（秒）
    exclude-directories: 'node_modules,dist,.next,public'  # 除外ディレクトリ
```

### カスタムセキュリティチェックの追加

`scripts/security-check.sh` を編集して、プロジェクト固有のセキュリティチェックを追加できます。

### ESLintルールの調整

`eslint.config.mjs` の `rules` セクションで、セキュリティ関連ルールをカスタマイズできます。

## 📊 結果の確認方法

### Pull Request
- 従来型セキュリティスキャンの結果をPRコメントで自動通知
- GitHub Security タブでCodeQL結果を確認
- Actions タブで詳細ログを確認
- Claude Code有効化時: AI駆動レビューコメントも追加

### Security タブ
- CodeQL の結果
- Dependabot アラート
- シークレットスキャニングの結果

### Artifacts
- `security-scan-results`: npm audit結果などの詳細レポート

## 🔧 トラブルシューティング

### Claude API エラー
```
Error: Claude API key not configured
```
→ `CLAUDE_API_KEY` シークレットが設定されているか確認

### タイムアウトエラー
```
Error: Claude Code analysis timed out
```
→ `claudecode-timeout` 値を増加（デフォルト300秒）

### カスタムチェックエラー
```
Error: Custom security check failed
```
→ `scripts/security-check.sh` の実行権限とスクリプト内容を確認

## 🚨 セキュリティ警告への対応

### Critical/High レベル
- 即座に修正が必要
- デプロイを停止して対応

### Moderate レベル  
- 計画的な修正を実施
- 次回リリースで対応

### Low/Info レベル
- レビューして必要に応じて対応
- 技術的負債として記録

## 📞 サポート

セキュリティレビューシステムに関する質問や問題は：

1. GitHub Issues で報告
2. Pull Request でワークフローの改善提案
3. Security タブで脆弱性の確認

## 🔄 継続的改善

- セキュリティルールの定期的な見直し
- 新しい脅威に対するチェック項目の追加
- Claude Code の最新機能の活用
- 偽陽性の報告と除外ルールの改善