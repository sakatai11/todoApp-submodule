# NavigationContents

## 1. 概要

- ヘッダーのナビゲーションドロップダウンメニューコンポーネント。
- ユーザー情報表示とサインアウト機能を提供。

## 2. Props

```typescript
interface NavigationContentsProps {
  user: UserData; // ユーザー情報
  initial: string; // ユーザーアイコン用イニシャル
  modalIsOpen: boolean; // モーダル表示状態
  setModalIsOpen: (open: boolean) => void; // モーダル状態更新
  onCloseNav: () => void; // ナビゲーション閉じるコールバック
}
```

## 3. 主要機能

### ユーザー情報表示
- ユーザーアイコン（イニシャル）
- メールアドレス表示（改行対応）

### サインアウト機能
- サインアウトボタン
- 確認モーダルの表示制御
- 実際のサインアウト処理

## 4. デザイン・レイアウト

### Material-UI Box Container
- 絶対位置（absolute）で右上に配置
- 薄青背景（#a5d7ff）
- 角丸とシャドウ効果
- z-index: 20で前面表示

### レスポンシブ対応
- flexDirection: column で縦並び
- alignItems: center で中央寄せ
- wordBreak: break-word でメール改行

## 5. 子コンポーネント

### IconContents
- ユーザーアイコンの再表示（メニュー内）

### SignOutModal
- サインアウト確認モーダル
- 実行時の処理：`authSignOut()` → モーダル閉じる → ナビゲーション閉じる

## 6. イベント処理

### サインアウト処理
1. モーダル表示トリガー
2. ユーザー確認
3. `authSignOut()`実行
4. モーダル状態リセット
5. ナビゲーション閉じる

## 7. パフォーマンス最適化

- `React.memo`での再レンダリング最適化
- 不要な再計算を回避

## 8. 依存関係

- Material-UI（Box, Typography, Button）
- カスタム認証関数（`authSignOut`）
- 型定義（`NavigationContentsProps`）