# koe — 声で予定を管理するWebアプリ

## 概要
音声入力 → Gemini AIで解析 → Googleカレンダーに登録・変更・削除できるシングルページアプリ。
HTML/CSS/JS のみ（フレームワーク不使用）。サーバーサイド不要。

## ファイル構成
```
koe-calendar/
├── index.html    # アプリ本体（全コード）
├── vercel.json   # Vercel静的サイト配信設定
└── CLAUDE.md     # このファイル
```

## 使用技術
| 役割 | 技術 |
|------|------|
| 音声認識 | Web Speech API（ブラウザ標準） |
| AI解析 | Google Gemini 2.5 Flash API |
| カレンダー連携 | Google Calendar API v3 |
| 認証 | Google Identity Services (GIS) OAuth2 |
| 永続化 | localStorage（端末内のみ） |

## ローカル起動
```bash
cd ~/koe-calendar
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

## APIキー・認証情報
localStorageキー（プレフィックス `koe_`）：
- `koe_gemini_key` — Gemini API キー（Google AI Studio で取得）
- `koe_client_id`  — Google OAuth Client ID
- `koe_autoParse`  — 自動解析ON/OFF

初期値は index.html の `setDefaults()` 関数に埋め込み済み。
設定画面（右上「設定」）からも変更可能。

## Vercelデプロイ手順
```bash
cd ~/koe-calendar
npx vercel --prod
# または GitHub連携でkoe-calendarリポジトリをVercelにインポート
```

## Google Cloud Console 設定
1. [console.cloud.google.com](https://console.cloud.google.com) → プロジェクト選択
2. 「APIとサービス」→「認証情報」→ OAuthクライアントID を開く
3. 「承認済みのJavaScriptオリジン」に以下を追加：
   - ローカル: `http://localhost:8080`
   - Vercel: `https://koe-calendar.vercel.app`（デプロイ後の実際のURLに合わせる）
4. 保存後、反映まで数分かかる場合あり

## Google OAuthテストユーザー追加
1. 「APIとサービス」→「OAuth同意画面」
2. 「テストユーザー」セクションに使用者のGmailアドレスを追加
3. 審査不要・最大100人まで

## 動作確認ポイント
- Safari（iOS）/ Chrome（Android）で音声入力が動作する
- Firefox は Web Speech API 非対応のため音声入力不可
- トークン有効期限55分 → 期限前に自動リフレッシュ（`ensureToken(true)`）
- 候補イベントが複数のとき → `candidateArea` でリスト選択UI表示
- モード切替時に transcript・parseCard がクリアされる

## 主要関数マップ
| 関数 | 役割 |
|------|------|
| `setMode(m)` | add/edit/delete モード切替 |
| `toggleRec()` | マイク録音開始/停止 |
| `runParse()` | Gemini APIでテキスト解析 |
| `applyParsed(d)` | 解析結果をUIに反映 |
| `execAction()` | カレンダーへ追加/変更/削除 |
| `ensureToken(force)` | OAuthトークン確保（自動更新含む） |
| `fetchEvents()` | Googleカレンダーから予定取得 |
| `renderCalendar()` | 月カレンダー描画 |
| `openDetailFromEvent(id)` | 詳細ボトムシート表示 |
