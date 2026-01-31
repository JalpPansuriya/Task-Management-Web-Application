const Auth = {
    init() {
        this.checkAuthRedirect();
        this.bindEvents();
    },

    checkAuthRedirect() {
        const token = localStorage.getItem('token');
        const isAuthPage = window.location.pathname.includes('login.html') ||
            window.location.pathname.includes('register.html');

        if (token && isAuthPage) {
            window.location.href = 'index.html';
        }
    },

    bindEvents() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    },

    showError(message) {
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('active');
            setTimeout(() => errorEl.classList.remove('active'), 5000);
        }
    },

    showSuccess(message) {
        const successEl = document.getElementById('success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.classList.add('active');
        }
    },

    setLoading(isLoading) {
        const btn = document.getElementById('submit-btn');
        if (btn) {
            btn.disabled = isLoading;
            const btnText = btn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isLoading ? 'Please wait...' : (
                    document.getElementById('login-form') ? 'Login' : 'Register'
                );
            }
        }
    },

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        try {
            this.setLoading(true);
            const response = await AuthAPI.login({ email, password });

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            window.location.href = 'index.html';
        } catch (error) {
            this.showError(error.message || 'Login failed');
        } finally {
            this.setLoading(false);
        }
    },

    async handleRegister(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        try {
            this.setLoading(true);
            await AuthAPI.register({ username, email, password });

            this.showSuccess('Registration successful! Redirecting to login...');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            this.showError(error.message || 'Registration failed');
            this.setLoading(false);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
