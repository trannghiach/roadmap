import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const [value, setValue] = useState('');

  function handleAdd() {
    setCount(c => c + 1);
  }

  function handleReduce() {
    if(count > 0) {
      setCount(c => c - 1);
    }
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleAddTask() {
    setList([...list, value]);
    setValue('');
  }

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <div className='flex flex-1 flex-col justify-center items-center'>
          <div className='shadow-2xl rounded-[20px] flex flex-col justify-center items-center py-10 px-16 mb-12'>
            <p className='text-2xl font-bold mb-1.5'>Super Counter</p>
            <p className='m-3'>{count}</p>
            <div className='flex gap-2'>
              <button className='border border-black rounded-full py-0.5 px-2' onClick={handleAdd}>Add</button>
              <button className='border border-black rounded-full py-0.5 px-2' onClick={handleReduce}>Reduce</button>
            </div>
          </div>

          <div className='shadow-2xl rounded-[20px] flex flex-col justify-center items-center py-10 px-16'>
            <p className='text-2xl font-bold mb-1.5'>Todo list</p>
            <div className='flex gap-2 mb-5'>
              <input className='border-b' type='text' onChange={handleChange} value={value}/>
              <button className='border border-black rounded-full py-0.5 px-2' onClick={handleAddTask}>Add</button>
            </div>
            <ul>
              {list.map((task, index) => (
                <li key={index} className='mt-0.5 text-[14px] font-semibold italic'>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
