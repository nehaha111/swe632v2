document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const notification = document.getElementById('notification');

    let tasks = [];
    let editIndex = null; // Track the index of the task being edited

    // Function to add a row to the task table
    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.team}</td>
            <td>${task.description}</td>
            <td style="color:${getPriorityColor(task.priority)}">${task.priority}</td>
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
                <button class="delete-btn" style="color:red;">Delete</button>
            </td>
        `;

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove the task from the list
                displayTasks(); // Re-display the tasks
                showNotification('Task deleted successfully!'); // Show notification
            }
        });

        // Add update functionality
        row.querySelector('.update-btn').addEventListener('click', () => {
            editTask(index);
        });
    }

    // Function to get priority color
    function getPriorityColor(priority) {
        if (priority === 'High') return 'red';
        if (priority === 'Medium') return 'orange';
        if (priority === 'Low') return 'green';
        return 'black';
    }

    // Function to display all tasks
    function displayTasks() {
        taskTable.innerHTML = ''; // Clear the table
        tasks.forEach((task, index) => {
            addTaskRow(task, index); // Add each task to the table
        });
    }

    // Add a task or update existing task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            name: document.getElementById('title').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex === null) {
            // Add new task
            tasks.push(newTask);
            showNotification('Task added successfully!'); // Show notification
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            showNotification('Task updated successfully!'); // Show notification
            editIndex = null;
        }

        taskForm.reset(); // Clear the form
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
        displayTasks(); // Refresh the task table
    });

    // Function to fill the form with task data for editing
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.name;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        editIndex = index; // Set the current edit index
        document.querySelector('button[type="submit"]').textContent = 'Update Task'; // Change the button text to "Update Task"
    }

    // Word count logic
    descriptionInput.addEventListener('input', function() {
        const wordCount = descriptionInput.value.split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
        if (wordCount > 30) {
            wordCountDisplay.style.color = 'red';
        } else {
            wordCountDisplay.style.color = '#888';
        }
    });

    // Set date input to only show future dates
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.setAttribute('min', today);

    // Function to filter tasks by search or multiple priorities
    function filterTasks() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedPriorities = Array.from(filterSelect.selectedOptions).map(option => option.value);

        const filteredTasks = tasks.filter(task => 
            (task.name.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery)) &&
            (selectedPriorities.length === 0 || selectedPriorities.includes(task.priority))
        );

        // Update the table based on filtered results
        taskTable.innerHTML = ''; // Clear the table
        if (filteredTasks.length === 0) {
            const row = taskTable.insertRow();
            row.innerHTML = `<td colspan="8" style="text-align:center;">No task matching your search.</td>`;
        } else {
            filteredTasks.forEach((task, index) => addTaskRow(task, index));
        }
    }

    // Attach event listeners
    searchInput.addEventListener('input', filterTasks);
    filterSelect.addEventListener('change', filterTasks);

    // Help and Documentation
    const helpButton = document.getElementById('helpButton');
    helpButton.addEventListener('click', () => {
        showNotification('Help: To add a task, fill in the details and click "Add Task". Use the search bar to find tasks. You can filter tasks by priority. Click on "Update" to modify an existing task, or "Delete" to remove it.');
    });

    // Function to show notification messages
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Notification will be visible for 3 seconds
    }
});
