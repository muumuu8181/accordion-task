# プロジェクト引継ぎドキュメント

## 📋 プロジェクト概要

**プロジェクト名**: 階層的タスク管理アプリ（Hierarchical Task Manager）
**リポジトリ名**: accordion-task
**現在バージョン**: v0.22
**最終更新日**: 2025年10月7日

## 📍 フルパス情報

### プロジェクトフォルダ
```
C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
```

### 主要ファイル

| ファイル | フルパス | 用途 |
|---------|---------|------|
| **index.html** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\index.html` | メインHTMLファイル - UI構造 |
| **style.css** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\style.css` | スタイルシート - デザイン・階層別色分け |
| **script.js** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\script.js` | フロントエンドロジック（TaskManager/TaskUIクラス） |
| **server.cjs** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\server.cjs` | Node.jsサーバー - Gist API連携 |
| **start.bat** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\start.bat` | Windows起動スクリプト |
| **test_selenium.py** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\test_selenium.py` | Selenium自動テストスイート |
| **README.md** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\README.md` | プロジェクト詳細ドキュメント |
| **AI_PROMPT.md** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\AI_PROMPT.md` | AI協調作業指示書 |
| **package.json** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\package.json` | Node.jsプロジェクト設定 |
| **.gitignore** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\.gitignore` | Git除外設定 |

### Git情報

| 項目 | 詳細 |
|-----|------|
| **Gitフォルダ** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\.git` |
| **リモートリポジトリ** | `https://github.com/muumuu8181/accordion-task.git` |
| **ブランチ** | `master` |
| **最新コミット** | `62977b3 - docs: Add quick handover guide for new members` |

## 🔗 外部リンク

### GitHub関連
- **リポジトリ**: https://github.com/muumuu8181/accordion-task
- **タスクリストGist**: https://gist.github.com/muumuu8181/e90d418b603582a671b2f3865edf4060

### アクセスURL
- **ローカル開発サーバー**: http://localhost:3000

## 🎯 プロジェクトの目的

このアプリケーションは以下の目的で開発されました：

1. **複雑なタスクの階層管理**: 最大4階層までタスクを細分化
2. **詳細な優先度設定**: 2次元重要度システム（S/A/B/C × S/A/B/C = 16段階）
3. **AI協調作業の実現**: 複数のAI（Claude、Gemini等）が同時にタスクを処理
4. **タスクの一意識別**: 6桁ID（#000001～）によるタスク管理
5. **GitHub Gist連携**: タスクリストの自動エクスポート・更新・バージョン管理

## 🚀 起動手順

### 方法1: バッチファイル起動（Windows推奨）

1. エクスプローラーで以下のパスを開く:
   ```
   C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
   ```

2. `start.bat` をダブルクリック

3. ブラウザが自動的に開き、`http://localhost:3000` にアクセス

### 方法2: コマンドライン起動

```bash
# フォルダに移動
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager

# サーバー起動
node server.cjs
```

その後、ブラウザで `http://localhost:3000` を開く

### 方法3: npmスクリプト起動

```bash
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
npm start
```

## 📚 主要機能の使い方

### 1. タスク追加
- 画面上部の入力欄にタスク名を入力
- 重要度1・重要度2を選択（任意）
- 期限を設定（任意）
- 「タスク追加」ボタンをクリック

### 2. タスク細分化（サブタスク作成）
- タスクにマウスホバー → 「+ 細分化」ボタン
- 最大4階層まで細分化可能

### 3. GitHub Gistへのエクスポート
- 「GitHubエクスポート」ボタンをクリック
- 初回: 新規Gist作成（Secret）
- 2回目以降: 既存Gist更新（同じURL）

### 4. フィルター機能
- ドロップダウンで重要度別に絞り込み
- 「クリア」ボタンでフィルター解除

### 5. タスク編集
- タスクにマウスホバー → 「編集」ボタン
- タスク名・重要度・期限を変更可能

## 🤖 AI協調作業の設定

### 前提条件
1. GitHub CLI (`gh`) が認証済み
   ```bash
   gh auth login
   ```

2. Gistにタスクリストがエクスポート済み
   - Gist URL: https://gist.github.com/muumuu8181/e90d418b603582a671b2f3865edf4060

### AIへの指示方法

AIに以下のファイルを提供:
```
C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\AI_PROMPT.md
```

または、以下の指示を直接コピー:

```
このプロジェクトのタスクリストは以下のGistで管理されています：
https://gist.github.com/muumuu8181/e90d418b603582a671b2f3865edf4060

上記GistのタスクリストからタスクID（#000001など）を確認して、
作業を開始してください。作業内容はGistに記録してください。
```

## 🧪 テスト実行

### Seleniumテスト

```bash
# フォルダに移動
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager

# Seleniumインストール（初回のみ）
pip install selenium

# テスト実行
python test_selenium.py
```

または

```bash
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
npm test
```

## 🗂️ データ保存場所

### LocalStorage（ブラウザ内）
- **保存先**: ブラウザのLocalStorage（`http://localhost:3000`）
- **キー**: `hierarchicalTasks`
- **内容**: タスクデータ、タスクIDカウンター
- **永続性**: ブラウザを閉じても保持される

### GitHub Gist
- **URL**: https://gist.github.com/muumuu8181/e90d418b603582a671b2f3865edf4060
- **ファイル名**: `tasks.md`
- **形式**: Markdown
- **更新**: 「GitHubエクスポート」ボタンで手動更新

### Gist ID保存
- **保存先**: LocalStorage
- **キー**: `gistId`
- **値**: `e90d418b603582a671b2f3865edf4060`
- **用途**: 既存Gistの更新に使用

## 🔧 技術スタック

### フロントエンド
- **言語**: JavaScript (ES6+) - Vanilla JS（フレームワーク不使用）
- **スタイル**: CSS3 - Flexbox、アニメーション
- **API**: LocalStorage API、Fetch API

### バックエンド
- **ランタイム**: Node.js v14以降
- **モジュール**: CommonJS（.cjs形式）
- **サーバー**: http module（標準ライブラリ）
- **GitHub連携**: gh CLI

### テスト
- **フレームワーク**: Selenium WebDriver
- **言語**: Python 3.x

## 📊 データ構造

### タスクオブジェクト

```javascript
{
  id: 1,                    // 内部ID（整数、自動採番）
  taskId: "000001",         // 表示用6桁ID（文字列、通し番号）
  text: "タスク名",         // タスクの説明
  completed: false,         // 完了状態（boolean）
  level: 1,                 // 階層レベル（1～4）
  parentId: null,           // 親タスクのID（nullの場合はルート）
  children: [],             // 子タスクの配列
  expanded: true,           // 展開状態（boolean）
  priority1: "S",           // 重要度1（S/A/B/C/null）
  priority2: "A",           // 重要度2（S/A/B/C/null）
  deadline: "2025-10-15"    // 期限（YYYY-MM-DD形式/null）
}
```

### LocalStorageの構造

```javascript
{
  tasks: [...],              // タスク配列
  taskIdCounter: 4,          // 内部IDカウンター
  displayIdCounter: 4        // 表示用IDカウンター
}
```

## 🔍 重要な実装ポイント

### 1. タスクID自動マイグレーション

既存タスクにIDが無い場合、自動的に割り当てる機能:

**実装場所**: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\script.js` (183-204行目)

```javascript
migrateTaskIds() {
    let needsSave = false;

    const assignIds = (tasks) => {
        tasks.forEach(task => {
            if (!task.taskId) {
                task.taskId = String(this.displayIdCounter++).padStart(6, '0');
                needsSave = true;
            }
            if (task.children && task.children.length > 0) {
                assignIds(task.children);
            }
        });
    };

    assignIds(this.tasks);

    if (needsSave) {
        this.saveToLocalStorage();
        console.log('既存タスクにIDを自動割り当てしました');
    }
}
```

### 2. 階層フィルター（再帰的実装）

親タスクと子タスクの両方をチェックするフィルター機能:

**実装場所**: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\script.js` (592-650行目)

- 子タスクがマッチする場合、親タスクも表示
- `:scope >` セレクタで直接の子要素のみを検索
- 再帰的に全階層をチェック

### 3. Gist更新メカニズム

JSONペイロードファイルを使用して改行を保持:

**実装場所**: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\server.cjs` (44-69行目)

```javascript
const payload = {
    files: {
        'tasks.md': {
            content: markdown
        }
    }
};

const payloadFile = path.join(__dirname, 'gist-payload.json');
fs.writeFileSync(payloadFile, JSON.stringify(payload), 'utf8');
execSync(`gh api gists/${gistId} -X PATCH --input "${payloadFile}"`, { encoding: 'utf8' });
```

## 📝 開発履歴

### v0.22（最新）
- タスクID機能実装（6桁通し番号）
- 既存タスクへの自動マイグレーション
- AI協調作業に対応

### v0.20
- Gist更新時の改行エスケープ問題を修正
- JSONペイロード方式に変更

### v0.19
- Gist作成をSecret（非公開）に変更

### v0.18
- Gist更新機能実装（同じGistを上書き）

### v0.4.1
- 階層フィルターバグ修正（子タスクも表示）

### v0.1
- 初回リリース

## ⚠️ 注意事項

### 1. CORS制約
- `index.html` を直接開かない（`file://` プロトコルは不可）
- 必ず `node server.cjs` でサーバー経由アクセス

### 2. GitHub CLI認証
- Gist機能を使用する前に `gh auth login` が必須
- 認証エラーが出る場合: `gh auth status` で確認

### 3. ポート競合
- デフォルトポート: 3000
- 変更方法: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\server.cjs` の `PORT` 変数を編集

### 4. データバックアップ
- LocalStorageは手動バックアップ不可
- GitHub Gistエクスポートを定期的に実行推奨
- Gistの履歴機能で過去バージョンを参照可能

### 5. 一時ファイル
以下のファイルは自動生成・削除される（`.gitignore`で除外済み）:
- `tasks.md` - Gistアップロード用一時ファイル
- `gist-payload.json` - GitHub API送信用ペイロード

## 🛠️ トラブルシューティング

### "FAILED TO FETCH" エラー

**原因**: `file://` プロトコルで開いている

**解決方法**:
```bash
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
node server.cjs
```
その後 `http://localhost:3000` にアクセス

### GitHub Gistエクスポート失敗

**原因**: GitHub CLI未認証

**解決方法**:
```bash
gh auth login
```

### サーバー起動失敗

**原因**: ポート3000が使用中

**解決方法**:
1. 既存プロセスを終了
2. または `server.cjs` の18行目 `const PORT = 3000;` を変更

### タスクが消えた

**原因**: LocalStorageクリア、ブラウザ変更、URLの違い

**解決方法**:
1. 同じURL (`http://localhost:3000`) で開く
2. GitHub Gistから復元（手動でタスクを再入力）

## 📞 サポート情報

### ドキュメント参照

| ドキュメント | パス | 用途 |
|------------|------|------|
| **README.md** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\README.md` | 包括的な使用方法 |
| **AI_PROMPT.md** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\AI_PROMPT.md` | AI作業指示 |
| **HANDOVER.md** | `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\HANDOVER.md` | このファイル |

### リポジトリ情報

- **Issues**: https://github.com/muumuu8181/accordion-task/issues
- **Pulls**: https://github.com/muumuu8181/accordion-task/pulls

### コミットログ確認

```bash
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager
git log --oneline
```

## 🔐 セキュリティ

### 認証情報
- GitHub CLI認証は `gh` コマンドで管理
- 認証トークンはローカルに安全に保存
- Gistは「Secret」（非公開）として作成

### データプライバシー
- タスクデータはローカル（LocalStorage）に保存
- Gistは非公開設定（URLを知る人のみアクセス可能）
- サーバーはローカルホストのみリッスン（外部アクセス不可）

## 📦 依存関係

### 実行時依存
- **Node.js**: v14.0.0以降
- **GitHub CLI (gh)**: Gist機能使用時に必要
- **Python 3.x**: テスト実行時に必要
- **Selenium**: テスト実行時に必要

### インストールコマンド

```bash
# Node.js（公式サイトからインストール）
# https://nodejs.org/

# GitHub CLI（公式サイトからインストール）
# https://cli.github.com/

# Python（公式サイトからインストール）
# https://www.python.org/

# Selenium
pip install selenium
```

## 🎓 学習リソース

### コードベースの理解

1. **基本構造の理解**:
   - `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\index.html` - DOM構造を確認
   - `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\style.css` - スタイルと色分けを確認

2. **ロジックの理解**:
   - `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\script.js` - TaskManagerクラス（2-205行目）
   - `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\script.js` - TaskUIクラス（208-651行目）

3. **API連携の理解**:
   - `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\server.cjs` - Gist APIエンドポイント（33-98行目）

### 推奨学習順序

1. README.mdで全体像を把握
2. index.htmlでUI構造を理解
3. script.jsでデータ構造とロジックを理解
4. server.cjsでAPI連携を理解
5. test_selenium.pyでテストケースを理解

## 🔄 更新・メンテナンス

### Gitワークフロー

```bash
# フォルダに移動
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager

# 最新の状態を取得
git pull origin master

# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "feat: 新機能の説明"

# プッシュ
git push origin master
```

### バージョン番号の更新

1. `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\package.json` の `version` を更新
2. `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\index.html` の14行目 `<span class="version">v0.22</span>` を更新
3. `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\README.md` のバージョン履歴に追記

### リリース手順

```bash
cd C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager

# タグ作成
git tag v0.23

# タグをプッシュ
git push origin v0.23
```

## 📋 引き継ぎチェックリスト

### 新規担当者が確認すべきこと

- [ ] プロジェクトフォルダにアクセスできる: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager`
- [ ] Node.jsがインストールされている（v14以降）
- [ ] GitHub CLIがインストール・認証されている
- [ ] サーバーが起動できる（`node server.cjs`）
- [ ] ブラウザで `http://localhost:3000` にアクセスできる
- [ ] タスクの追加・編集・削除ができる
- [ ] GitHub Gistエクスポートが成功する
- [ ] Seleniumテストが実行できる（`python test_selenium.py`）
- [ ] GitHubリポジトリにアクセスできる
- [ ] Gistにアクセスできる
- [ ] README.mdを読んで全機能を理解した
- [ ] AI_PROMPT.mdを読んでAI協調作業を理解した
- [ ] コードベース（script.js）の主要クラスを理解した

### 質問がある場合

1. まず `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\README.md` を確認
2. コミットログを確認: `git log --oneline --graph`
3. GitHubのIssuesで検索・質問

## 🎉 次のステップ

引き継ぎ後の推奨アクション:

1. **動作確認**: サーバーを起動してすべての機能を試す
2. **テスト実行**: Seleniumテストを実行して環境を確認
3. **Gist確認**: GitHub Gistにアクセスして現在のタスクリストを確認
4. **コード理解**: script.jsを読んでロジックを理解
5. **AI連携テスト**: AI_PROMPT.mdを使ってAI協調作業を試す

---

**最終更新**: 2025年10月7日
**作成者**: Claude (AI)
**バージョン**: v0.22
**ドキュメントパス**: `C:\Users\user\Desktop\work\90_cc\20251006\hierarchical-task-manager\handover\HANDOVER.md`

## 📌 CLAUDE.mdについて

このプロジェクトのルートディレクトリ (`C:\Users\user\CLAUDE.md`) にAI作業用の設定ファイルがありますが、**第三者（人間の開発者）は読む必要ありません**。

- **用途**: AI（Claude等）が作業する際の内部ルール
- **内容**: hooks設定、ファイル配置ルール、ツール使用ログ記録等
- **対象**: AIのみ
- **第三者**: 読まなくてOK（プロジェクト作業には不要）

人間の開発者は、このHANDOVER.mdとREADME.mdを読めば十分です。
