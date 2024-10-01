document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const messagePopup = document.getElementById('message');

    let tasks = [];
    let editIndex = null; // Track the index of the task being edited

    // Function to get the color based on priority
    function getPriorityColor(priority) {
        switch (priority) {
            case 'Low':
                return 'green';
            case 'Medium':
                return 'orange';
            case 'High':
                return 'red';
            default:
                return 'black';
        }
    }

    // Function to add a row to the task table
    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
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
                <button class="delete-btn" style="color: red;">Delete</button>
            </td>
        `;

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove the task from the list
                displayTasks(); // Re-display the tasks
                showMessage('Task deleted successfully!'); // Show message
            }
        });

        // Add edit functionality
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    // Function to filter tasks based on search and priority
    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterPriority = filterSelect.value;

        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
            const matchesPriority = filterPriority ? task.priority === filterPriority : true;

            return matchesSearch && matchesPriority;
        });
    }

    // Function to display all tasks
    function displayTasks() {
        taskTable.innerHTML = ''; // Clear the table
        const filteredTasks = filterTasks(); // Get filtered tasks
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index); // Add each task to the table
        });

        // Show message if no tasks match the search
        if (filteredTasks.length === 0) {
            showMessage('No tasks matching your search.', 'warning');
        } else {
            messagePopup.classList.add('hidden'); // Hide message
        }
    }

    // Add or update a task
    taskForm.addEventListener('submit', function (event) {
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
            // Add new task
            tasks.push(newTask);
            showMessage('Task added successfully!'); // Show message
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            showMessage('Task updated successfully!'); // Show message
            editIndex = null; // Reset edit index
        }

        taskForm.reset(); // Reset form
        displayTasks(); // Re-display the tasks
    });

    // Function to edit a task
    function editTask(index) {
        editIndex = index; // Set the edit index
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        // Focus on the title input for convenience
        document.getElementById('title').focus();
    }

    // Function to show message in the popup
    function showMessage(message, type = 'success') {
        messagePopup.textContent = message;
        messagePopup.classList.remove('hidden');
        messagePopup.style.backgroundColor = type === 'success' ? '#4caf50' : '#f44336'; // Green for success, red for error

        // Automatically hide the message after a few seconds
        setTimeout(() => {
            messagePopup.classList.add('hidden');
        }, 3000);
    }

    // Update word count
    descriptionInput.addEventListener('input', function () {
        const wordCount = this.value.split(/\s+/).filter(word => word.length > 0).length; // Count non-empty words
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    // Event listeners for search input and filter selection
    searchInput.addEventListener('input', displayTasks);
    filterSelect.addEventListener('change', displayTasks);
});
