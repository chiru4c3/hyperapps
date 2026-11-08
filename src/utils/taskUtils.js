const PRIORITY_ORDER = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidTaskArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }

  const ids = new Set();
  return value.every((task) => {
    if (
      task === null ||
      typeof task !== 'object' ||
      !['string', 'number'].includes(typeof task.id) ||
      String(task.id).trim() === '' ||
      ids.has(task.id) ||
      typeof task.title !== 'string' ||
      task.title.trim() === '' ||
      !Object.hasOwn(PRIORITY_ORDER, task.priority) ||
      typeof task.completed !== 'boolean'
    ) {
      return false;
    }

    if (
      task.dueDate !== null &&
      (typeof task.dueDate !== 'string' || !isValidDateString(task.dueDate))
    ) {
      return false;
    }

    ids.add(task.id);
    return true;
  });
}

export function isValidDateString(value) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(task, today = getLocalDateString()) {
  return !task.completed && task.dueDate !== null && task.dueDate < today;
}

export function getRemainingTaskCount(tasks) {
  return tasks.reduce((count, task) => count + Number(!task.completed), 0);
}

export function getFilteredAndSortedTasks(tasks, filter, search, sortBy) {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);
    const matchesSearch = task.title.toLocaleLowerCase().includes(normalizedSearch);
    return matchesFilter && matchesSearch;
  });

  return filteredTasks.sort((first, second) => {
    if (sortBy === 'priority') {
      return PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority];
    }

    if (first.dueDate === null && second.dueDate !== null) {
      return 1;
    }
    if (first.dueDate !== null && second.dueDate === null) {
      return -1;
    }
    if (first.dueDate === null || second.dueDate === null) {
      return 0;
    }
    return first.dueDate.localeCompare(second.dueDate);
  });
}

export function formatDueDate(dueDate) {
  if (!dueDate) {
    return 'No due date';
  }

  const [year, month, day] = dueDate.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}
