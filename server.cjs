#!/usr/bin/env node

/**
 * シンプルなローカルサーバー + Gistアップロード API
 *
 * 起動方法:
 * node server.cjs
 *
 * アクセス:
 * http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // CORS対応
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Gistアップロードエンドポイント
    if (req.method === 'POST' && req.url === '/api/upload-gist') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { markdown } = JSON.parse(body);

                // 一時ファイルに保存
                const tmpFile = path.join(__dirname, 'tasks-tmp.md');
                fs.writeFileSync(tmpFile, markdown, 'utf8');

                // gh gist createでアップロード（private）
                const result = execSync(`gh gist create "${tmpFile}" --secret --desc "タスクリスト - ${new Date().toLocaleString('ja-JP')}"`, {
                    encoding: 'utf8'
                });

                // 一時ファイル削除
                fs.unlinkSync(tmpFile);

                const gistUrl = result.trim();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url: gistUrl }));

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });

        return;
    }

    // 静的ファイル配信
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`✅ サーバー起動: http://localhost:${PORT}`);
    console.log('Ctrl+C で終了');
});
