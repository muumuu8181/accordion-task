# 階層的タスク管理アプリ

アコーディオン式の4階層タスク管理Webアプリケーション

## 機能

- ✅ 4階層までのタスク細分化
- ✅ 2次元重要度システム (S/A/B/C × S/A/B/C)
- ✅ 期限設定
- ✅ タスク編集（名前・重要度・期限）
- ✅ 重要度フィルター
- ✅ すべて展開/閉じる
- ✅ LocalStorage自動保存
- ✅ GitHub Gistへのエクスポート
- ✅ Selenium自動テスト

## 使い方

### 1. サーバー起動

**Windowsの場合:**
```bash
start.bat
```

**その他の場合:**
```bash
node server.cjs
```

自動的にブラウザが開きます（または手動で `http://localhost:3000` にアクセス）

**重要:** index.htmlを直接開かないでください。必ずサーバー経由でアクセスしてください。

### 2. タスク管理

- **追加**: テキスト入力 → 重要度選択 → 期限設定（任意） → 「タスク追加」
- **細分化**: タスクにマウスホバー → 「+サブ」ボタン（最大4階層）
- **編集**: 「編集」ボタンで名前・重要度・期限を変更
- **削除**: 「削除」ボタン（子タスクも一括削除）
- **完了**: チェックボックス（子タスクも一括完了）

### 3. GitHub Gistエクスポート

1. サーバーを起動した状態で「GitHubエクスポート」ボタンをクリック
2. 自動的にGistが作成され、URLがクリップボードにコピーされる

※ `gh` CLI認証が必要です: `gh auth login`

## テスト

```bash
pip install selenium
python test_selenium.py
```

## ファイル構成

```
hierarchical-task-manager/
├── index.html          # メインHTML
├── style.css           # スタイル
├── script.js           # フロントエンドロジック
├── server.cjs          # バックエンドサーバー (Gistアップロード API)
├── upload-gist.cjs     # Gistアップロードスクリプト (CLI用)
├── test_selenium.py    # Seleniumテスト
└── README.md           # このファイル
```

## 技術スタック

- **フロントエンド**: Vanilla JavaScript (ES6+)
- **バックエンド**: Node.js (http module)
- **GitHub連携**: gh CLI
- **テスト**: Selenium WebDriver
- **データ永続化**: LocalStorage

## バージョン履歴

- v0.1: 初回リリース
- v0.2: 重要度・期限機能追加
- v0.3: フィルター機能・デフォルト未設定対応
- v0.4: フィルタークリア・編集機能強化
- v0.4.1: 階層フィルターバグ修正
- v0.05: Seleniumテスト追加
- v0.06: GitHub API方式（失敗）
- v0.07: gh CLI経由のGistアップロード実装
- v0.15: バージョン表示追加
- v0.16: サーバー起動スクリプト追加
