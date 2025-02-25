import axios from "axios";

const TaskItem = ({ task, fetchTasks }) => {

    const handleToggle = async (e) => {
        try {
            const res = await axios.patch(`http://localhost:3000/tasks/${task.id}`, { done: e.target.checked }, {
                headers: {"Content-Type": "application/json"}
            });
            fetchTasks();
        } catch(err) {
            console.log('Error changing task status: ', err);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:3000/tasks/${task.id}`);
            fetchTasks();
        } catch(err) {
            console.log('Error deleting task ', task.id, ' : ', err);
        }
    }

  return (
    <div className="flex justify-center items-center border-t border-r border-t-black border-r-black gap-2">
        <p>{task.id}</p>
        <p>{task.content}</p>
        <input type="checkbox" checked={task.done} onChange={handleToggle} />
        <button className="w-6 h-6 flex items-center justify-center rounded-full text-red-600 border-red-600 hover:text-white hover:bg-red-600 hover:border-white"
            onClick={handleDelete}
            >X</button>
    </div>
  )
}

export default TaskItem;