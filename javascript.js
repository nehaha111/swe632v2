document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const helpButton = document.getElementById('helpButton');
    const messagePopup = document.getElementById('messagePopup');
    const priorityFilter = document.getElementById('priorityFilter');

    let tasks = [];
    let editIndex = null;

    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.team}</td>
            <td>${task.description}</td>
            <td>${task.priority}</td>
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
                <button class="update-btn">Update</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1);
                displayTasks();
                showMessagePopup('Task deleted successfully!');
            }
        });

        row.querySelector('.update-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    function displayTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            title: document.getElementById('title').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex === null) {
            tasks.push(newTask);
            showMessagePopup('Task added successfully!');
        } else {
            tasks[editIndex] = newTask;
            showMessagePopup('Task updated successfully!');
            editIndex = null;
        }

        taskForm.reset();
        displayTasks();
    });

    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        editIndex = index;
        document.getElementById('addButton').textContent = 'Update Task';
    }

    descriptionInput.addEventListener('input', function() {
        const words = this.value.trim().split(/\s+/);
        const wordCount = words.length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    helpButton.addEventListener('click', function() {
        alert('Help & Documentation:\n1. Fill in the task details.\n2. Click "Add Task" to save.\n3. Use "Update" to modify existing tasks.\n4. Use checkboxes to filter tasks by priority.');
    });

    function showMessagePopup(message) {
        messagePopup.textContent = message;
        messagePopup.classList.add('show');
        setTimeout(() => {
            messagePopup.classList.remove('show');
        }, 3000);
    }

    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchValue) ||
            task.description.toLowerCase().includes(searchValue)
        );
        displayFilteredTasks(filteredTasks);
    });

    priorityFilter.addEventListener('change', function() {
        const selectedPriorities = Array.from(this.querySelectorAll('input:checked')).map(input => input.value);
        const filteredTasks = tasks.filter(task => selectedPriorities.length === 0 || selectedPriorities.includes(task.priority));
        displayFilteredTasks(filteredTasks);
    });

    function displayFilteredTasks(filteredTasks) {
        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    document.getElementById('resetButton').addEventListener('click', function() {
        taskForm.reset();
        editIndex = null;
        document.getElementById('addButton').textContent = 'Add Task';
        showMessagePopup('Form reset successfully!');
    });
});
