const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let nextId = 1;

let tasks = [];

//make /tasks default route
app.get('/', (req, res) => {
    res.render('index', { tasks: req.body.tasks });
});

//api send data to views (full tasks)
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

//api receive data from views to add
app.post('/tasks', (req, res) => {
    const newTask = { id: nextId, content: req.body.content, done: req.body.done };
    nextId++;
    tasks.push(newTask);
    res.json(tasks);
})

//api receive data from view to update
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if(!task) return res.status(404).json({ message: 'Task not found (ID invalid!)'});
    if(typeof req.body.content !== "undefined") task.content = req.body.content;
    if(typeof req.body.done !== "undefined") task.done = req.body.done;
    res.json(task);
});

//api receive data from views (single task by id)
app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if(!task) return res.status(404).json({ message: 'Task not found (ID invalid!)'});
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.json({ message: 'Deleted successfully!' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
