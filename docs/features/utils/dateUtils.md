# 日付ユーティリティ (dateUtils.ts)

## 1. 概要

- 日本標準時（JST）での日付・時刻処理を行うユーティリティ関数群。
- タイムスタンプ生成と日付フォーマット機能を提供。

## 2. 関数

### jstTime

#### 概要
- 現在の日本標準時（JST）のDateオブジェクトを返す。

#### 戻り値
```typescript
Date // JST調整されたDateオブジェクト
```

#### 処理詳細
1. 現在のUTC時間を取得
2. UTC時間に9時間（日本のタイムゾーン）を加算
3. JST調整されたDateオブジェクトを返却

#### 使用例
```typescript
const jstNow = jstTime();
const timestamp = jstNow.getTime(); // JST タイムスタンプ
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

### タイムゾーン対応
- UTC → JST への適切な変換
- サーバー・クライアント間の時刻統一

### 日本語フォーマット
- 日本のユーザーに適した表示形式
- 年月日の明確な区切り

## 4. 使用場面

- Todo項目の作成日時・更新日時の生成
- UI での日付表示
- データベース保存時のタイムスタンプ生成