const API_BASE_URL = 'http://localhost:8081/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('task_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async register(username, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // Tasks CRUD
  async getTasks(sortBy = '', sortOrder = '') {
    let url = `${API_BASE_URL}/tasks`;
    const params = [];
    if (sortBy) params.push(`sortBy=${sortBy}`);
    if (sortOrder) params.push(`sortOrder=${sortOrder}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('task_token');
      localStorage.removeItem('task_user');
      window.location.reload();
      throw new Error('Session expired');
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data;
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },

  async updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task status');
    return data;
  },
};
