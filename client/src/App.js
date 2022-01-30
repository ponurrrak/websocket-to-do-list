import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  state = {
    tasks: [],
    newTask: '',
  };

  updateData(tasks) {
    this.setState({
      ...this.state,
      tasks,
    });
  }

  addTask(task) {
    this.setState({
      ...this.state,
      tasks: [...this.state.tasks, task],
    });
  }

  removeTask(taskId) {
    this.setState({
      ...this.state,
      tasks: this.state.tasks.filter(item => (
        item.id !== taskId
      )),
    });
  }

  handleInputChange(newInputValue) {
    this.setState({
      ...this.state,
      newTask: newInputValue,
    });
  }

  handleRemove(taskId) {
    this.removeTask(taskId);
    this.socket.emit('removeTask', taskId);
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.newTask) {
      this.socket.emit('addTask', this.state.newTask);
      this.handleInputChange('');
    }
  }

  componentDidMount() {
    if(window.location.origin === 'http://localhost:3000') {
      this.socket = io('http://localhost:8000');
    } else {
      this.socket = io();
    }

    this.socket.on('updateData', tasks => {
      this.updateData(tasks);
    });

    this.socket.on('addTask', task => {
      this.addTask(task);
    });

    this.socket.on('removeTask', taskId => {
      this.removeTask(taskId);
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li
                key={task.id}
                className="task"
              >
                {task.text}
                <button
                  className="btn btn--red"
                  onClick={() => this.handleRemove(task.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form
            id="add-task-form"
            onSubmit={e => this.handleSubmit(e)}
          >
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.newTask}
              onChange={e => this.handleInputChange(e.target.value)}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }

}

export default App;
