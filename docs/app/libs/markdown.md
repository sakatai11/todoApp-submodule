# markdown.ts 仕様書

## 概要
`app/libs/markdown.ts` はMarkdownファイルの解析とHTMLリンク抽出を行うサーバーサイド専用ライブラリです。ナビゲーションリンクデータの生成に使用されます。

## 実行環境
- **サーバーサイド専用**（Node.js環境）
- Server Componentsでのマークダウンファイル処理
- ファイルシステムアクセスが必要

## 依存関係
```typescript
import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';
import { LinkSection } from '@/types/markdown/markdownData';
```

## 関数詳細

### getLinks

**概要**: Markdownファイルからリンク情報を抽出し、セクション別に整理する関数

**シグネチャ**:
```typescript
export async function getLinks(): Promise<{
  headerLinks: LinkSection[];
  authLinks: LinkSection[];
}>
```

#### パラメータ
- なし

#### 戻り値
```typescript
{
  headerLinks: LinkSection[];   // ヘッダーナビゲーション用リンク
  authLinks: LinkSection[];     // 認証コンテンツ用リンク
}
```

#### データ型

**LinkSection**:
```typescript
type LinkSection = {
  title: string;                // セクションタイトル
  links: Array<{
    name: string;               // リンク表示名
    href: string;               // リンクURL
  }>;
}
```

## 処理フロー

### 1. ファイル読み込み
```typescript
const fullPath = path.join(process.cwd(), 'data', 'links', 'links.md');
const fileContents = fs.readFileSync(fullPath, 'utf8');
```

**対象ファイル**: `data/links/links.md`

### 2. セクション分割
```typescript
const sections = fileContents.split(/^#\s+/gm).filter(Boolean);
```

**分割パターン**:
- `# ヘッダー` セクション
- `# 認証コンテンツ` セクション

### 3. セクション抽出
```typescript
const headerMarkdown = sections.find((s) => s.startsWith('ヘッダー')) ?? '';
const authMarkdown = sections.find((s) => s.startsWith('認証コンテンツ')) ?? '';
```

### 4. HTML変換とリンク抽出

**Markdown → HTML変換**:
```typescript
const processedContent = await remark().use(html).process(markdown);
const contentHtml = processedContent.toString();
```

**リンク抽出処理**:
```typescript
const convertToLinkSections = async (markdown: string): Promise<LinkSection[]> => {
  // HTML変換
  const processedContent = await remark().use(html).process(markdown);
  const contentHtml = processedContent.toString();

  const sections: LinkSection[] = [];
  let currentSection: LinkSection | null = null;
  const lines = contentHtml.split('\n');

  for (const line of lines) {
    // H2タグでセクション開始
    if (line.startsWith('<h2>')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = line.replace(/<\/?h2>/g, '').trim();
      currentSection = { title, links: [] };
    } 
    // リンクタグを検出
    else if (line.includes('<a ') && currentSection) {
      const hrefMatch = line.match(/href="([^"]+)"/);
      const nameMatch = line.match(/>([^<]+)</);

      if (hrefMatch && nameMatch) {
        currentSection.links.push({
          name: nameMatch[1].trim(),
          href: hrefMatch[1],
        });
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};
```

## Markdownファイル形式

### 期待されるファイル構造
```markdown
# ヘッダー

## ナビゲーション
- [ホーム](/home)
- [Todo](/todo)
- [設定](/settings)

## ユーザーメニュー
- [プロフィール](/profile)
- [ログアウト](/logout)

# 認証コンテンツ

## 認証ページ
- [ログイン](/signin)
- [新規登録](/signup)

## ヘルプ
- [使い方](/help)
- [お問い合わせ](/contact)
```

### HTML変換後の構造
```html
<h2>ナビゲーション</h2>
<ul>
<li><a href="/home">ホーム</a></li>
<li><a href="/todo">Todo</a></li>
<li><a href="/settings">設定</a></li>
</ul>

<h2>ユーザーメニュー</h2>
<ul>
<li><a href="/profile">プロフィール</a></li>
<li><a href="/logout">ログアウト</a></li>
</ul>
```

## 正規表現パターン

### HTML要素抽出

**href属性抽出**:
```typescript
const hrefMatch = line.match(/href="([^"]+)"/);
```

**リンクテキスト抽出**:
```typescript
const nameMatch = line.match(/>([^<]+)</);
```

**H2タグ除去**:
```typescript
const title = line.replace(/<\/?h2>/g, '').trim();
```

## エラーハンドリング

### ファイル読み込みエラー
```typescript
// fs.readFileSync がエラーをthrow
// - ファイルが存在しない
// - アクセス権限がない
// - ディスクエラー
```

### Markdown解析エラー
```typescript
// remark処理でのエラー
// - 不正なMarkdown形式
// - メモリ不足
```

### 想定される例外処理
```typescript
try {
  const { headerLinks, authLinks } = await getLinks();
} catch (error) {
  console.error('Failed to load links:', error);
  // フォールバック処理
  return { headerLinks: [], authLinks: [] };
}
```

## パフォーマンス

### ファイルI/O
- 同期読み込み（`fs.readFileSync`）
- ファイルサイズに依存した処理時間
- キャッシュ機能なし

### 処理負荷
- Markdown → HTML変換
- 正規表現による文字列処理
- 配列操作

## 使用場所

### Server Components
```typescript
// ヘッダーコンポーネントでの使用
export default async function Header() {
  const { headerLinks } = await getLinks();
  
  return (
    <nav>
      {headerLinks.map(section => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          <ul>
            {section.links.map(link => (
              <li key={link.href}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

### 認証関連コンポーネント
```typescript
// 認証ページでの使用
export default async function AuthLayout() {
  const { authLinks } = await getLinks();
  
  return (
    <aside>
      {authLinks.map(section => (
        <MenuSection key={section.title} section={section} />
      ))}
    </aside>
  );
}
```

## 制限事項

1. **ファイル形式固定**: 特定のMarkdown形式に依存
2. **同期処理**: ファイル読み込みが同期的
3. **エラー詳細**: エラー内容の詳細化が不十分
4. **キャッシュなし**: 毎回ファイルを読み込み
5. **バリデーション**: リンクURLの検証なし

## セキュリティ考慮事項

### パス操作
```typescript
path.join(process.cwd(), 'data', 'links', 'links.md')
```
- 固定パスのみアクセス
- ディレクトリトラバーサル攻撃を防止

### HTML生成
- remarkライブラリによる安全なHTML生成
- XSS攻撃の可能性は低い

## 拡張可能性

### 今後の改善案

**1. 非同期ファイル読み込み**:
```typescript
const fileContents = await fs.promises.readFile(fullPath, 'utf8');
```

**2. キャッシュ機能**:
```typescript
// メモリキャッシュまたはファイルキャッシュ
const cachedLinks = cache.get('links');
if (!cachedLinks) {
  const links = await parseMarkdown();
  cache.set('links', links, { ttl: 3600 }); // 1時間キャッシュ
}
```

**3. バリデーション強化**:
```typescript
// URLの有効性チェック
function validateLink(href: string): boolean {
  try {
    new URL(href, 'https://example.com');
    return true;
  } catch {
    return false;
  }
}
```

**4. 複数ファイル対応**:
```typescript
// 設定ファイルによる柔軟なファイル指定
export async function getLinks(configPath?: string) {
  const config = configPath ? loadConfig(configPath) : defaultConfig;
  // ...
}
```

**5. 国際化対応**:
```typescript
// 言語別のMarkdownファイル対応
export async function getLinks(locale: string = 'ja') {
  const filePath = path.join(process.cwd(), 'data', 'links', `links.${locale}.md`);
  // ...
}
```

## 関連ファイル

- `/data/links/links.md`: 解析対象のMarkdownファイル
- `/types/markdown/markdownData.ts`: LinkSection型定義
- Server Componentsのナビゲーション部分