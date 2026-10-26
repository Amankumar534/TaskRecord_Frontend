export type BackendTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type FrontendTaskStatus = 'Not Start' | 'In Progress' | 'On Hold' | 'Completed';
export type TaskStatus = FrontendTaskStatus | BackendTaskStatus;

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  subtasks: Subtask[];
  createdAt: string;
  userId?: string;
}

export interface User {
  id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isActive?: boolean;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;   // On Hold
  blockedTasks: number;   // Not Start
  completionRate: number;
  totalSubtasks: number;
  completedSubtasks: number;
  urgentCount: number;
  tasksByCategory: Record<string, number>;
  tasksByPriority: Record<string, number>;
}

// Helper mapping between frontend UX statuses and backend stored statuses
export function toBackendStatus(status: TaskStatus): BackendTaskStatus {
  if (status === 'Not Start') return 'Blocked';
  if (status === 'On Hold') return 'Pending';
  if (status === 'Pending' || status === 'Blocked' || status === 'In Progress' || status === 'Completed') {
    return status;
  }
  return 'Pending';
}

export function toFrontendStatus(status: string): FrontendTaskStatus {
  if (status === 'Blocked') return 'Not Start';
  if (status === 'Pending') return 'On Hold';
  if (status === 'In Progress') return 'In Progress';
  if (status === 'Completed') return 'Completed';
  return 'Not Start';
}
