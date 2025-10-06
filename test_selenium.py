"""
アコーディオンタスク管理アプリ - Selenium動作確認テスト

実行方法:
1. pip install selenium
2. ChromeDriverをインストール（または自動ダウンロード）
3. python test_selenium.py

動作確認項目:
- タスク追加
- 重要度設定
- サブタスク追加
- フィルター機能
- 編集機能
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
import os

def test_accordion_task_app():
    # index.htmlへのパス
    current_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = f"file:///{current_dir}/index.html".replace("\\", "/")

    print(f"テスト開始: {html_path}")

    # Chromeドライバーを起動
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')  # ヘッドレスモードで実行する場合
    driver = webdriver.Chrome(options=options)

    try:
        # ページを開く
        driver.get(html_path)
        print("✓ ページ読み込み完了")
        time.sleep(1)

        # LocalStorageをクリア
        driver.execute_script("localStorage.clear();")
        driver.refresh()
        time.sleep(1)
        print("✓ LocalStorageクリア完了")

        # テスト1: タスク追加
        print("\n【テスト1】タスク追加")
        task_input = driver.find_element(By.ID, "newTaskInput")
        task_input.send_keys("メインタスク1")

        # 重要度設定
        priority1 = Select(driver.find_element(By.ID, "newTaskPriority1"))
        priority1.select_by_value("S")
        priority2 = Select(driver.find_element(By.ID, "newTaskPriority2"))
        priority2.select_by_value("A")

        add_btn = driver.find_element(By.ID, "addTaskBtn")
        add_btn.click()
        time.sleep(0.5)

        tasks = driver.find_elements(By.CLASS_NAME, "task-item")
        assert len(tasks) == 1, "タスクが追加されていません"
        print(f"✓ タスク追加成功（重要度: SA）")

        # テスト2: サブタスク追加
        print("\n【テスト2】サブタスク追加")
        add_subtask_btn = driver.find_element(By.CLASS_NAME, "btn-add")
        add_subtask_btn.click()
        time.sleep(0.5)

        subtask_input = driver.find_element(By.CLASS_NAME, "subtask-input")
        subtask_input.send_keys("サブタスク1")

        # サブタスクの重要度設定
        subtask_priority1 = Select(driver.find_element(By.CLASS_NAME, "subtask-priority1"))
        subtask_priority1.select_by_value("B")
        subtask_priority2 = Select(driver.find_element(By.CLASS_NAME, "subtask-priority2"))
        subtask_priority2.select_by_value("C")

        confirm_btn = driver.find_element(By.CSS_SELECTOR, ".add-subtask-form .btn-confirm")
        confirm_btn.click()
        time.sleep(0.5)

        all_tasks = driver.find_elements(By.CLASS_NAME, "task-item")
        assert len(all_tasks) == 2, "サブタスクが追加されていません"
        print("✓ サブタスク追加成功（重要度: BC）")

        # テスト3: フィルター機能（Bで絞り込み）
        print("\n【テスト3】フィルター機能")
        filter_select = Select(driver.find_element(By.ID, "priorityFilter"))
        filter_select.select_by_value("B")
        time.sleep(0.5)

        visible_tasks = driver.execute_script("""
            return Array.from(document.querySelectorAll('.task-item'))
                .filter(el => el.style.display !== 'none').length;
        """)
        assert visible_tasks == 2, f"フィルター後のタスク数が不正: {visible_tasks}"
        print("✓ フィルター機能正常（Bで絞り込み→親子両方表示）")

        # フィルタークリア
        clear_filter_btn = driver.find_element(By.ID, "clearFilter")
        clear_filter_btn.click()
        time.sleep(0.5)

        visible_tasks_after = driver.execute_script("""
            return Array.from(document.querySelectorAll('.task-item'))
                .filter(el => el.style.display !== 'none').length;
        """)
        assert visible_tasks_after == 2, "フィルタークリア後のタスク数が不正"
        print("✓ フィルタークリア機能正常")

        # テスト4: タスク編集機能
        print("\n【テスト4】タスク編集機能")
        edit_btn = driver.find_element(By.CLASS_NAME, "btn-edit")
        edit_btn.click()
        time.sleep(0.5)

        edit_text_input = driver.find_element(By.CLASS_NAME, "edit-text")
        edit_text_input.clear()
        edit_text_input.send_keys("メインタスク1（編集済み）")

        save_btn = driver.find_element(By.CLASS_NAME, "btn-confirm-edit")
        save_btn.click()
        time.sleep(0.5)

        updated_text = driver.find_element(By.CLASS_NAME, "task-text").text
        assert "編集済み" in updated_text, "タスク編集が反映されていません"
        print("✓ タスク編集機能正常")

        # テスト5: 展開・折りたたみ
        print("\n【テスト5】展開・折りたたみ機能")
        collapse_btn = driver.find_element(By.ID, "collapseAll")
        collapse_btn.click()
        time.sleep(0.5)

        collapsed = driver.execute_script("""
            return document.querySelector('.subtasks.expanded') === null;
        """)
        assert collapsed, "すべて閉じる機能が動作していません"
        print("✓ すべて閉じる機能正常")

        expand_btn = driver.find_element(By.ID, "expandAll")
        expand_btn.click()
        time.sleep(0.5)

        expanded = driver.execute_script("""
            return document.querySelector('.subtasks.expanded') !== null;
        """)
        assert expanded, "すべて展開機能が動作していません"
        print("✓ すべて展開機能正常")

        # テスト6: LocalStorage永続化
        print("\n【テスト6】LocalStorage永続化")
        storage_data = driver.execute_script("return localStorage.getItem('hierarchicalTasks');")
        assert storage_data is not None, "LocalStorageにデータが保存されていません"
        print("✓ LocalStorage保存機能正常")

        driver.refresh()
        time.sleep(1)

        tasks_after_reload = driver.find_elements(By.CLASS_NAME, "task-item")
        assert len(tasks_after_reload) == 2, "リロード後にタスクが復元されていません"
        print("✓ リロード後のデータ復元正常")

        print("\n" + "="*50)
        print("すべてのテストが成功しました！ ✓")
        print("="*50)

    except Exception as e:
        print(f"\n✗ テスト失敗: {e}")
        raise

    finally:
        time.sleep(2)
        driver.quit()
        print("\nテスト終了")

if __name__ == "__main__":
    test_accordion_task_app()
