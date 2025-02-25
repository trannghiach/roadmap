import axios from "axios";
import { useState } from "react";

const TaskForm = ({ fetchTasks }) => {
    const [content, setContent] = useState('');

    function handleChange(e) {
        setContent(e.target.value);
    }

    const handleAdd = async () => {
        if(!content.trim()) {
            alert('Task content cannot be empty!');
            return;
        }
        try {
            await axios.post('http://localhost:3000/tasks', { content }, {
                headers: {"Content-Type": "application/json"}
            });
            setContent('');
            fetchTasks();
        } catch(err) {
            console.log('Error adding new task: ', err);
        }
    }

  return (
    <div className="flex gap-12 px-12 py-8 items-center justify-center shadow-2xl shadow-gray-400 rounded-[36px]">
        <p className="text-xl">New Task: </p>
        <input 
            type="text" 
            className="border-b-1 border-b-black outline-none" 
            onChange={handleChange} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            value={content} />
        <button className="border border-black rounded-full px-3 py-1 hover:text-white hover:border-white hover:bg-gray-800"
            onClick={handleAdd}>
                Add
            </button>
    </div>
  )
}

export default TaskForm;