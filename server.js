const express = require('express');
const socket = require('socket.io');

const tasks = [];
let counter = 0;

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', socket => {
  socket.emit('updateData', tasks);

  socket.on('addTask', taskText => {
    const task = {
      id: counter++,
      text: taskText,
    };
    tasks.push(task);
    io.emit('addTask', task);
  });

  socket.on('removeTask', taskId => {
    const index = tasks.findIndex(item => item.id === taskId);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', taskId);
  });

});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});
