import { useCallback, useEffect, useRef, useState } from 'react';
import { isValidTaskArray } from '../utils/taskUtils.js';

const STORAGE_KEY = 'taskflow-tasks';

function createTaskId(tasks) {
  const createId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  let id = createId();
  while (tasks.some((task) => String(task.id) === id)) {
    id = createId();
  }
  return id;
}

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  const [persistenceError, setPersistenceError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadTasks() {
      setLoading(true);
      setInitialized(false);
      setError('');
      setPersistenceError('');

      try {
        const savedTasks = window.localStorage.getItem(STORAGE_KEY);
        if (savedTasks !== null) {
          let parsedTasks;
          try {
            parsedTasks = JSON.parse(savedTasks);
          } catch {
            parsedTasks = null;
          }

          if (isValidTaskArray(parsedTasks)) {
            if (isCurrent) {
              skipNextPersist.current = true;
              setTasks(parsedTasks);
              setInitialized(true);
            }
            return;
          }

          window.localStorage.removeItem(STORAGE_KEY);
        }

        const response = await fetch('/tasks.json');
        if (!response.ok) {
          throw new Error(`Could not load starter tasks (HTTP ${response.status}).`);
        }

        const starterTasks = await response.json();
        if (!isValidTaskArray(starterTasks)) {
          throw new Error('The starter task data is invalid.');
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterTasks));
        if (isCurrent) {
          skipNextPersist.current = true;
          setTasks(starterTasks);
          setInitialized(true);
        }
      } catch (loadError) {
        if (isCurrent) {
          const message =
            loadError instanceof Error ? loadError.message : 'An unexpected error occurred.';
          setError(`${message} Please check your connection or browser storage and try again.`);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadTasks();
    return () => {
      isCurrent = false;
    };
  }, [retryCount]);

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setPersistenceError('');
    } catch {
      setPersistenceError(
        'Your changes are visible, but could not be saved in this browser. Check your storage settings.',
      );
    }
  }, [tasks, initialized, loading]);

  const addTask = useCallback((taskDetails) => {
    setPersistenceError('');
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: createTaskId(currentTasks),
        title: taskDetails.title,
        priority: taskDetails.priority,
        dueDate: taskDetails.dueDate || null,
        completed: false,
      },
    ]);
  }, []);

  const updateTask = useCallback((taskId, changes) => {
    setPersistenceError('');
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...changes } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setPersistenceError('');
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }, []);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return {
    tasks,
    loading,
    error,
    persistenceError,
    addTask,
    updateTask,
    deleteTask,
    retry,
  };
}
