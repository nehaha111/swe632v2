document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const undoButton = document.getElementById('undoBtn');
    const resetButton = document.getElementById('resetBtn');

    let tasks = [];
    let editIndex = null; // Track the index of the task being edited
    const undoStack = [[]]; // Stack to store states for undo

    // Function to add a row to the task table
    function addTaskRow(task, index) {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.team}</td>
            <td>${task.description}</td>
            <td>${task.priority.join(', ')}</td>
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

        // Add edit functionality
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove the task from the list
                undoStack.push([...tasks]); // Save state for undo
                displayTasks(); // Re-display the tasks
                alert('Task deleted successfully!');
            }
        });
    }

    // Function to display all tasks
    function displayTasks() {
        taskTable.innerHTML = ''; // Clear the table
        const searchQuery = searchInput.value.toLowerCase();
        const filterValues = Array.from(filterSelect.selectedOptions).map(option => option.value);

        const filteredTasks = tasks.filter(task => 
            (task.title.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery)) &&
            (filterValues.length === 0 || filterValues.some(filter => task.priority.includes(filter)))
        );

        if (filteredTasks.length === 0 && searchQuery) {
            taskTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No tasks matching your search</td></tr>';
        } else {
            filteredTasks.forEach((task, index) => addTaskRow(task, index));
        }
    }

    // Add or update a task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask = {
            title: document.getElementById('title').value,
            team: document.getElementById('team').value,
            description: document.getElementById('description').value,
            priority: Array.from(document.getElementById('priority').selectedOptions).map(option => option.value),
            deadline: document.getElementById('deadline').value,
            assignee: document.getElementById('assignee').value
        };

        if (editIndex === null) {
            // Add new task
            tasks.push(newTask);
            undoStack.push([...tasks]); // Save state for undo
            alert('Task added successfully!');
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            undoStack.push([...tasks]); // Save state for undo
            alert('Task updated successfully!');
            editIndex = null;
        }

        taskForm.reset(); // Clear the form
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
        displayTasks(); // Refresh the task table
    });

    // Function to fill the form with task data for editing
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        const prioritySelect = document.getElementById('priority');
        for (let option of prioritySelect.options) {
            option.selected = task.priority.includes(option.value);
        }
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

    // Undo function
    undoButton.addEventListener('click', function() {
        if (undoStack.length > 1) {
            tasks = undoStack[undoStack.length - 2]; // Revert to the previous state
            undoStack.pop(); // Remove the latest state (current)
            displayTasks(); // Refresh tasks
        }
    });

    // Reset function
    resetButton.addEventListener('click', function() {
        taskForm.reset(); // Clear the form
        editIndex = null; // Reset edit index
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
        displayTasks(); // Refresh the task table
    });

    // Initialize the task table
    displayTasks();
});
