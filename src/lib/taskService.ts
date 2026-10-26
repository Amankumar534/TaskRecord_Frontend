import { apiRequest, setAuthToken } from './api';
import {
  Task,
  TaskStatus,
  TaskPriority,
  User,
  DashboardStats,
  toBackendStatus,
  toFrontendStatus,
} from '@/types/task';

// --- Backend API Raw Types ---
export interface BackendTask {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  subtasks: BackendSubtask[];
}

export interface BackendSubtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface BackendUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  user: BackendUser;
}

export interface BackendStatsResponse {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  blocked_tasks: number;
  completion_rate: number;
  total_subtasks: number;
  completed_subtasks: number;
  urgent_count: number;
  tasks_by_category: Record<string, number>;
  tasks_by_priority: Record<string, number>;
}

// Convert Backend Task to Frontend Task
export function mapBackendTaskToFrontend(t: BackendTask): Task {
  return {
    id: t.id,
    name: t.name,
    description: t.description || undefined,
    startDate: t.start_date,
    endDate: t.end_date,
    status: toFrontendStatus(t.status),
    priority: (t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase()) as TaskPriority,
    category: t.category,
    createdAt: t.created_at,
    userId: t.user_id,
    subtasks: (t.subtasks || []).map((s) => ({
      id: s.id,
      title: s.title,
      isCompleted: s.is_completed,
      taskId: s.task_id,
      createdAt: s.created_at,
    })),
  };
}

export function mapBackendUserToFrontend(u: BackendUser): User {
  return {
    id: u.id,
    fullName: u.full_name,
    email: u.email,
    avatarUrl: u.avatar_url,
    isActive: u.is_active,
  };
}

// ----------------- Auth API -----------------
export async function signupApi(fullName: string, email: string, password: string): Promise<User> {
  const payload = {
    full_name: fullName,
    email: email.trim().toLowerCase(),
    password,
  };

  const res = await apiRequest<BackendAuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  setAuthToken(res.access_token);
  return mapBackendUserToFrontend(res.user);
}

export async function loginApi(email: string, password: string): Promise<User> {
  const payload = {
    email: email.trim().toLowerCase(),
    password,
  };

  const res = await apiRequest<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  setAuthToken(res.access_token);
  return mapBackendUserToFrontend(res.user);
}

export async function getCurrentUserApi(): Promise<User> {
  const res = await apiRequest<BackendUser>('/auth/me', {
    method: 'GET',
  });
  return mapBackendUserToFrontend(res);
}

export function logoutApi(): void {
  setAuthToken(null);
}

// ----------------- Tasks API -----------------
export async function getTasksApi(params?: {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'ALL') {
    query.set('status', toBackendStatus(params.status as TaskStatus));
  }
  if (params?.priority && params.priority !== 'ALL') {
    query.set('priority', params.priority);
  }
  if (params?.category) {
    query.set('category', params.category);
  }
  if (params?.search) {
    query.set('search', params.search);
  }

  const qs = query.toString();
  const endpoint = `/tasks/${qs ? `?${qs}` : ''}`;
  const res = await apiRequest<BackendTask[]>(endpoint, {
    method: 'GET',
  });

  return res.map(mapBackendTaskToFrontend);
}

export async function createTaskApi(task: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  subtasks?: { title: string; isCompleted: boolean }[];
}): Promise<Task> {
  const payload = {
    name: task.name,
    description: task.description || null,
    start_date: task.startDate,
    end_date: task.endDate,
    status: toBackendStatus(task.status),
    priority: task.priority,
    category: task.category || 'General',
    subtasks: (task.subtasks || []).map((s) => ({
      title: s.title,
      is_completed: s.isCompleted,
    })),
  };

  const res = await apiRequest<BackendTask>('/tasks/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapBackendTaskToFrontend(res);
}

export async function updateTaskApi(
  id: string,
  updated: {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: string;
  }
): Promise<Task> {
  const payload: Record<string, any> = {};
  if (updated.name !== undefined) payload.name = updated.name;
  if (updated.description !== undefined) payload.description = updated.description;
  if (updated.startDate !== undefined) payload.start_date = updated.startDate;
  if (updated.endDate !== undefined) payload.end_date = updated.endDate;
  if (updated.status !== undefined) payload.status = toBackendStatus(updated.status);
  if (updated.priority !== undefined) payload.priority = updated.priority;
  if (updated.category !== undefined) payload.category = updated.category;

  const res = await apiRequest<BackendTask>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return mapBackendTaskToFrontend(res);
}

export async function deleteTaskApi(id: string): Promise<void> {
  await apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

// ----------------- Subtasks API -----------------
export async function addSubtaskApi(taskId: string, title: string): Promise<BackendSubtask> {
  const payload = {
    title,
    is_completed: false,
  };

  return await apiRequest<BackendSubtask>(`/tasks/${taskId}/subtasks`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function toggleSubtaskApi(
  taskId: string,
  subtaskId: string,
  isCompleted: boolean
): Promise<BackendSubtask> {
  const payload = {
    is_completed: isCompleted,
  };

  return await apiRequest<BackendSubtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteSubtaskApi(taskId: string, subtaskId: string): Promise<void> {
  await apiRequest(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
}

// ----------------- Dashboard Analytics API -----------------
export async function getDashboardStatsApi(): Promise<DashboardStats> {
  const res = await apiRequest<BackendStatsResponse>('/dashboard/stats', {
    method: 'GET',
  });

  return {
    totalTasks: res.total_tasks,
    completedTasks: res.completed_tasks,
    inProgressTasks: res.in_progress_tasks,
    pendingTasks: res.pending_tasks,
    blockedTasks: res.blocked_tasks,
    completionRate: res.completion_rate,
    totalSubtasks: res.total_subtasks,
    completedSubtasks: res.completed_subtasks,
    urgentCount: res.urgent_count,
    tasksByCategory: res.tasks_by_category || {},
    tasksByPriority: res.tasks_by_priority || {},
  };
}
