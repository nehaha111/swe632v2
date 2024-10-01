document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const helpButton = document.getElementById('helpButton');
    const messagePopup = document.getElementById('messagePopup');

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
                <button class="update-btn">Update Task</button>
                <button class="delete-btn" style="color: red;">Delete</button>
            </td>
        `;

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove the task from the list
                displayTasks(); // Re-display the tasks
                showMessagePopup('Task deleted successfully!');
            }
        });

        // Add edit functionality
        row.querySelector('.update-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    // Function to display all tasks
    function displayTasks() {
        taskTable.innerHTML = ''; // Clear the table
        tasks.forEach((task, index) => {
            addTaskRow(task, index); // Add each task to the table
        });
    }

    // Add or update a task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            title: document.getElementById('title').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: Array.from(document.querySelectorAll('#priority input[type="checkbox"]:checked')).map(el => el.value).join(', '),
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

        taskForm.reset(); // Clear the form
        displayTasks(); // Refresh the task table
    });

    // Function to fill the form with task data for editing
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        // Check the appropriate checkboxes
        const priorities = task.priority.split(', ');
        priorities.forEach(priority => {
            document.getElementById(priority.toLowerCase()).checked = true;
        });

        editIndex = index; // Set the current edit index
    }

    // Word count logic
    descriptionInput.addEventListener('input', function() {
        const wordCount = descriptionInput.value.split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    // Help and Documentation button
    helpButton.addEventListener('click', function() {
        alert('Help & Documentation:\n1. Fill in the task details.\n2. Click "Add Task" to save.\n3. Use "Update Task" to modify existing tasks.\n4. Select multiple priorities for filtering.');
    });

    // Show message popup
    function showMessagePopup(message) {
        messagePopup.textContent = message;
        messagePopup.classList.add('show');
        setTimeout(() => {
            messagePopup.classList.remove('show');
        }, 3000);
    }

    // Search functionality (if needed)
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchValue));
        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    });
});
