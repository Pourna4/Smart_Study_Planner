const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const quotes = [
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out."
];

/* Typewriter effect for quotes */
function typeWriter(text, i=0) {
  const quoteEl = document.getElementById('quote');
  if(i < text.length) {
    quoteEl.innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(text,i+1), 50);
  }
}
function displayQuote() {
  document.getElementById('quote').innerHTML = '';
  const randomIndex = Math.floor(Math.random() * quotes.length);
  typeWriter(quotes[randomIndex]);
}
displayQuote();

/* Load tasks from localStorage */
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => createTaskElement(task));
updateProgress();

/* Add new task */
function addTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const subject = document.getElementById('taskSubject').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const deadline = document.getElementById('taskDeadline').value;

  if(!title || !subject || !deadline) {
    document.querySelector('.container').classList.add('shake');
    setTimeout(()=>document.querySelector('.container').classList.remove('shake'),500);
    return;
  }

  const task = {title, subject, priority, deadline, completed:false};
  tasks.push(task);
  localStorage.setItem('tasks',JSON.stringify(tasks));
  createTaskElement(task);

  document.getElementById('taskTitle').value='';
  document.getElementById('taskSubject').value='';
  document.getElementById('taskDeadline').value='';
  updateProgress();
}

/* Create task element */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="task-icons">
      <img src="https://img.icons8.com/emoji/48/000000/memo-emoji.png" alt="task icon">
      <strong>${task.title}</strong> [${task.subject}] 
      <img src="https://img.icons8.com/emoji/48/000000/alarm-clock-emoji.png" alt="deadline icon">
      ${task.deadline} 
      <img src="https://img.icons8.com/emoji/48/000000/exclamation-mark-emoji.png" alt="priority icon">
      ${task.priority}
    </div>
    <div>
      <button onclick="toggleComplete(this)">✔</button>
      <button onclick="deleteTask(this)">🗑</button>
    </div>
  `;
  if(task.completed) li.classList.add('completed');
  if(document.body.classList.contains('dark')) li.classList.add('dark');
  taskList.appendChild(li);
}

/* Toggle complete */
function toggleComplete(button) {
  const li = button.closest('li');
  li.classList.toggle('completed');
  const index = Array.from(taskList.children).indexOf(li);
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks',JSON.stringify(tasks));
  updateProgress();
}

/* Delete task */
function deleteTask(button) {
  const li = button.closest('li');
  li.style.animation='fadeOut 0.5s forwards';
  const index = Array.from(taskList.children).indexOf(li);
  tasks.splice(index,1);
  localStorage.setItem('tasks',JSON.stringify(tasks));
  setTimeout(()=>{li.remove();updateProgress();},500);
}

/* Search */
function searchTasks() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  Array.from(taskList.children).forEach(li=>{
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(query)? 'flex':'none';
  });
}

/* Dark mode toggle */
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  document.getElementById('header').classList.toggle('dark');
  Array.from(taskList.children).forEach(li=>li.classList.toggle('dark'));
}

/* Update progress bar */
function updateProgress() {
  if(tasks.length===0){progressBar.style.width='0%'; return;}
  const completedTasks = tasks.filter(t=>t.completed).length;
  const progress = (completedTasks/tasks.length)*100;
  progressBar.style.width=progress+'%';
}
