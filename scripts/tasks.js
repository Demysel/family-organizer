// scripts/tasks.js
async function loadTasks() {
    try {
        const data = await loadData();
        const taskList = document.getElementById('taskList');
        
        if (!taskList) {
            console.error("Élément 'taskList' introuvable");
            return;
        }

        taskList.innerHTML = '';
        
        data.tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
                <span class="${task.done ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${index})">🗑️</button>
            `;
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error("Erreur de chargement des tâches:", error);
    }
}

async function deleteTask(index) {
    const data = await loadData();
    data.tasks.splice(index, 1);
    await saveData(data);
    loadTasks();
}

// Exporter les fonctions pour le scope global
window.loadTasks = loadTasks;
window.addTask = addTask;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
