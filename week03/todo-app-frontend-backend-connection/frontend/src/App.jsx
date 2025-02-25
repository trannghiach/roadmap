import { useEffect, useState } from "react"
import axios from 'axios'
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/tasks');
      setTasks(res.data);
    } catch(err) {
      console.log('Error fetching tasks: ', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="min-h-screen flex">
        <div className="flex flex-col flex-1 justify-center items-center gap-[36px]">
          <p className="text-5xl font-semibold">Todo App</p>
          <TaskForm fetchTasks={fetchTasks} />
          <TaskList tasks={tasks} fetchTasks={fetchTasks} />
        </div>
      </div>
    </>
  )
}

export default App
