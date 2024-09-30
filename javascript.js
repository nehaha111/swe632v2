document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const confirmationMessage = document.getElementById('confirmationMessage');

    let tasks = [];
    let editIndex = null; // Track the index of the task being edited

    // Function to add a row to the task table
    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = 
            `<td>${task.title}</td>
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
            </td>`;

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1); // Remove the task from the list
            displayTasks(); // Re-display the tasks
        });

        // Add edit functionality
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        // Apply priority color to the priority cell only
        const priorityCell = row.cells[3];
        if (task.priority === 'High') {
            priorityCell.style.color = 'red';
        } else if (task.priority === 'Medium') {
            priorityCell.style.color = 'orange';
        } else if (task.priority === 'Low') {
            priorityCell.style.color = 'green';
        }
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
            priority: document.getElementById('priority').value,
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex === null) {
            // Add new task
            tasks.push(newTask);
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            editIndex = null;
        }

        taskForm.reset(); // Clear the form
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
        displayTasks(); // Refresh the task table

        // Show confirmation message
        confirmationMessage.style.display = 'block';
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 2000); // Hide message after 2 seconds
    });

    // Word count functionality for description
    descriptionInput.addEventListener('input', function() {
        const wordCount = this.value.split(/\s+/).filter(word => word.length > 0).length;
        wordCountDisplay.textContent = `${wordCount}/30 words`;
    });

    // Search and filter functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        displayTasks(); // Refresh the task list before filtering
        Array.from(taskTable.rows).forEach(row => {
            const taskTitle = row.cells[0].textContent.toLowerCase();
            const isVisible = taskTitle.includes(searchTerm);
            row.style.display = isVisible ? '' : 'none';
        });
    });

    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        displayTasks(); // Refresh the task list before filtering
        Array.from(taskTable.rows).forEach(row => {
            const taskPriority = row.cells[3].textContent;
            const isVisible = filterValue === '' || taskPriority === filterValue;
            row.style.display = isVisible ? '' : 'none';
        });
    });

    // Edit task function
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        editIndex = index; // Set edit index
        document.querySelector('button[type="submit"]').textContent = 'Update Task'; // Change button text
    }
});
