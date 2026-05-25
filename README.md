# HOMURA Living OS

スマートホームサービスの公式サイトを装った、1ページ完結型のARGサイトです。通常表示、違和感、真相の各状態を同一DOM内に持ち、ユーザー操作に応じて段階的にサイトが改変されます。

## 構成

- `index.html`: サイト本体
- `style.css`: 通常テーマ、真相テーマ、ノイズ演出
- `script.js`: フェーズ管理、ギミック制御、X共有処理
- `truth.html`: 真相ページ（実験記録ページ）
- `data/config.js`: X共有用URLと投稿文
- `images/`: ローカル確認用画像
- `audio/`: HOMURA Speaker用ダミー音源

サイト内の画像参照は、Cloudflare R2の公開開発URL `https://pub-3d61cedd944c41198454cfdf476e04a9.r2.dev/images/` を使用しています。

## 進行ギミック

- 違和感1: 初期状態のプレイリスト空白行を選択すると `Lose Yourself Protocol` が出現
- 違和感2: 初期状態から見られる30秒サンプル映像を、異常秒数付近で停止してクリック
- 違和感3: AI連携先一覧をこすると、不審な団体名が表内に浮かび上がる
- 真相: `truth.html` に遷移し、行動制御実験の記録ページを表示
- 真相到達後: トップページへ戻ると、不穏な改変状態を維持

## デプロイ方法

Cloudflare Pagesなどの静的ホスティングに、このリポジトリのルートをそのまま配置してください。ビルドは不要です。

- Build command: なし
- Output directory: `/`

## shareUrlの変更方法

`data/config.js` の `shareUrl` だけを本番用URLに差し替えてください。

```js
const CONFIG = {
  shareUrl: "本番ツイートURL",
  shareText: "このサイト、ただのスマートホームじゃない気がする。生活を最適化するって書いてあるけど、行動を誘導してるように見える。"
};
```
