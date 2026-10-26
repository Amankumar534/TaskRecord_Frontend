'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Task, User, DashboardStats } from '@/types/task';
import {
  signupApi,
  loginApi,
  logoutApi,
  getCurrentUserApi,
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  toggleSubtaskApi,
  getDashboardStatsApi,
} from '@/lib/taskService';
import { getAuthToken } from '@/lib/api';

interface TaskContextType {
  user: User | null;
  tasks: Task[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  tasksLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchTasks: (filters?: { status?: string; priority?: string; category?: string; search?: string }) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, updated: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: { status?: string; priority?: string; category?: string; search?: string }) => {
    if (!getAuthToken()) {
      setTasks([]);
      return;
    }
    try {
      setTasksLoading(true);
      const data = await getTasksApi(filters);
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      // Keep existing tasks if any
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    if (!getAuthToken()) {
      setDashboardStats(null);
      return;
    }
    try {
      const stats = await getDashboardStatsApi();
      setDashboardStats(stats);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUserApi();
        setUser(currentUser);
        // Also fetch tasks and stats concurrently
        await Promise.allSettled([fetchTasks(), fetchDashboardStats()]);
      } catch (err: any) {
        console.warn('Authentication token expired or invalid:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchTasks, fetchDashboardStats]);

  const login = async (email: string, password: string) => {
    setError(null);
    const loggedUser = await loginApi(email, password);
    setUser(loggedUser);
    await Promise.allSettled([fetchTasks(), fetchDashboardStats()]);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    setError(null);
    const signedUser = await signupApi(fullName, email, password);
    setUser(signedUser);
    await Promise.allSettled([fetchTasks(), fetchDashboardStats()]);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    setTasks([]);
    setDashboardStats(null);
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const created = await createTaskApi({
      name: newTask.name,
      description: newTask.description,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      status: newTask.status,
      priority: newTask.priority,
      category: newTask.category,
      subtasks: newTask.subtasks?.map((s) => ({
        title: s.title,
        isCompleted: s.isCompleted,
      })),
    });

    setTasks((prev) => [created, ...prev]);
    fetchDashboardStats();
    return created;
  };

  const updateTask = async (id: string, updated: Partial<Task>) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );

    try {
      const saved = await updateTaskApi(id, {
        name: updated.name,
        description: updated.description,
        startDate: updated.startDate,
        endDate: updated.endDate,
        status: updated.status,
        priority: updated.priority,
        category: updated.category,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? saved : t))
      );
      fetchDashboardStats();
    } catch (err) {
      console.error('Update task failed:', err);
      // Rollback to server state
      fetchTasks();
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTaskApi(id);
      fetchDashboardStats();
    } catch (err) {
      console.error('Delete task failed:', err);
      fetchTasks();
      throw err;
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    const targetSub = targetTask?.subtasks?.find((s) => s.id === subtaskId);
    if (!targetSub) return;

    const newCompleted = !targetSub.isCompleted;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, isCompleted: newCompleted } : sub
          ),
        };
      })
    );

    try {
      await toggleSubtaskApi(taskId, subtaskId, newCompleted);
      fetchDashboardStats();
    } catch (err) {
      console.error('Toggle subtask failed:', err);
      fetchTasks();
    }
  };

  return (
    <TaskContext.Provider
      value={{
        user,
        tasks,
        dashboardStats,
        isLoading,
        tasksLoading,
        error,
        login,
        signup,
        logout,
        fetchTasks,
        fetchDashboardStats,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
