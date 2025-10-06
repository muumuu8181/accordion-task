// タスクデータ管理
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.loadFromLocalStorage();
    }

    addTask(text, parentId = null, level = 1) {
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            level: level,
            parentId: parentId,
            children: [],
            expanded: true
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
        this.activeSubtaskForm = null;

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
    }

    handleAddTask() {
        const text = this.newTaskInput.value.trim();
        if (text) {
            this.taskManager.addTask(text);
            this.newTaskInput.value = '';
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

        taskDiv.innerHTML = `
            <div class="task-header">
                ${hasChildren ? `
                    <button class="toggle-btn ${task.expanded ? '' : 'collapsed'}">
                        ▼
                    </button>
                ` : '<span style="width: 24px; margin-right: 10px;"></span>'}
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    ${canAddChildren ? '<button class="btn-action btn-add">+ 細分化</button>' : ''}
                    <button class="btn-action btn-delete">削除</button>
                </div>
            </div>
            ${hasChildren ? '<div class="subtasks ' + (task.expanded ? 'expanded' : '') + '"></div>' : ''}
            ${canAddChildren ? `
                <div class="add-subtask-form" data-parent-id="${task.id}">
                    <input type="text" placeholder="サブタスクを入力..." class="subtask-input">
                    <button class="btn-confirm">追加</button>
                    <button class="btn-cancel">キャンセル</button>
                </div>
            ` : ''}
        `;

        // イベントリスナー設定
        const header = taskDiv.querySelector('.task-header');
        const toggleBtn = taskDiv.querySelector('.toggle-btn');
        const checkbox = taskDiv.querySelector('.task-checkbox');
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

        // サブタスク追加フォーム
        const subtaskForm = taskDiv.querySelector('.add-subtask-form');
        if (subtaskForm) {
            const input = subtaskForm.querySelector('.subtask-input');
            const confirmBtn = subtaskForm.querySelector('.btn-confirm');
            const cancelBtn = subtaskForm.querySelector('.btn-cancel');

            confirmBtn.addEventListener('click', () => {
                this.handleAddSubtask(task.id, input.value);
            });

            cancelBtn.addEventListener('click', () => {
                this.hideSubtaskForm();
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddSubtask(task.id, input.value);
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

    handleAddSubtask(parentId, text) {
        text = text.trim();
        if (text) {
            this.taskManager.addTask(text, parentId);
            this.hideSubtaskForm();
            this.render();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const taskUI = new TaskUI(taskManager);
});
