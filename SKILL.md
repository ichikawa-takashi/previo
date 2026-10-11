---
name: site-redesign
description: 既存サイトのコンテンツを使い、ユーザーが送った参考サイト（複数可）のデザイン・アニメーションに完全に合わせて Tailwind CSS でトップページを作り替える。参考サイトURLと「作り変えたい」「この雰囲気で」などの依頼、「どんな参考サイトがいいか提案して」という依頼、old フォルダの既存サイト、カラー指定があるときに使う。写真のAI生成プロンプト作成、WebP変換、営業メール作成までの一連の流れも含む。
---

# 参考サイトに基づくサイトリニューアル

既存サイト（通常 `old/` フォルダ）の**文章だけ**を使い、ユーザーが送った参考サイトのレイアウト・動き・世界観に**完全に合わせて**作り直す。

## 0. 最初に確認すること

- `old/` の中身（HTML・スクリーンショット）。**テキストだけ抽出し、デザインは一切参考にしない**。
- 参考サイトのURL（複数なら「融合」）。**指定がなければ、制作に入る前に「1. 参考サイトの提案」を行う。**
- カラー指定（なければ質問する）。
- 写真の有無（なければグレーのダミー画像）。
- 出力先（指定がなければプロジェクト直下の `index.html`）。

## 1. 参考サイトの提案（参考サイト未指定時、または依頼時）

参考サイトが決まっていない場合は、**いきなり作らず、まず方向性と参考サイトを提案してユーザーに選んでもらう**。選ばれるまで制作に入らない。

### 手順

1. **旧サイトのコンテンツを分析**（デザインは見ない）
   業種、サービス内容、ターゲット（個人／法人、年齢層、価格帯）、一番伝えたい価値（信頼・実績・共感・楽しさなど）を整理する。
2. **サイトのトーンを診断**し、下の表の形式で示す。各軸で「どちら寄りか」と、その根拠（コンテンツのどこからそう判断したか）を書く。
3. **方向性を2〜3案**提案する（例：A 高級感・静けさ／B 信頼感・誠実／C 親しみ・カジュアル）。
4. **おすすめを1つ**、理由とともに示し、ユーザーに選んでもらう。カラー指定がある場合は、方向性と合っているかも一言添える。

### トーン診断の軸

| 軸 | 左 | 右 |
|---|---|---|
| 格・価格帯 | 高級感・上質 | 手頃・親しみやすい |
| 雰囲気 | 洗練・静か | カジュアル ／ ポップ・元気 |
| 年齢層 | 大人向け | 若年層向け |
| 対象 | 個人向け（BtoC） | 法人向け（BtoB） |
| 訴求の軸 | 信頼・実績・堅実さ | 共感・世界観・ブランド |

### 各案に書く内容

- **トーンのキーワード**（例：高級感／大人向け／個人向け／静けさ）
- **デザインの特徴**：書体（明朝・欧文セリフ・ゴシック・丸ゴシックなど）、余白の量、写真の使い方、色の傾向、動き（ゆっくり・控えめ／軽快・遊び心）
- **参考サイトの候補 2〜3件**：URL、業種、どこを参考にするか（KV・見出し・動きなど）
- **このクライアントに合う理由と、注意点**（例：高級感が出る反面、敷居が高く見える）

### 参考サイト候補の探し方（URLは必ず実在確認）

- WebSearch でデザインギャラリーを使って探す：SANKOU!（sankoudesign.com）、MUUUUU.ORG、I/O 3000、81-web.com、Awwwards など。トーン（高級・シンプル・ポップ等）や業種で絞り込める。
- **記憶だけでURLを書かない**。候補は WebFetch または curl で実際に開けることを確認してから提示する。リニューアルで雰囲気が変わっていないかも、トップページの内容で確認する。
- 同業種に限らず、**同じトーンの他業種**（例：転職サービスに高級ホテルや海外ブランドのサイト）も積極的に候補に入れる。今回の MarkGate では、強羅花壇 富士（高級旅館）と DAC（業務用食器の輸入商社）の組み合わせで高級感・大人向けを表現した。

### 出力例（形式）

```
■ サイトの分析
・業種：〇〇　・ターゲット：〇〇　・伝えたい価値：〇〇

■ トーン診断
| 軸 | 判定 | 根拠 |
（上の5軸）

■ 方向性A：高級感・静けさ（おすすめ）
・キーワード：…
・デザインの特徴：…
・参考サイト：
  1. https://… （〇〇業）KVとスクロール演出を参考
  2. https://… （〇〇業）見出しの組み方を参考
・合う理由／注意点：…

■ 方向性B：…
■ 方向性C：…

どの方向性で進めるか（または組み合わせ）を選んでください。
```

## 2. 守るルール（ユーザーの指示）

1. **元サイトのデザインは参照しない**。使うのはコンテンツ（文章）だけ。
2. **勝手な判断でタイトル・テキスト・装飾を変えない／足さない**。
   参考サイトから判断できないパーツは、作ったうえで「判断できなかった部分」として**必ず報告**する。
3. 参考サイトの値（フォント・サイズ・余白・イージング・秒数）は**推測せず、実際のCSS/JSから取得**して合わせる。
4. スクロール連動の動きがある場合は、JSを読んで**同じ値で再現**する（下記「4. 解析」）。
5. カラーは指定トークンだけを使う。アクセント色（金・真鍮など）の用途指定がある場合は守る。
6. グローバルの CLAUDE.md のレイアウト規約（margin/padding は原則 top・left、セクションの余白は外側の要素）に従う。

## 3. 「AIっぽいデザイン」を避ける（重要）

ユーザーから実際に指摘された、AIが出しがちなパターン。参考サイトにない限り**使わない**。

- 字間を広げた**小さな英字ラベル**（例：「01 ABOUT」「VISION」「MISSION」）と、横に添えた**金色の短い線**
- **小さな金色の番号**（例：「( 01 )」）。番号を入れるなら、見出しと同じ大きさの欧文数字にするなど、参考サイトの見出しの扱いに合わせる
- 見出しの背後に**薄く大きく敷いた番号**（01, 02…）
- 画面の端に**縦書きで置いた英字**（ABOUT US など）
- 紺・黒背景に、中央から**ぼんやり広がる金色の光**（ラジアルグラデーション）
- **金のグラデーションボタン＋枠線だけのボタン**を左右に並べる構成
- 写真の後ろに**ずらして重ねた金色の細枠**
- タイムラインの**金線＋ひし形の点**
- 全セクションが**中央揃えの左右対称**で、画面ごとの強弱がない構成
- 本文の一部だけの太字強調

迷ったら「参考サイトのどのパーツに基づくか」を説明できるかで判断する。説明できない装飾は入れない。

## 4. 参考サイトの解析手順

作業用ファイルはスクラッチパッドに置く。

```bash
UA="Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/128 Safari/537.36"
curl -sL -A "$UA" <URL> -o ref.html
grep -oE '(href|src)="[^"]+\.(css|js)[^"]*"' ref.html   # CSS/JSを特定して取得
```

1. **HTML構造**：script/style/svg を除去し、主要タグごとに改行してセクション構成を把握する。Tailwind 製のサイトはクラス名から値が直接読める。
2. **CSS**：`:root` の変数、`font-family`、`@font-face`、見出し・ボタン・リンク・ニュース等のコンポーネントのルールを抽出する。`@media` ごとの値も控える。
3. **JS**：アニメーションの実装を探す（`ScrollTrigger`、`scrub`、`clipPath`、`stagger`、`yPercent` などで検索）。
   - 例：強羅花壇（gorakadan.com/fuji）は GSAP + ScrollTrigger で、KVカードの背景を `clipPath: inset(0 20%)` → 全幅（scrub 2）、画像枠を `inset(0 10%)`、画像を `yPercent -40→40, scale 1.8` のパララックスにしている。
   - 時間ベース（クラス付与）で済ませず、**スクロール連動なら ScrollTrigger で同値再現**する。
4. マスク画像など**参考サイトの素材（画像・フォントファイル）は流用しない**。CSSで近似し、その旨を報告する。
5. ライセンス上使えないフォント（Trial 版など）は、もう一方の参考サイトの書体や Google Fonts で代替し、報告する。

## 5. 実装

- 構成：`index.html`（Tailwind Play CDN）＋ `assets/css/style.css`（アニメーション等）＋ `assets/js/main.js`
- `tailwind.config` にカラートークンとフォントを登録する。CSS変数（`--color-xxx`）も `:root` に定義する。
- ライブラリは CDN：Swiper（jsdelivr）、Lenis（jsdelivr）、GSAP + ScrollTrigger（cdnjs）。
- Lenis と ScrollTrigger の連携：
  ```js
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- 背景を `position: fixed` にする場合、セクション間の margin から透けるため、以降のセクションを不透明なラッパーで包む。
- **ダミー画像**：グレー背景の div に `PHOTO 01 / 比率` のように番号と比率を入れる。

## 6. 検証（必ず撮影して確認）

- ヘッドレス Chrome：`--headless=new --screenshot --window-size=W,H --virtual-time-budget=...`
- **Mac のヘッドレス Chrome はウィンドウ幅の最小値が 500px**。スマホ確認は 390px 幅の iframe に入れて撮影する。
- 最終状態の確認は、テスト用コピーに `*{transition:none!important}` とローディングのスキップを入れて撮影する。
- KV が `h-svh` の場合、縦長ウィンドウでは KV が巨大化するので、テスト用コピーで高さを固定する。
- **スクロール連動の確認**は virtual time では動かないため、CDP で実時間スクロールして撮影する（Node 22 は WebSocket 標準搭載）：

```js
// cdp.mjs  使い方: node cdp.mjs <url> <出力名> <幅> <高さ> <scrollY...>
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [,, url, out, w, h, ...ys] = process.argv;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--hide-scrollbars','--remote-debugging-port=9333',
   `--window-size=${w},${h}`,'--user-data-dir=/private/tmp/cdp-profile','about:blank'],{stdio:'ignore'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let t; for (let i=0;i<50;i++){ try{ t = await (await fetch('http://127.0.0.1:9333/json')).json(); if (t.length) break; }catch{} await sleep(200); }
const ws = new WebSocket(t.find(x => x.type==='page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const p = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m.result); p.delete(m.id); } };
const send = (method, params={}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id:i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width:+w, height:+h, deviceScaleFactor:1, mobile:+w<600 });
await send('Page.navigate', { url }); await sleep(5000);
await send('Runtime.evaluate', { expression: "document.getElementById('loading')?.click()" }); await sleep(2500);
for (const y of ys) {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0,${y})` }); await sleep(3500);
  const r = await send('Page.captureScreenshot', { format:'png' });
  writeFileSync(`${out}_${y}.png`, Buffer.from(r.data, 'base64'));
}
ws.close(); chrome.kill();
```

## 7. 報告内容（完成時）

1. セクションごとの参照元（どのサイトのどのパーツか）を表で。
2. **2サイトから判断できず自分で決めた部分**を番号付きで列挙（ロゴ、本文書体、追加したラベル等）。
3. **撮影してほしい写真の一覧**：番号・位置・比率・内容の提案を表で。

## 8. 写真まわり

- **AI生成プロンプト**を頼まれたら、画像ごとに**1つずつのコードブロック**で、英語の指示文＋推奨サイズ（px）・比率を書く。全画像でトーン（カラー・質感・"No text, no logos"）を揃える。
- 画像を受け取ったら、**中身を見て**番号に割り当て、**英語のファイル名**にリネーム（例：`kv-bg`、`about-01`、`flow-02`）。足りない番号を報告する。
- WebP 変換：`cwebp -q 82 -m 6 in.png -o out.webp`。元PNGは削除せずプロジェクト直下の `_original_png/` に退避し、公開時は除外するよう伝える。

## 9. 営業メール（依頼されたら）

お問い合わせフォームから送る前提でプレーンテキスト。構成：

1. 挨拶・名乗り（個人事業主：「I.T.の市川と申します。個人でWebサイトの制作を行っております。」）
2. 改善案を作成した旨とデモサイトURL
3. 現在のサイトが「AIっぽい」と感じられる具体的な点（`old/` のスクリーンショットで**実際に確認できた特徴だけ**を挙げる。上記3の一覧が参考）
4. 改善案の方針（参考サイトの社名は出さず「国内の高級ホテル」等とぼかす）
5. 改善案もAI制作で、指示の出し方次第でここまで変わること
6. 写真はAI生成の仮画像で、実際の写真に差し替えればさらにAIっぽさが消えること
7. 他のページも同じ世界観で作り替え可能なこと
8. 連絡のお願い（オンライン15分の説明の提案）
9. 署名：

```
――――――――――
I.T.
代表　市川
事例一覧：https://canva.link/q4dj8m6ta9zfu84
TEL：090-1718-3196
Mail：info@ichi-web-home.com
――――――――――
```
