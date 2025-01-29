let tasks = [];

function initTasks() {
    window.addTask = addTask;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
}

async function loadTasks() {
    try {
        const data = await loadData();
        tasks = data.tasks || [];
        renderTasks();
    } catch (error) {
        console.error('Erreur loadTasks:', error);
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = tasks.map((task, index) => `
        <div class="task ${task.done ? 'completed' : ''}">
            <input type="checkbox" 
                   ${task.done ? 'checked' : ''} 
                   onchange="toggleTask(${index})">
            <span>${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">🗑️</button>
        </div>
    `).join('');
}

async function addTask() {
    try {
        const input = document.getElementById('newTask');
        if (!input.value.trim()) return;

        tasks.push({ text: input.value, done: false });
        await saveData({ tasks });
        input.value = '';
        renderTasks();
    } catch (error) {
        console.error('Erreur addTask:', error);
    }
}

async function toggleTask(index) {
    try {
        tasks[index].done = !tasks[index].done;
        await saveData({ tasks });
        renderTasks();
    } catch (error) {
        console.error('Erreur toggleTask:', error);
    }
}

async function deleteTask(index) {
    try {
        tasks.splice(index, 1);
        await saveData({ tasks });
        renderTasks();
    } catch (error) {
        console.error('Erreur deleteTask:', error);
    }
}

initTasks();
