import { useMemo, useState } from 'react';
import EmptyState from './components/EmptyState.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import TaskToolbar from './components/TaskToolbar.jsx';
import useTasks from './hooks/useTasks.js';
import {
  getFilteredAndSortedTasks,
  getRemainingTaskCount,
} from './utils/taskUtils.js';

export default function App() {
  const {
    tasks,
    loading,
    error,
    persistenceError,
    addTask,
    updateTask,
    deleteTask,
    retry,
  } = useTasks();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const remainingCount = useMemo(() => getRemainingTaskCount(tasks), [tasks]);
  const completedCount = tasks.length - remainingCount;
  const filteredTasks = useMemo(
    () => getFilteredAndSortedTasks(tasks, activeFilter, search, sortBy),
    [tasks, activeFilter, search, sortBy],
  );
  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: remainingCount,
      completed: completedCount,
    }),
    [tasks.length, remainingCount, completedCount],
  );

  return (
    <div className="app-shell">
      <div className="app-container">
        <Header
          remainingCount={remainingCount}
          totalCount={tasks.length}
          completedCount={completedCount}
        />
        {error ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : (
          <>
            <TaskForm onAddTask={addTask} />
            {persistenceError && (
              <p className="persistence-warning" role="alert">{persistenceError}</p>
            )}
            <main className="tasks-section">
              <TaskToolbar
                activeFilter={activeFilter}
                counts={counts}
                onFilterChange={setActiveFilter}
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <div id="task-list-panel" role="tabpanel" aria-labelledby={`filter-${activeFilter}`}>
                {loading ? (
                  <Loader />
                ) : filteredTasks.length > 0 ? (
                  <TaskList
                    tasks={filteredTasks}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                ) : (
                  <EmptyState
                    hasTasks={tasks.length > 0}
                    hasSearch={search.trim().length > 0}
                    filter={activeFilter}
                  />
                )}
              </div>
            </main>
            <footer className="app-footer">
              <span>Small steps add up.</span>
              <span>Made for a little more focus <span aria-hidden="true">✦</span></span>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
