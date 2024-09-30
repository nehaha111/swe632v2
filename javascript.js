document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const popup = document.querySelector('.popup');
    const noMatchPopup = document.querySelector('.no-match-popup');

    let tasks = [];
    let editIndex = null;

    // Popup message function
    function showPopup(message) {
        popup.innerHTML = `${message} <button class="close-btn">Close</button>`;
        popup.style.display = 'block';

        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // Function to add task row
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
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        // Delete task logic
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); 
                displayTasks(); 
                showPopup('Task deleted successfully!');
            }
        });

        // Edit task logic
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    // Function to display tasks
    function displayTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    // Add or update task logic
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
            showPopup('Task added successfully!');
        } else {
            tasks[editIndex] = newTask;
            showPopup('Task updated successfully!');
            editIndex = null;
        }

        taskForm.reset(); 
        displayTasks(); 
    });

    // Search function with no match popup
    function filterTasks() {
        const searchQuery = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;
        const filteredTasks = tasks.filter(task =>
            (task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery)) &&
            (filterValue === '' || task.priority === filterValue)
        );

        if (filteredTasks.length === 0) {
            noMatchPopup.style.display = 'block';
            setTimeout(() => {
                noMatchPopup.style.display = 'none';
            }, 2000);
        }

        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    searchInput.addEventListener('input', filterTasks);
    filterSelect.addEventListener('change', filterTasks);
});

