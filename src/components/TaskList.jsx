import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}
