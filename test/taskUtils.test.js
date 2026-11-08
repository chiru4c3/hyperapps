import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  formatDueDate,
  getFilteredAndSortedTasks,
  getLocalDateString,
  getRemainingTaskCount,
  isOverdue,
  isValidDateString,
  isValidTaskArray,
} from '../src/utils/taskUtils.js';

const starterTasks = JSON.parse(
  await readFile(new URL('../public/tasks.json', import.meta.url), 'utf8'),
);

test('starter data has the required totals and completion count', () => {
  assert.equal(starterTasks.length, 5);
  assert.equal(getRemainingTaskCount(starterTasks), 3);
  assert.equal(isValidTaskArray(starterTasks), true);
});

test('only the incomplete January task is overdue on the assessment date', () => {
  const overdueTasks = starterTasks.filter((task) => isOverdue(task, '2026-11-08'));
  assert.deepEqual(overdueTasks.map((task) => task.title), ['Fix checkout bug']);
});

test('due-date sort places dated tasks first, in order, and undated tasks last', () => {
  const sorted = getFilteredAndSortedTasks(starterTasks, 'all', '', 'dueDate');
  assert.deepEqual(
    sorted.map((task) => task.title),
    [
      'Set up project repo',
      'Fix checkout bug',
      'Design login screen',
      'Write API docs',
      'Plan team outing',
    ],
  );
  assert.deepEqual(starterTasks.map((task) => task.id), [1, 2, 3, 4, 5]);
});

test('filters and case-insensitive search work together', () => {
  assert.equal(getFilteredAndSortedTasks(starterTasks, 'active', '', 'dueDate').length, 3);
  assert.equal(getFilteredAndSortedTasks(starterTasks, 'completed', '', 'dueDate').length, 2);
  assert.deepEqual(
    getFilteredAndSortedTasks(starterTasks, 'active', 'LOGIN', 'dueDate').map((task) => task.title),
    ['Design login screen'],
  );
  assert.deepEqual(
    getFilteredAndSortedTasks(starterTasks, 'completed', 'repo', 'dueDate').map((task) => task.title),
    ['Set up project repo'],
  );
});

test('priority sorting ranks High, Medium, then Low without mutating input', () => {
  const sorted = getFilteredAndSortedTasks(starterTasks, 'all', '', 'priority');
  assert.deepEqual(
    sorted.map((task) => task.priority),
    ['High', 'High', 'Medium', 'Low', 'Low'],
  );
  assert.deepEqual(starterTasks.map((task) => task.id), [1, 2, 3, 4, 5]);
});

test('date-only comparisons are validated and formatted without UTC drift', () => {
  assert.equal(isValidDateString('2026-02-28'), true);
  assert.equal(isValidDateString('2026-02-30'), false);
  assert.equal(isValidDateString('2026/02/28'), false);
  assert.equal(getLocalDateString(new Date(2026, 0, 3, 23, 30)), '2026-01-03');
  assert.equal(formatDueDate('2026-01-10'), new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(2026, 0, 10)));
});

test('invalid saved task shapes are rejected', () => {
  assert.equal(isValidTaskArray([{ ...starterTasks[0], priority: 'Urgent' }]), false);
  assert.equal(isValidTaskArray([{ ...starterTasks[0], dueDate: '2026-02-30' }]), false);
  assert.equal(isValidTaskArray([{ ...starterTasks[0], id: 1 }, { ...starterTasks[0], id: 1 }]), false);
});
