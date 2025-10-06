// タスクデータ管理
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.loadFromLocalStorage();
    }

    addTask(text, parentId = null, level = 1, priority1 = null, priority2 = null, deadline = null) {
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            level: level,
            parentId: parentId,
            children: [],
            expanded: true,
            priority1: priority1,
            priority2: priority2,
            deadline: deadline
        };

        if (parentId === null) {
            this.tasks.push(task);
        } else {
            const parent = this.findTaskById(parentId);
            if (parent && parent.level < 4) {
                task.level = parent.level + 1;
                parent.children.push(task);
            } else {
                alert('最大階層（4段階）に達しています');
                return null;
            }
        }

        this.saveToLocalStorage();
        return task;
    }

    findTaskById(id, tasks = this.tasks) {
        for (let task of tasks) {
            if (task.id === id) return task;
            const found = this.findTaskById(id, task.children);
            if (found) return found;
        }
        return null;
    }

    deleteTask(id) {
        const deleteRecursive = (tasks) => {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id === id) {
                    tasks.splice(i, 1);
                    return true;
                }
                if (deleteRecursive(tasks[i].children)) {
                    return true;
                }
            }
            return false;
        };

        deleteRecursive(this.tasks);
        this.saveToLocalStorage();
    }

    toggleComplete(id) {
        const task = this.findTaskById(id);
        if (task) {
            task.completed = !task.completed;
            this.toggleChildrenComplete(task, task.completed);
            this.saveToLocalStorage();
        }
    }

    toggleChildrenComplete(task, completed) {
        task.children.forEach(child => {
            child.completed = completed;
            this.toggleChildrenComplete(child, completed);
        });
    }

    toggleExpanded(id) {
        const task = this.findTaskById(id);
        if (task) {
            task.expanded = !task.expanded;
            this.saveToLocalStorage();
        }
    }

    updateTaskPriority(id, priority1, priority2) {
        const task = this.findTaskById(id);
        if (task) {
            task.priority1 = priority1;
            task.priority2 = priority2;
            this.saveToLocalStorage();
        }
    }

    updateTaskDeadline(id, deadline) {
        const task = this.findTaskById(id);
        if (task) {
            task.deadline = deadline;
            this.saveToLocalStorage();
        }
    }

    updateTaskText(id, text) {
        const task = this.findTaskById(id);
        if (task) {
            task.text = text;
            this.saveToLocalStorage();
        }
    }

    expandAll(tasks = this.tasks) {
        tasks.forEach(task => {
            task.expanded = true;
            this.expandAll(task.children);
        });
        this.saveToLocalStorage();
    }

    collapseAll(tasks = this.tasks) {
        tasks.forEach(task => {
            task.expanded = false;
            this.collapseAll(task.children);
        });
        this.saveToLocalStorage();
    }

    exportToMarkdown() {
        let markdown = '# タスクリスト\n\n';

        const formatTask = (task, indent = '') => {
            const checkbox = task.completed ? '[x]' : '[ ]';
            const priority = (task.priority1 && task.priority2) ? `**[${task.priority1}${task.priority2}]**` : '';
            const deadline = task.deadline ? `📅 ${task.deadline}` : '';
            const meta = [priority, deadline].filter(x => x).join(' ');

            let line = `${indent}- ${checkbox} ${task.text}`;
            if (meta) {
                line += ` ${meta}`;
            }
            line += '\n';

            markdown += line;

            task.children.forEach(child => {
                formatTask(child, indent + '  ');
            });
        };

        this.tasks.forEach(task => formatTask(task));

        return markdown;
    }

    saveToLocalStorage() {
        localStorage.setItem('hierarchicalTasks', JSON.stringify({
            tasks: this.tasks,
            taskIdCounter: this.taskIdCounter
        }));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('hierarchicalTasks');
        if (data) {
            const parsed = JSON.parse(data);
            this.tasks = parsed.tasks || [];
            this.taskIdCounter = parsed.taskIdCounter || 1;
        }
    }
}

// UI管理
class TaskUI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskListElement = document.getElementById('taskList');
        this.newTaskInput = document.getElementById('newTaskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.expandAllBtn = document.getElementById('expandAll');
        this.collapseAllBtn = document.getElementById('collapseAll');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.clearFilterBtn = document.getElementById('clearFilter');
        this.exportBtn = document.getElementById('exportToGitHub');
        this.activeSubtaskForm = null;
        this.currentFilter = '';

        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        this.newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTask();
        });
        this.expandAllBtn.addEventListener('click', () => this.handleExpandAll());
        this.collapseAllBtn.addEventListener('click', () => this.handleCollapseAll());
        this.priorityFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.applyFilter();
        });
        this.clearFilterBtn.addEventListener('click', () => {
            this.priorityFilter.value = '';
            this.currentFilter = '';
            this.applyFilter();
        });
        this.exportBtn.addEventListener('click', () => this.handleExport());
    }

    async handleExport() {
        const markdown = this.taskManager.exportToMarkdown();

        // GitHub Gistにアップロード
        const gistData = {
            description: 'タスクリスト - ' + new Date().toLocaleString('ja-JP'),
            public: true,
            files: {
                'tasks.md': {
                    content: markdown
                }
            }
        };

        try {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                const result = await response.json();
                const gistUrl = result.html_url;

                // 成功メッセージとURLをコピー
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(gistUrl);
                    alert(`✅ GitHubにアップロード成功！\n\nURL: ${gistUrl}\n\n（クリップボードにコピーしました）`);
                } else {
                    prompt('✅ GitHubにアップロード成功！\nURLをコピーしてください:', gistUrl);
                }
            } else {
                throw new Error('アップロード失敗: ' + response.status);
            }
        } catch (error) {
            alert('❌ アップロードエラー: ' + error.message);
            console.error(error);
        }
    }

    handleAddTask() {
        const text = this.newTaskInput.value.trim();
        const priority1 = document.getElementById('newTaskPriority1').value || null;
        const priority2 = document.getElementById('newTaskPriority2').value || null;
        const deadline = document.getElementById('newTaskDeadline').value || null;

        if (text) {
            this.taskManager.addTask(text, null, 1, priority1, priority2, deadline);
            this.newTaskInput.value = '';
            document.getElementById('newTaskPriority1').value = '';
            document.getElementById('newTaskPriority2').value = '';
            document.getElementById('newTaskDeadline').value = '';
            this.render();
        }
    }

    handleExpandAll() {
        this.taskManager.expandAll();
        this.render();
    }

    handleCollapseAll() {
        this.taskManager.collapseAll();
        this.render();
    }

    render() {
        this.taskListElement.innerHTML = '';

        if (this.taskManager.tasks.length === 0) {
            this.taskListElement.innerHTML = `
                <div class="empty-state">
                    <h3>📝 タスクがありません</h3>
                    <p>上の入力欄から新しいタスクを追加してください</p>
                </div>
            `;
            return;
        }

        this.taskManager.tasks.forEach(task => {
            this.taskListElement.appendChild(this.createTaskElement(task));
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item level-${task.level}`;
        taskDiv.dataset.taskId = task.id;

        const hasChildren = task.children.length > 0;
        const canAddChildren = task.level < 4;
        const hasPriority = task.priority1 && task.priority2;
        const priorityClass = hasPriority ? `priority-${task.priority1}${task.priority2}` : '';
        const deadlineText = task.deadline ? `期限: ${task.deadline}` : '';

        taskDiv.innerHTML = `
            <div class="task-header ${priorityClass}" data-priority1="${task.priority1 || ''}" data-priority2="${task.priority2 || ''}">
                ${hasChildren ? `
                    <button class="toggle-btn ${task.expanded ? '' : 'collapsed'}">
                        ▼
                    </button>
                ` : '<span style="width: 24px; margin-right: 10px;"></span>'}
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                <div class="task-meta">
                    ${hasPriority ? `<span class="priority-badge">${task.priority1}${task.priority2}</span>` : '<span class="priority-badge priority-none">未設定</span>'}
                    ${deadlineText ? `<span class="deadline-badge">${deadlineText}</span>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-action btn-edit">編集</button>
                    ${canAddChildren ? '<button class="btn-action btn-add">+ 細分化</button>' : ''}
                    <button class="btn-action btn-delete">削除</button>
                </div>
            </div>
            ${hasChildren ? '<div class="subtasks ' + (task.expanded ? 'expanded' : '') + '"></div>' : ''}
            ${canAddChildren ? `
                <div class="add-subtask-form" data-parent-id="${task.id}">
                    <input type="text" placeholder="サブタスクを入力..." class="subtask-input">
                    <select class="subtask-priority1">
                        <option value="" selected>未設定</option>
                        <option value="S">S</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                    <select class="subtask-priority2">
                        <option value="" selected>未設定</option>
                        <option value="S">S</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                    <input type="date" class="subtask-deadline">
                    <button class="btn-confirm">追加</button>
                    <button class="btn-cancel">キャンセル</button>
                </div>
            ` : ''}
            <div class="edit-form" data-task-id="${task.id}" style="display: none;">
                <div class="edit-form-row">
                    <label>タスク名:</label>
                    <input type="text" class="edit-text" value="${this.escapeHtml(task.text)}">
                </div>
                <div class="edit-form-row">
                    <label>重要度1:</label>
                    <select class="edit-priority1">
                        <option value="">未設定</option>
                        <option value="S" ${task.priority1 === 'S' ? 'selected' : ''}>S</option>
                        <option value="A" ${task.priority1 === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${task.priority1 === 'B' ? 'selected' : ''}>B</option>
                        <option value="C" ${task.priority1 === 'C' ? 'selected' : ''}>C</option>
                    </select>
                    <label>重要度2:</label>
                    <select class="edit-priority2">
                        <option value="">未設定</option>
                        <option value="S" ${task.priority2 === 'S' ? 'selected' : ''}>S</option>
                        <option value="A" ${task.priority2 === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${task.priority2 === 'B' ? 'selected' : ''}>B</option>
                        <option value="C" ${task.priority2 === 'C' ? 'selected' : ''}>C</option>
                    </select>
                    <label>期限:</label>
                    <input type="date" class="edit-deadline" value="${task.deadline || ''}">
                </div>
                <div class="edit-form-actions">
                    <button class="btn-confirm-edit">保存</button>
                    <button class="btn-cancel-edit">キャンセル</button>
                </div>
            </div>
        `;

        // イベントリスナー設定
        const header = taskDiv.querySelector('.task-header');
        const toggleBtn = taskDiv.querySelector('.toggle-btn');
        const checkbox = taskDiv.querySelector('.task-checkbox');
        const editBtn = taskDiv.querySelector('.btn-edit');
        const addBtn = taskDiv.querySelector('.btn-add');
        const deleteBtn = taskDiv.querySelector('.btn-delete');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleToggle(task.id);
            });
        }

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleCheckbox(task.id);
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showEditForm(task.id);
        });

        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSubtaskForm(task.id);
            });
        }

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDelete(task.id);
        });

        // 編集フォーム
        const editForm = taskDiv.querySelector('.edit-form');
        const editText = editForm.querySelector('.edit-text');
        const editPriority1 = editForm.querySelector('.edit-priority1');
        const editPriority2 = editForm.querySelector('.edit-priority2');
        const editDeadline = editForm.querySelector('.edit-deadline');
        const confirmEditBtn = editForm.querySelector('.btn-confirm-edit');
        const cancelEditBtn = editForm.querySelector('.btn-cancel-edit');

        confirmEditBtn.addEventListener('click', () => {
            const newText = editText.value.trim();
            if (newText) {
                this.taskManager.updateTaskText(task.id, newText);
                this.taskManager.updateTaskPriority(task.id, editPriority1.value || null, editPriority2.value || null);
                this.taskManager.updateTaskDeadline(task.id, editDeadline.value || null);
                editForm.style.display = 'none';
                this.render();
            } else {
                alert('タスク名は空にできません');
            }
        });

        cancelEditBtn.addEventListener('click', () => {
            editForm.style.display = 'none';
        });

        // サブタスク追加フォーム
        const subtaskForm = taskDiv.querySelector('.add-subtask-form');
        if (subtaskForm) {
            const input = subtaskForm.querySelector('.subtask-input');
            const priority1Select = subtaskForm.querySelector('.subtask-priority1');
            const priority2Select = subtaskForm.querySelector('.subtask-priority2');
            const deadlineInput = subtaskForm.querySelector('.subtask-deadline');
            const confirmBtn = subtaskForm.querySelector('.btn-confirm');
            const cancelBtn = subtaskForm.querySelector('.btn-cancel');

            confirmBtn.addEventListener('click', () => {
                this.handleAddSubtask(task.id, input.value, priority1Select.value, priority2Select.value, deadlineInput.value);
            });

            cancelBtn.addEventListener('click', () => {
                this.hideSubtaskForm();
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddSubtask(task.id, input.value, priority1Select.value, priority2Select.value, deadlineInput.value);
                } else if (e.key === 'Escape') {
                    this.hideSubtaskForm();
                }
            });
        }

        // サブタスクを再帰的に追加
        if (hasChildren) {
            const subtasksContainer = taskDiv.querySelector('.subtasks');
            task.children.forEach(child => {
                subtasksContainer.appendChild(this.createTaskElement(child));
            });
        }

        return taskDiv;
    }

    handleToggle(taskId) {
        this.taskManager.toggleExpanded(taskId);
        this.render();
    }

    handleCheckbox(taskId) {
        this.taskManager.toggleComplete(taskId);
        this.render();
    }

    handleDelete(taskId) {
        if (confirm('このタスクとすべてのサブタスクを削除しますか?')) {
            this.taskManager.deleteTask(taskId);
            this.render();
        }
    }

    showSubtaskForm(parentId) {
        this.hideSubtaskForm();
        const form = document.querySelector(`.add-subtask-form[data-parent-id="${parentId}"]`);
        if (form) {
            form.classList.add('active');
            form.querySelector('.subtask-input').focus();
            this.activeSubtaskForm = form;
        }
    }

    hideSubtaskForm() {
        if (this.activeSubtaskForm) {
            this.activeSubtaskForm.classList.remove('active');
            this.activeSubtaskForm.querySelector('.subtask-input').value = '';
            this.activeSubtaskForm = null;
        }
    }

    handleAddSubtask(parentId, text, priority1 = null, priority2 = null, deadline = null) {
        text = text.trim();
        if (text) {
            const parent = this.taskManager.findTaskById(parentId);
            this.taskManager.addTask(text, parentId, parent.level + 1, priority1 || null, priority2 || null, deadline || null);
            this.hideSubtaskForm();
            this.render();
        }
    }

    showEditForm(taskId) {
        const editForm = document.querySelector(`.edit-form[data-task-id="${taskId}"]`);
        if (editForm) {
            editForm.style.display = 'flex';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    applyFilter() {
        // フィルターなしの場合はすべて表示
        if (!this.currentFilter) {
            document.querySelectorAll('.task-item').forEach(item => {
                item.style.display = '';
            });
            return;
        }

        // 各タスクアイテムをチェック
        const checkTask = (item) => {
            const header = item.querySelector(':scope > .task-header');
            const priority1 = header.dataset.priority1;
            const priority2 = header.dataset.priority2;

            let match = false;

            if (this.currentFilter === 'unset') {
                match = !priority1 || !priority2;
            } else {
                match = priority1 === this.currentFilter;
            }

            // サブタスクをチェック
            const subtasksContainer = item.querySelector(':scope > .subtasks');
            let hasMatchingChild = false;

            if (subtasksContainer) {
                const childItems = subtasksContainer.querySelectorAll(':scope > .task-item');
                childItems.forEach(child => {
                    const childMatches = checkTask(child);
                    if (childMatches) {
                        hasMatchingChild = true;
                    }
                });
            }

            // 自分自身がマッチするか、子がマッチする場合は表示
            if (match || hasMatchingChild) {
                item.style.display = '';
                // マッチする子がある場合は展開
                if (hasMatchingChild && subtasksContainer) {
                    subtasksContainer.classList.add('expanded');
                    const toggleBtn = item.querySelector(':scope > .task-header .toggle-btn');
                    if (toggleBtn) {
                        toggleBtn.classList.remove('collapsed');
                    }
                }
                return true;
            } else {
                item.style.display = 'none';
                return false;
            }
        };

        // トップレベルのタスクから開始
        const topLevelTasks = this.taskListElement.querySelectorAll(':scope > .task-item');
        topLevelTasks.forEach(task => checkTask(task));
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const taskUI = new TaskUI(taskManager);
});
