# テキストユーティリティ (textUtils.ts)

## 1. 概要

- テキスト文字列の解析・フォーマット処理を行うユーティリティ。
- URL リンクと改行を含むテキストを構造化データに変換。

## 2. 型定義

### FormatterResult
```typescript
type FormatterResult = {
  type: 'link' | 'linefeed' | 'normal';
  content: string;
  index: string;
}
```

## 3. 関数

### formatter

#### 概要
- テキスト文字列をURL、改行、通常テキストに分類して配列で返す。

#### パラメータ
```typescript
text: string // 解析対象のテキスト
```

#### 戻り値
```typescript
FormatterResult[] // 分類されたテキスト要素の配列
```

#### 処理詳細

1. **URL パターンマッチング**
   - 正規表現: `/(https?:\/\/[^\s]+)/g`
   - HTTP/HTTPS URLを検出

2. **テキスト分割処理**
   - URL で分割してそれぞれ処理
   - URL部分は 'link' タイプとして分類

3. **改行処理**
   - 改行文字（`\n`）で再分割
   - 通常テキストは 'normal' タイプ
   - 改行は 'linefeed' タイプ

4. **インデックス生成**
   - 各要素に一意のインデックスを付与
   - `link-${index}`, `normal-${index}-${subIndex}` 形式

#### 使用例
```typescript
const text = "こんにちは\nhttps://example.com\n世界";
const result = formatter(text);

// 結果:
// [
//   { type: 'normal', content: 'こんにちは', index: 'normal-0-0' },
//   { type: 'linefeed', content: '\n', index: 'space-0-0' },
//   { type: 'link', content: 'https://example.com', index: 'link-1' },
//   { type: 'linefeed', content: '\n', index: 'space-2-0' },
//   { type: 'normal', content: '世界', index: 'normal-2-1' }
// ]
```

## 4. 特徴

### URL 自動検出
- HTTP/HTTPS プロトコルのURLを自動識別
- 空白文字で区切られたURLに対応

### 改行保持
- 元のテキストの改行情報を保持
- レンダリング時の正確な表示が可能

### React キー対応
- 各要素に一意のインデックスを提供
- React レンダリング時のkey propとして使用可能

## 5. 使用場面

- Todo テキストのリッチ表示
- チャット・コメント機能でのURL自動リンク化
- マークダウン的なテキスト処理