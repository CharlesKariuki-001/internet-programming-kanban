import { useCallback, useEffect, useRef, useState } from 'react';
import { Status, Task } from '../components/data';
import { taskApi } from '../services/api';
import { useConnection } from '../context/ConnectionContext';
import { useToast } from '../context/ToastContext';
import { useBoards } from '../context/BoardsContext';

/**
 * useTasks — board-scoped task store with optimistic mutations.
 * Subscribes to the active board from BoardsContext and re-fetches
 * automatically when the user switches boards or connection mode.
 */
export function useTasks() {
  const { mode } = useConnection();
  const { activeBoardId } = useBoards();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

  const refetch = useCallback(async () => {
    if (!activeBoardId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.list(mode, activeBoardId);
      setTasks(data);
    } catch (err) {
      const message =
      err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      toast(message, 'error', { label: 'Retry', onClick: () => void refetch() });
    } finally {
      setIsLoading(false);
    }
  }, [mode, activeBoardId, toast]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createTask = useCallback(
    async (task: Task) => {
      setTasks((prev) => [task, ...prev]);
      try {
        const saved = await taskApi.create(mode, task);
        setTasks((prev) => prev.map((t) => t.id === task.id ? saved : t));
        toast(`Task "${saved.title}" added`, 'success');
      } catch (err) {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        const message =
        err instanceof Error ? err.message : 'Failed to create task';
        setError(message);
        toast(message, 'error', {
          label: 'Retry',
          onClick: () => void createTask(task)
        });
      }
    },
    [mode, toast]
  );

  const updateStatus = useCallback(
    async (id: string, status: Status) => {
      const previous = tasksRef.current;
      const target = previous.find((t) => t.id === id);
      const completedAt =
      status === 'Done' ? new Date().toISOString().slice(0, 10) : undefined;
      setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, status, completedAt } : t)
      );
      try {
        await taskApi.update(mode, id, { status, completedAt });
        if (target) toast(`Moved "${target.title}" to ${status}`, 'success');
      } catch (err) {
        setTasks(previous);
        const message =
        err instanceof Error ? err.message : 'Failed to update task';
        setError(message);
        toast(message, 'error', {
          label: 'Retry',
          onClick: () => void updateStatus(id, status)
        });
      }
    },
    [mode, toast]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const previous = tasksRef.current;
      const target = previous.find((t) => t.id === id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      try {
        await taskApi.remove(mode, id);
        if (target) toast(`Task "${target.title}" deleted`, 'success');
      } catch (err) {
        setTasks(previous);
        const message =
        err instanceof Error ? err.message : 'Failed to delete task';
        setError(message);
        toast(message, 'error', {
          label: 'Retry',
          onClick: () => void deleteTask(id)
        });
      }
    },
    [mode, toast]
  );

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateStatus,
    deleteTask
  };
}

/**
 * useAllTasks — fetches every task across every board.
 * Used by Dashboard and Analytics views.
 */
export function useAllTasks() {
  const { mode } = useConnection();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    taskApi.
    list(mode).
    then((data) => {
      if (!cancelled) setTasks(data);
    }).
    catch(() => {
      if (!cancelled) setTasks([]);
    }).
    finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return { tasks, isLoading };
}