const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/todo-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB: ', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const taskSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    }
});

//presave api to auto-incrementing the id
taskSchema.pre('save', async (next) => {
    try {
        if(!this.id) {
            const lastId = Task.findOne().sort('-id');
            this.id = lastId ? lastId + 1 : 1;
        }
        next();
    } catch(err) {
        throw new Error('Error using pre-save middleware!: ', err);
    }
})

const Task = mongoose.model('Task', taskSchema);
console.log(Task);

app
    .route('/tasks')
    .get(async (req, res) => {
        try {
            const allTasks = await Task.find({});
            res.status(200).json(allTasks);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
       try {
            if(!req.body.content) {
                return res.status(400).json({ error: 'Content is required' });
            }
            const newTask = await Task.create({
                content: req.body.content,
                done: req.body.done ?? false
            });
            nextId++;
            res.status(201).json(newTask);
       } catch(err) {
            res.status(500).json({ error: err.message });
       }
    })
    .delete(async (req, res) => {
        try {
            await Task.deleteMany({});
            res.status(200).json({ msg: 'Succesfully deleted all tasks!' });
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    })

app.
    route('/tasks/:id')
    .get(async (req, res) => {
        try {
            const task = await Task.findOne({id: parseInt(req.params.id)});
            res.status(200).json(task);
        } catch(err) {
            res.status(500).json({ error: err.message });
        }
    })
    .patch(async (req, res) => {
        try {
            const updatedTask = await Task.findOneAndUpdate(
                { id: parseInt(req.params.id) },
                { $set: req.body },
                { new: true }
            );
            
            if(!updatedTask) return res.status(404).json({ error: 'Task not found (invalid ID!)' });

            res.status(200).json(updatedTask);
        } catch(err) {
            res.status(400).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const deletedTask = await Task.findOneAndDelete(
                { id: parseInt(req.params.id) }
            );

            if(!deletedTask) return res.status(404).json({ error: 'Task not found (invalid ID!)' });

            res.status(200).json({ message: 'Succesfully deleted the task: ', deletedTask });
        } catch(err) {
            res.status(400).json({ error: err.message });
        }
    });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running or port ${PORT}`));
