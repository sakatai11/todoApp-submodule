# 日付ユーティリティ (dateUtils.ts)

## 1. 概要

- Firebase Timestampオブジェクトの処理と日付フォーマット機能を提供。
- サーバーサイドタイムスタンプ生成における多様な形式のタイムスタンプ処理をサポート。

## 2. 関数

### getTime

#### 概要
- 多様なタイムスタンプ形式を統一的に処理してミリ秒単位の数値として返却。

#### パラメータ
```typescript
timestamp: unknown // 様々な形式のタイムスタンプ
```

#### 戻り値
```typescript
number // ミリ秒単位のタイムスタンプ
```

#### 処理詳細
1. **number型**: そのまま返却
2. **オブジェクト型**: 
   - `toMillis()`メソッドが存在する場合は呼び出し
   - `_seconds`プロパティが存在する場合はFirebase Timestamp形式として処理
3. **文字列・その他**: `parseInt()`で数値変換、失敗時は0を返却

#### 使用例
```typescript
const timestamp1 = getTime(1640995200000); // number型
const timestamp2 = getTime({ toMillis: () => 1640995200000 }); // Firebase Timestamp
const timestamp3 = getTime({ _seconds: 1640995, _nanoseconds: 200000000 }); // Firebase Timestamp内部形式
```

### jstFormattedDate

#### 概要
- タイムスタンプを日本語形式の日付文字列に変換。

#### パラメータ
```typescript
timestamp: number // ミリ秒単位のタイムスタンプ
```

#### 戻り値
```typescript
string // "YYYY年MM月DD日" 形式の文字列
```

#### 処理詳細
1. タイムスタンプをDateオブジェクトに変換
2. 年、月、日を抽出
3. 月・日は2桁ゼロパディング
4. 日本語形式でフォーマット

#### 使用例
```typescript
const formatted = jstFormattedDate(1640995200000);
// "2022年01月01日"
```

## 3. 特徴

### 多様なタイムスタンプ形式対応
- Firebase Timestampオブジェクト（`toMillis()`メソッド）
- Firebase Timestamp内部形式（`_seconds`、`_nanoseconds`プロパティ）
- number型タイムスタンプ
- 文字列タイムスタンプ

### 日本語フォーマット
- 日本のユーザーに適した表示形式
- 年月日の明確な区切り

## 4. 使用場面

- サーバーサイドから取得したFirebase Timestampの処理
- Todo項目のソート処理でのタイムスタンプ正規化
- UI での日付表示
- 様々なタイムスタンプ形式の統一的な処理