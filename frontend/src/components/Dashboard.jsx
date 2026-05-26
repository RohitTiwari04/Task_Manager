import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Calendar, Clock, Edit3, Trash2, Plus, Search, LogOut, 
  CheckCircle2, FolderHeart, AlertTriangle, X, Check, 
  Activity, ArrowUpDown, RefreshCw 
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  // Task states
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Control filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadline, setDeadline] = useState('');
  
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks(sortBy, sortOrder);
      setTasks(data);
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy, sortOrder]);

  // Apply filters locally on tasks list
  useEffect(() => {
    let result = [...tasks];
    
    if (search.trim() !== '') {
      result = result.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    setFilteredTasks(result);
  }, [tasks, search, statusFilter, priorityFilter]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Open modal to add
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');
    // Set default deadline to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeadline(tomorrow.toISOString().split('T')[0]);
    setModalOpen(true);
  };

  // Open modal to edit
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDeadline(task.deadline || '');
    setModalOpen(true);
  };

  // Form submission (Add or Update)
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      showToast('Title is required', 'error');
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      deadline: deadline || null
    };

    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, taskData);
        showToast('Task updated successfully');
      } else {
        await api.createTask(taskData);
        showToast('Task created successfully');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(id);
      showToast('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Quick toggle/cycle status: TODO -> IN_PROGRESS -> COMPLETED -> TODO
  const handleCycleStatus = async (task) => {
    let nextStatus = 'TODO';
    if (task.status === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (task.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    
    try {
      await api.updateTaskStatus(task.id, nextStatus);
      showToast(`Task status updated to ${nextStatus.replace('_', ' ')}`);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Calculate statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status !== 'COMPLETED').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length;
  
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <CheckCircle2 size={24} color="#6366F1" />
          <span>TaskFlow</span>
        </div>
        
        <div className="nav-user">
          <div className="user-badge">
            <Activity size={14} color="#6366F1" />
            <span>Hello, {user?.username}</span>
          </div>
          <button className="btn-logout" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="dashboard-main">
        
        {/* Stats Row */}
        <section className="stats-panel">
          <div className="glass-panel stat-card">
            <div className="stat-info">
              <h3>All Tasks</h3>
              <div className="stat-value">{totalCount}</div>
            </div>
            <div className="stat-icon blue">
              <FolderHeart size={22} />
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-info">
              <h3>Progress</h3>
              <div className="stat-value">{completionPercentage}%</div>
            </div>
            <div className="stat-icon green">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-info">
              <h3>High Alert</h3>
              <div className="stat-value">{highPriorityCount}</div>
            </div>
            <div className="stat-icon rose">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-info">
              <h3>Active To-Dos</h3>
              <div className="stat-value">{pendingCount}</div>
            </div>
            <div className="stat-icon amber">
              <Clock size={22} />
            </div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="glass-panel controls-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div className="search-filter-group">
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by title or description..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select 
              className="select-filter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select 
              className="select-filter" 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="action-group">
            <select 
              className="select-filter" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>

            <button 
              className="select-filter" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', padding: '0' }}
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              title={`Sorting: ${sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown size={16} />
            </button>

            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px' }} onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>New Task</span>
            </button>
          </div>
        </section>

        {/* Tasks List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <RefreshCw className="empty-state-icon animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Synchronizing workspace...</p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-panel empty-state">
            <FolderHeart className="empty-state-icon" size={48} />
            <h3>No Tasks Found</h3>
            <p>
              {tasks.length === 0 
                ? "You haven't registered any tasks yet. Kickstart your day by mapping a new task!" 
                : "No tasks match your filter parameters. Try broadening your criteria."}
            </p>
            {tasks.length === 0 && (
              <button className="btn-primary" style={{ width: 'auto' }} onClick={handleOpenAddModal}>
                <Plus size={16} />
                <span>Add Your First Task</span>
              </button>
            )}
          </div>
        ) : (
          <section className="tasks-grid">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`glass-panel task-card priority-${task.priority.toLowerCase()} ${task.status === 'COMPLETED' ? 'completed-opacity' : ''}`}
              >
                <style>{`.completed-opacity { opacity: 0.85; }`}</style>
                <div className="task-header">
                  <h3 className="task-title" title={task.title}>{task.title}</h3>
                  <div className="task-actions">
                    <button className="task-btn" onClick={() => handleOpenEditModal(task)} title="Edit Task">
                      <Edit3 size={14} />
                    </button>
                    <button className="task-btn delete" onClick={() => handleDeleteTask(task.id)} title="Delete Task">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="task-badges">
                  <span className={`badge status-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>

                <p className="task-description">
                  {task.description || <i>No description provided.</i>}
                </p>

                <div className="task-footer">
                  <div className="task-date">
                    <Calendar size={13} />
                    <span>{task.deadline ? task.deadline : 'No deadline'}</span>
                  </div>
                  
                  <button 
                    className={`task-btn ${task.status === 'COMPLETED' ? 'complete' : ''}`} 
                    onClick={() => handleCycleStatus(task)}
                    title={task.status === 'COMPLETED' ? 'Reset to Todo' : 'Cycle Status'}
                    style={{ color: task.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--text-muted)' }}
                  >
                    {task.status === 'COMPLETED' ? <Check size={16} strokeWidth={3} /> : <Activity size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Floating Glassmorphic Add/Edit Task Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingTask ? 'Modify Task' : 'Compose Task'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="What needs to be accomplished?" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="form-input" 
                  style={{ paddingLeft: '16px', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Provide supporting details about the goal..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '16px' }}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input" 
                    style={{ paddingLeft: '16px' }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Deadline</label>
                <div className="input-wrapper">
                  <input 
                    type="date" 
                    className="form-input" 
                    style={{ paddingLeft: '16px' }}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                  <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      {toast.show && (
        <div className={`alert-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
