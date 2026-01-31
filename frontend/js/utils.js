const Utils = {
    show(element) {
        if (element) {
            element.classList.add('active');
        }
    },

    hide(element) {
        if (element) {
            element.classList.remove('active');
        }
    },

    formatDate(dateString) {
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                }
            });
        } else if (typeof children === 'string') {
            element.textContent = children;
        }

        return element;
    },

    showError(message) {
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
            errorEl.textContent = message;
            this.show(errorEl);

            setTimeout(() => {
                this.hide(errorEl);
            }, 5000);
        }
    },

    showSuccess(message) {
        const successEl = document.getElementById('success-message');
        if (successEl) {
            successEl.textContent = message;
            this.show(successEl);

            setTimeout(() => {
                this.hide(successEl);
            }, 3000);
        }
    },

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    getStatusClass(status) {
        const statusMap = {
            'pending': 'status-pending',
            'in-progress': 'status-in-progress',
            'completed': 'status-completed'
        };
        return statusMap[status] || 'status-pending';
    },

    getStatusText(status) {
        const textMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        return textMap[status] || 'Pending';
    }
};
