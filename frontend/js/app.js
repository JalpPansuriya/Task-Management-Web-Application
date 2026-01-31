const App = {
    elements: {
        taskForm: null,
        taskList: null,
        taskCount: null,
        loader: null,
        emptyState: null,
        errorMessage: null,
        successMessage: null,
        editModal: null,
        editForm: null,
        confirmModal: null,
        titleInput: null,
        descriptionInput: null,
        submitBtn: null,
        userName: null,
        logoutBtn: null,
        filterStatus: null,
        filterSearch: null,
        filterSort: null,
        clearFilters: null
    },

    tasks: [],
    taskToDelete: null,
    filters: {
        status: 'all',
        search: '',
        sort: 'newest'
    },
    searchTimeout: null,

    init() {
        if (!this.checkAuth()) return;
        this.cacheElements();
        this.displayUser();
        this.bindEvents();
        this.loadTasks();
    },

    checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    displayUser() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (this.elements.userName && user.username) {
            this.elements.userName.textContent = user.username;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    cacheElements() {
        this.elements.taskForm = document.getElementById('task-form');
        this.elements.taskList = document.getElementById('task-list');
        this.elements.taskCount = document.getElementById('task-count');
        this.elements.loader = document.getElementById('loader');
        this.elements.emptyState = document.getElementById('empty-state');
        this.elements.errorMessage = document.getElementById('error-message');
        this.elements.successMessage = document.getElementById('success-message');
        this.elements.editModal = document.getElementById('edit-modal');
        this.elements.editForm = document.getElementById('edit-form');
        this.elements.confirmModal = document.getElementById('confirm-modal');
        this.elements.titleInput = document.getElementById('task-title');
        this.elements.descriptionInput = document.getElementById('task-description');
        this.elements.submitBtn = document.getElementById('submit-btn');
        this.elements.userName = document.getElementById('user-name');
        this.elements.logoutBtn = document.getElementById('logout-btn');
        this.elements.filterStatus = document.getElementById('filter-status');
        this.elements.filterSearch = document.getElementById('filter-search');
        this.elements.filterSort = document.getElementById('filter-sort');
        this.elements.clearFilters = document.getElementById('clear-filters');
    },

    bindEvents() {
        this.elements.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        document.getElementById('modal-close').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancel-edit').addEventListener('click', () => this.closeEditModal());
        this.elements.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));

        document.getElementById('cancel-delete').addEventListener('click', () => this.closeConfirmModal());
        document.getElementById('confirm-delete').addEventListener('click', () => this.handleConfirmDelete());

        this.elements.editModal.addEventListener('click', (e) => {
            if (e.target === this.elements.editModal) {
                this.closeEditModal();
            }
        });
        this.elements.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.elements.confirmModal) {
                this.closeConfirmModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
                this.closeConfirmModal();
            }
        });

        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.logout());
        }

        if (this.elements.filterStatus) {
            this.elements.filterStatus.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.loadTasks();
            });
        }

        if (this.elements.filterSearch) {
            this.elements.filterSearch.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.filters.search = e.target.value.trim();
                    this.loadTasks();
                }, 300);
            });
        }

        if (this.elements.filterSort) {
            this.elements.filterSort.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.loadTasks();
            });
        }

        if (this.elements.clearFilters) {
            this.elements.clearFilters.addEventListener('click', () => this.clearAllFilters());
        }
    },

    clearAllFilters() {
        this.filters = { status: 'all', search: '', sort: 'newest' };
        if (this.elements.filterStatus) this.elements.filterStatus.value = 'all';
        if (this.elements.filterSearch) this.elements.filterSearch.value = '';
        if (this.elements.filterSort) this.elements.filterSort.value = 'newest';
        this.loadTasks();
    },

    async loadTasks() {
        try {
            this.showLoader();
            this.tasks = await TaskAPI.getAll(this.filters);
            this.renderTasks(this.tasks);
        } catch (error) {
            Utils.showError('Failed to load tasks. Please check your connection and try again.');
            console.error('Load tasks error:', error);
        } finally {
            this.hideLoader();
        }
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        const title = this.elements.titleInput.value.trim();
        const description = this.elements.descriptionInput.value.trim();

        if (!title) {
            Utils.showError('Please enter a task title');
            return;
        }

        try {
            this.setSubmitLoading(true);
            await TaskAPI.create({ title, description });

            this.elements.taskForm.reset();
            this.elements.titleInput.focus();

            this.loadTasks();
            Utils.showSuccess('Task created successfully!');
        } catch (error) {
            Utils.showError(error.message || 'Failed to create task');
            console.error('Create task error:', error);
        } finally {
            this.setSubmitLoading(false);
        }
    },

    async handleStatusUpdate(id, newStatus) {
        try {
            await TaskAPI.update(id, { status: newStatus });
            this.loadTasks();
            Utils.showSuccess('Status updated!');
        } catch (error) {
            Utils.showError(error.message || 'Failed to update status');
            console.error('Update status error:', error);
            this.loadTasks();
        }
    },

    openEditModal(id) {
        const task = this.tasks.find(t => t._id === id);
        if (!task) return;

        document.getElementById('edit-task-id').value = task._id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description || '';
        document.getElementById('edit-status').value = task.status;

        Utils.show(this.elements.editModal);
        document.getElementById('edit-title').focus();
    },

    closeEditModal() {
        Utils.hide(this.elements.editModal);
    },

    async handleEditSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('edit-task-id').value;
        const title = document.getElementById('edit-title').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const status = document.getElementById('edit-status').value;

        if (!title) {
            Utils.showError('Title is required');
            return;
        }

        try {
            await TaskAPI.update(id, { title, description, status });
            this.closeEditModal();
            this.loadTasks();
            Utils.showSuccess('Task updated successfully!');
        } catch (error) {
            Utils.showError(error.message || 'Failed to update task');
            console.error('Update task error:', error);
        }
    },

    openConfirmModal(id) {
        this.taskToDelete = id;
        Utils.show(this.elements.confirmModal);
        document.getElementById('confirm-delete').focus();
    },

    closeConfirmModal() {
        Utils.hide(this.elements.confirmModal);
        this.taskToDelete = null;
    },

    async handleConfirmDelete() {
        if (!this.taskToDelete) return;

        const id = this.taskToDelete;

        try {
            await TaskAPI.delete(id);
            this.closeConfirmModal();
            this.loadTasks();
            Utils.showSuccess('Task deleted successfully!');
        } catch (error) {
            Utils.showError(error.message || 'Failed to delete task');
            console.error('Delete task error:', error);
        }
    },

    renderTasks(tasks) {
        const count = tasks.length;
        this.elements.taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;

        if (tasks.length === 0) {
            const hasFilters = this.filters.status !== 'all' || this.filters.search;
            const emptyMessage = hasFilters
                ? 'No tasks match your filters'
                : 'No tasks yet';
            const emptySubtext = hasFilters
                ? 'Try adjusting your filters or search term'
                : 'Add your first task above to get started!';

            document.querySelector('#empty-state h3').textContent = emptyMessage;
            document.querySelector('#empty-state p').textContent = emptySubtext;

            Utils.show(this.elements.emptyState);
            this.elements.taskList.innerHTML = '';
            return;
        }

        Utils.hide(this.elements.emptyState);

        this.elements.taskList.innerHTML = '';
        tasks.forEach(task => {
            const card = this.createTaskCard(task);
            this.elements.taskList.appendChild(card);
        });
    },

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.id = task._id;
        card.setAttribute('role', 'listitem');

        const statusClass = Utils.getStatusClass(task.status);
        const statusText = Utils.getStatusText(task.status);
        const formattedDate = Utils.formatDate(task.createdAt);

        card.innerHTML = `
            <div class="task-header">
                <h3 class="task-title"></h3>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            ${task.description ? '<p class="task-description"></p>' : ''}
            <div class="task-footer">
                <span class="task-date">Created: ${formattedDate}</span>
                <div class="task-actions">
                    <select class="status-select" aria-label="Change status">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button class="btn btn-icon btn-edit" title="Edit task">✏️</button>
                    <button class="btn btn-icon btn-delete" title="Delete task">🗑️</button>
                </div>
            </div>
        `;

        card.querySelector('.task-title').textContent = task.title;
        if (task.description) {
            card.querySelector('.task-description').textContent = task.description;
        }

        const statusSelect = card.querySelector('.status-select');
        statusSelect.addEventListener('change', (e) => {
            this.handleStatusUpdate(task._id, e.target.value);
        });

        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', () => this.openEditModal(task._id));

        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => this.openConfirmModal(task._id));

        return card;
    },

    showLoader() {
        Utils.show(this.elements.loader);
        Utils.hide(this.elements.emptyState);
    },

    hideLoader() {
        Utils.hide(this.elements.loader);
    },

    setSubmitLoading(isLoading) {
        this.elements.submitBtn.disabled = isLoading;
        const btnText = this.elements.submitBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = isLoading ? 'Adding...' : 'Add Task';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
