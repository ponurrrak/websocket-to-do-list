const express = require('express');
const fs = require('fs');
const path = require('path');
const socket = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const tasks = [];
const clientDir = path.join(__dirname, 'client/build');

const app = express();

if(fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });
}

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', socket => {
  socket.emit('updateData', tasks);

  socket.on('addTask', taskText => {
    const task = {
      id: uuidv4(),
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
