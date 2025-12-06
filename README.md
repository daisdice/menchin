# CHIN'IT - Menchin Wait Guessing Game

Antigravityによって作成された、麻雀の清一色（チンイツ）の多面待ちを当てるクイズゲームです。
ランダムに生成される清一色の手牌から、待ち牌を素早く正確に回答して、雀力を向上させましょう！

## ゲームマニュアル

### 遊び方

1. 画面に表示される清一色の手牌を見て、待ち牌（アガリ牌）をすべて特定します。
2. 画面下部の数字ボタン（1〜9）から、待ち牌に該当するものをすべて選択します。
3. すべての待ち牌を選択したら、「ANSWER」ボタンを押して回答します。

### ゲームモード

*   **CHALLENGE (チャレンジ)**: 全10問。正解数と回答速度でスコアを競います。ライフ制で、間違えるとライフが減ります。
*   **SURVIVAL (サバイバル)**: 制限時間内にどれだけ多くの問題を解けるかに挑戦します。正解すると時間が延長されます。
*   **SPRINT (スプリント)**: 全10問をどれだけ速く解き終えるかを競うタイムアタックモードです。
*   **PRACTICE (プラクティス)**: 制限時間やライフを気にせず、自分のペースで練習できるモードです。

### 操作方法

*   **数字タイル**: タップして待ち牌を選択/解除します。
*   **ANSWER**: 回答を確定します。
*   **Quit (🏳️)**: ゲームを中断してタイトルに戻ります。

---

## 技術スタック (Technical Details)

このプロジェクトは以下の技術を使用して構築されています。

### Core
*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)

### State Management & Routing
*   [Zustand](https://github.com/pmndrs/zustand) - シンプルで軽量なステート管理
*   [React Router](https://reactrouter.com/) - ルーティング

### UI & Styling
*   [Framer Motion](https://www.framer.com/motion/) - アニメーション
*   [CSS Modules](https://github.com/css-modules/css-modules) - スタイリング
*   CSS Variables - テーマ管理（ダークモード対応など）

### PWA (Progressive Web App)
*   [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - オフライン動作とインストール対応

### Deployment
*   GitHub Pages - 自動デプロイ (GitHub Actions)

## 開発環境 (Development)

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### リンター

```bash
npm run lint
```
