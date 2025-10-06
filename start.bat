@echo off
echo ========================================
echo   階層的タスク管理アプリ サーバー起動
echo ========================================
echo.
echo サーバーを起動します...
echo ブラウザで http://localhost:3000 にアクセスしてください
echo.
echo 終了するには Ctrl+C を押してください
echo.
start http://localhost:3000
node server.cjs
