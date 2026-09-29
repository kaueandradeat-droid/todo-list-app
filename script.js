const STORAGE_KEY = 'simple-todo-tasks';
const enteredKey = 'simple-todo-entered';

const welcome = document.querySelector('#welcome');
const todo = document.querySelector('#todo');
const enterButton = document.querySelector('#enter-button');
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const clearButton = document.querySelector('#clear-button');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function showTodo() {
  welcome.classList.add('hidden');
  todo.classList.remove('hidden');
  input.focus();
}

function renderTasks() {
  taskList.innerHTML = '';
  emptyState.hidden = tasks.length > 0;

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.done ? ' completed' : ''}`;
    item.innerHTML = `
      <button class="check-button" type="button" aria-label="Marcar tarefa como concluída">${task.done ? '✓' : ''}</button>
      <span class="task-text"></span>
      <button class="delete-button" type="button" aria-label="Excluir tarefa">×</button>
    `;

    item.querySelector('.task-text').textContent = task.text;
    item.querySelector('.check-button').addEventListener('click', () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });
    item.querySelector('.delete-button').addEventListener('click', () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });
    taskList.appendChild(item);
  });
}

enterButton.addEventListener('click', () => {
  localStorage.setItem(enteredKey, 'true');
  showTodo();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({ id: Date.now(), text, done: false });
  saveTasks();
  input.value = '';
  renderTasks();
});

clearButton.addEventListener('click', () => {
  if (!tasks.length || window.confirm('Excluir todas as tarefas?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
if (localStorage.getItem(enteredKey) === 'true') showTodo();
