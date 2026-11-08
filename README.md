# TaskFlow

TaskFlow is a responsive task manager built as a React intern assessment project. It starts with the supplied sample tasks and keeps task changes in the browser, so it works without a backend or account.

## Features

- Loads the starter tasks from `public/tasks.json` on first use and shows loading, error, and retry states.
- Saves tasks in `localStorage` and uses saved data on later visits.
- Adds, edits, completes, and confirms deletion of tasks.
- Filters by all, active, or completed status; searches titles as you type.
- Sorts by nearest due date or by High-to-Low priority.
- Marks incomplete past-due tasks as overdue using local date-only comparisons.
- Includes task progress, useful empty states, keyboard focus styling, and a mobile-friendly layout.

## Technologies

- React 18 with functional components and Hooks.
- Vite.
- JavaScript, CSS, and browser `localStorage`.
- Node's built-in test runner for utility tests.

## Run locally

```bash
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). To run the utility tests and production build:

```bash
npm test
npm run build
```

## Project structure

```text
public/
  tasks.json
src/
  components/
    EmptyState.jsx
    ErrorMessage.jsx
    Header.jsx
    Loader.jsx
    TaskFilters.jsx
    TaskForm.jsx
    TaskItem.jsx
    TaskList.jsx
    TaskToolbar.jsx
  hooks/
    useTasks.js
  styles/
    components.css
    global.css
  utils/
    taskUtils.js
  App.jsx
  main.jsx
test/
  taskUtils.test.js
index.html
vite.config.js
```

## How persistence works

The `useTasks` hook checks the `taskflow-tasks` localStorage key before requesting `/tasks.json`. A valid saved task array is loaded directly. If there is no saved array or its data is invalid, the starter JSON is fetched and saved as the new initial data. CRUD changes are persisted after initialization; storage failures are shown in the interface instead of being silently ignored.

## Architecture and React concepts

- `App.jsx` composes the interface, owns the filter/search/sort controls, and derives the visible tasks with `useMemo`.
- `useTasks.js` encapsulates asynchronous initialization, retry, localStorage persistence, and immutable CRUD operations. Functional state updates avoid stale task arrays.
- `taskUtils.js` contains pure functions for validation, overdue checks, task counts, filtering, sorting, and date formatting.
- `TaskItem.jsx` manages only its temporary inline-edit state; saving sends a change to the shared task hook.
- `useState` holds interactive state, `useEffect` performs loading and persistence, and `useMemo` derives display data without storing duplicate state.

## Assumptions and limitations

- Data is stored only in the current browser and is not synchronized across devices.
- Removing or clearing `taskflow-tasks` starts the app from the sample JSON again.
- Starter tasks can be in the past by design; overdue status is calculated against today's local date and is not saved.
- The interface uses Google Fonts when online and falls back to system sans-serif fonts offline.
- No backend, account system, recurring tasks, or shared collaboration is included.

## Git

This workspace was not initialized as a Git repository, so no commits were created.
