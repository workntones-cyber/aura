# AURA
**Audio Understanding & Recording Assistant**

音声を録音し、AIが自動で文字起こし・要約するデスクトップアプリです。

---

## 概要・利用用途

AURAは、会議・打ち合わせ・インタビューなどの音声を録音し、AIが自動で文字起こしと要約を行うツールです。録音後すぐに内容を把握でき、議事録作成の手間を大幅に削減します。

**こんな場面に最適です：**
- 会議室にノートPCを持ち込んで録音 → 自動で議事録を生成
- 1on1・面談の記録
- 講演・セミナーのメモ作成
- ひとりでのアイデアメモ・口述筆記

> **注意：** AURAはPCのマイク入力を録音します。オンライン会議（Zoom・Google Meet等）の相手の音声を録音するには、別途システム音声のキャプチャ設定が必要です。

---

## 動作環境・必要要件

### 共通
| 項目 | 要件 |
|---|---|
| Python | 3.11 以上 |
| パッケージ管理 | [uv](https://docs.astral.sh/uv/) |
| ブラウザ | Chrome / Edge / Safari（最新版推奨） |
| マイク | PC内蔵マイク または 外付けマイク |

### Windows
| 項目 | 要件 |
|---|---|
| OS | Windows 10 / 11 |
| ビジネス用モード（faster-whisper） | GPU VRAM 8GB以上推奨（CPUでも動作可・処理に時間がかかる場合あり） |

### Mac
| 項目 | 要件 |
|---|---|
| OS | macOS 12 以上 |
| 対応チップ | Apple Silicon（M1 / M2 / M3）推奨 |
| ビジネス用モード（faster-whisper） | Apple Silicon Mac のみ対応（Intel Mac は個人用モードのみ） |

---

## AIモード

AURAには2つのAIモードがあります。設定画面から切り替えられます。

### 👤 個人用モード（Groq API）

クラウド上のAIを使って文字起こし・要約を行います。

- **文字起こし：** Groq Whisper（`whisper-large-v3-turbo`）
- **要約：** Groq LLaMA（`llama-3.3-70b-versatile`）
- **必要なもの：** Groq APIキー（無料で取得可能）
- **特徴：** セットアップが簡単・高速・高精度

Groq APIキーの取得：[https://console.groq.com/keys](https://console.groq.com/keys)

### 🏢 ビジネス用モード（faster-whisper）

音声データを外部に送信せず、PC上で完全ローカル処理します。

- **文字起こし：** faster-whisper（`medium` モデル・約1.5GB）
- **要約：** Groq LLaMA（Groq APIキーがあれば使用）
- **必要なもの：** 初回起動時にモデルファイルを自動ダウンロード（約1.5GB）
- **特徴：** 機密情報・社内情報の録音に最適。音声データが外部に出ない

> **対応環境：** Windows（GPU/CPU）、Mac Apple Silicon（CPU）

---

## インストール手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/workntones-cyber/aura
cd aura
```

### 2. 依存パッケージをインストール

```bash
uv sync
```

### 3. 環境変数ファイルを作成

```bash
cp .env.example .env
```

`.env` を開いて Groq APIキーを設定します（個人用モードを使う場合）：

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
AI_MODE=personal
```

### 4. 起動

```bash
uv run python main.py
```

ブラウザで [http://127.0.0.1:5000](http://127.0.0.1:5000) を開いてください。

---

## 使い方

### 基本的な流れ

```
① 設定画面でAIモードとAPIキーを設定
      ↓
② 録音画面でタイトル・概要メモを入力（任意）
      ↓
③ 録音ボタンを押して録音開始
      ↓
④ 録音停止ボタンを押す
      ↓
⑤ 自動で文字起こし → AI要約が実行される
      ↓
⑥ 結果を確認・編集して保存
```

### 長時間録音について

録音は10分ごとに自動でチャンク分割されます。何時間でも録音可能です。
Groq APIの25MBファイルサイズ制限も自動で対応します。

### 過去の録音データ

録音画面下部のプルダウンから過去の録音データを参照できます。
文字起こし・要約の確認、タイトル・メモの編集、削除が可能です。

### データの保存場所

| データ | 保存場所 |
|---|---|
| 録音音声（WAV） | `uploads/` フォルダ |
| 文字起こし・要約 | `app/aura.db`（SQLite） |
| APIキー・設定 | `.env` ファイル |

---

## 配布用ビルド（PyInstaller）

Python環境なしで実行できる単一ファイルにビルドします。

```bash
# パッケージを追加
uv add pyinstaller

# ビルド
uv run pyinstaller aura.spec
```

ビルド完了後、`dist/AURA.exe`（Windows）または `dist/AURA`（Mac）が生成されます。

実行すると自動的にブラウザが開きます。
ブラウザが開かない場合は [http://127.0.0.1:5000](http://127.0.0.1:5000) にアクセスしてください。

> **初回実行時の注意：** ビジネス用モードを使う場合、`dist/` フォルダと同じ場所に `.env` ファイルを作成してAPIキーを設定してください。

---

## 開発者向け情報

### 技術スタック

| 項目 | 採用技術 |
|---|---|
| 言語 / フレームワーク | Python 3.11+ / Flask |
| パッケージ管理 | uv |
| 録音 | sounddevice（16000Hz / モノラル / int16） |
| 個人用AI | Groq API（Whisper + LLaMA） |
| ビジネス用AI | faster-whisper（ローカル） |
| データベース | SQLite |
| パッケージング | PyInstaller |

### ディレクトリ構成

```
aura/
├── main.py                    # Flaskアプリ本体・APIエンドポイント
├── aura.spec                  # PyInstallerビルド設定
├── .env                       # APIキー・設定（gitignore済み）
├── .env.example               # .envのテンプレート
├── pyproject.toml
├── app/
│   ├── database.py            # SQLite操作
│   ├── services/
│   │   ├── recorder.py        # 録音・チャンク分割
│   │   └── transcriber.py     # 文字起こし・要約（Groq / faster-whisper）
│   ├── templates/
│   │   ├── index.html         # 録音画面
│   │   └── settings.html      # 設定画面
│   └── static/
│       ├── css/style.css
│       └── js/
│           ├── recorder.js
│           └── settings.js
└── uploads/                   # 録音WAVファイル（gitignore済み）
```

### 開発環境のセットアップ

```bash
git clone https://github.com/yourusername/aura.git
cd aura
uv sync
cp .env.example .env
uv run python main.py   # debug=True で起動
```

### Windows → Mac の開発フロー

```bash
# Windows で実装
git add .
git commit -m "feat: ..."
git push

# Mac で確認
git pull
uv sync
uv run python main.py
```

### ブランチ運用

| ブランチ | 用途 |
|---|---|
| `main` | 安定版 |
| `feature/*` | 機能追加 |

---

## ライセンス

MIT License
