import TaskItem from "./TaskItem"

const TaskList = ({ tasks, fetchTasks }) => {
  return (
    <div className="flex flex-col justify-center items-center px-36 py-12 shadow-2xl shadow-gray-800 gap-8 rounded-[36px]">
        {tasks.length === 0 ? (
            <p className="text-2xl text-red-600 font-semibold">No Tasks!</p>
        ) : (
            tasks.map(task => (
                <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
            ))
        )}
    </div>
  )
}

export default TaskList;