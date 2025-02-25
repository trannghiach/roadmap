const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/todo-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB: ', err));

app.use(express.urlencoded({ extended: true }));

const taskSchema = new mongoose.Schema({
    content: String,
    done: Boolean
})

const Task = mongoose.model('Task', taskSchema);

console.log(Task);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));