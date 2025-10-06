#!/usr/bin/env node

/**
 * GitHub Gistアップロードスクリプト
 *
 * 使い方:
 * node upload-gist.cjs <markdown-content>
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 引数からMarkdownコンテンツを取得
const markdownContent = process.argv[2];

if (!markdownContent) {
    console.error('エラー: Markdownコンテンツが指定されていません');
    process.exit(1);
}

// 一時ファイルに書き込み
const tmpFile = path.join(__dirname, 'tasks-tmp.md');
fs.writeFileSync(tmpFile, markdownContent, 'utf8');

try {
    // gh gist createでアップロード
    const result = execSync(`gh gist create "${tmpFile}" --public --desc "タスクリスト - ${new Date().toLocaleString('ja-JP')}"`, {
        encoding: 'utf8'
    });

    // URLを出力（標準出力に返す）
    const gistUrl = result.trim();
    console.log(gistUrl);

} catch (error) {
    console.error('Gistアップロード失敗:', error.message);
    process.exit(1);
} finally {
    // 一時ファイル削除
    if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
    }
}
