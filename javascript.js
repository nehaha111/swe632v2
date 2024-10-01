document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const undoBtn = document.getElementById('undo-btn');
    const resetBtn = document.getElementById('reset-btn');
    const noResultsMessage = document.getElementById('no-results-message');

    let tasks = [];
    let editIndex = null;
    let previousTasks = [];

    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.team}</td>
            <td>${task.description}</td>
            <td style="color: ${getPriorityColor(task.priority)};">${task.priority}</td>
            <td>${task.deadline}</td>
            <td>${task.assignee}</td>
            <td>
                <select>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </td>
            <td>
                <button class="edit-btn">Update Task</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                previousTasks.push(...tasks); // Save current tasks for undo
                tasks.splice(index, 1);
                displayTasks();
                alert('Task deleted successfully!');
            }
        });

        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    function displayTasks(filteredTasks = tasks) {
        taskTable.innerHTML = '';
        if (filteredTasks.length === 0) {
            noResultsMessage.textContent = 'No task matching your search.';
        } else {
            noResultsMessage.textContent = '';
            filteredTasks.forEach((task, index) => {
                addTaskRow(task, index);
            });
        }
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            name: document.getElementById('task-name').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex !== null) {
            tasks[editIndex] = newTask;
            editIndex = null; // Reset edit index
            alert('Task updated successfully!');
        } else {
            previousTasks.push(...tasks); // Save current tasks for undo
            tasks.push(newTask);
            alert('Task added successfully!');
        }

        displayTasks();
        taskForm.reset();
        updateWordCount();
    });

    function editTask(index) {
        const task = tasks[index];
        document.getElementById('task-name').value = task.name;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;
        editIndex = index; // Set the index of the task being edited
    }

    undoBtn.addEventListener('click', () => {
        if (previousTasks.length > 0) {
            tasks = previousTasks.pop();
            displayTasks();
            alert('Last action undone!');
        } else {
            alert('No actions to undo.');
        }
    });

    resetBtn.addEventListener('click', () => {
        taskForm.reset();
        editIndex = null; // Reset edit index
        noResultsMessage.textContent = '';
        displayTasks();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.name.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm
        ));

        displayTasks(filteredTasks);
    });

    descriptionInput.addEventListener('input', updateWordCount);

    function updateWordCount() {
        const wordCount = descriptionInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'High': return 'red';
            case 'Medium': return 'orange';
            case 'Low': return 'green';
            default: return 'black';
        }
    }
});
