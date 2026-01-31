const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }
        throw new Error(data.error || 'Request failed');
    }

    return data;
};

const AuthAPI = {
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    async getMe() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { ...getAuthHeader() }
        });
        return handleResponse(response);
    }
};

const TaskAPI = {
    async getAll(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.status && filters.status !== 'all') params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);

            const queryString = params.toString();
            const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                headers: { ...getAuthHeader() }
            });
            const data = await handleResponse(response);
            return data.data;
        } catch (error) {
            console.error('API getAll error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                headers: { ...getAuthHeader() }
            });
            const data = await handleResponse(response);
            return data.data;
        } catch (error) {
            console.error('API getById error:', error);
            throw error;
        }
    },

    async create(taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(taskData)
            });
            const data = await handleResponse(response);
            return data.data;
        } catch (error) {
            console.error('API create error:', error);
            throw error;
        }
    },

    async update(id, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(taskData)
            });
            const data = await handleResponse(response);
            return data.data;
        } catch (error) {
            console.error('API update error:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { ...getAuthHeader() }
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API delete error:', error);
            throw error;
        }
    }
};
