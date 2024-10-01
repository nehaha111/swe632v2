document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const noMatchMessage = document.getElementById('noMatchMessage');
    
    let tasks = [];
    let editIndex = null; // Track the index of the task being edited
    let undoStack = [];
    let redoStack = [];

    // Help Modal Logic
    const helpModal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeModal = document.querySelector('.close');

    helpBtn.addEventListener('click', function() {
        helpModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        helpModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == helpModal) {
            helpModal.style.display = 'none';
        }
    });

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
            redoStack = []; // Clear redo stack
            alert('Task added successfully!');
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            undoStack.push([...tasks]); // Save state for undo
            redoStack = []; // Clear redo stack
            alert('Task updated successfully!');
            editIndex = null;
        }

        taskForm.reset(); // Clear the form
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
        displayTasks(); // Refresh the task table
    });

    // Function to display tasks
    function displayTasks() {
        taskTable.innerHTML = ''; // Clear the table
        let hasMatch = false;

        tasks.forEach((task, index) => {
            if (filterTasks(task)) {
                addTaskRow(task, index); // Add each task to the table
                hasMatch = true;
            }
        });

        if (!hasMatch) {
            noMatchMessage.textContent = 'No task matching your search';
        } else {
            noMatchMessage.textContent = '';
        }
    }

    function filterTasks(task) {
        const searchQuery = searchInput.value.toLowerCase();
        const filterValues = Array.from(filterSelect.selectedOptions).map(option => option.value);

        return (task.title.toLowerCase().includes(searchQuery) ||
                task.description.toLowerCase().includes(searchQuery)) &&
                (filterValues.length === 0 || filterValues.some(filter => task.priority.includes(filter)));
    }

    // Add task row to the table
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
                <button class="delete-btn">Delete</button>
            </td>
        `;

        // Edit Task
        row.querySelector('.edit-btn').addEventListener('click', () => editTask(index));

        // Delete Task
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove task
                undoStack.push([...tasks]); // Save state for undo
                redoStack = []; // Clear redo stack
                alert('Task deleted successfully!');
                displayTasks(); // Refresh tasks
            }
        });

        // Apply priority color
        const priorityCell = row.cells[3];
        if (task.priority.includes('High')) {
            priorityCell.style.color = 'red';
        } else if (task.priority.includes('Medium')) {
            priorityCell.style.color = 'orange';
        } else if (task.priority.includes('Low')) {
            priorityCell.style.color = 'green';
        }
    }

    // Edit task
    function editTask(index) {
        const task = tasks[index];
        document.getElementById('title').value = task.title;
        document.getElementById('team').value = task.team;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('assignee').value = task.assignee;

        editIndex = index; // Set the current edit index
        document.querySelector('button[type="submit"]').textContent = 'Update Task'; // Change button text to "Update Task"
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
    document.getElementById('undoBtn').addEventListener('click', function() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop()); // Save current state to redo stack
            tasks = undoStack[undoStack.length - 1]; // Revert to previous state
            displayTasks(); // Refresh tasks
        }
    });

    // Redo function
    document.getElementById('redoBtn').addEventListener('click', function() {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop()); // Restore the next state
            tasks = undoStack[undoStack.length - 1]; // Apply the next state
            displayTasks(); // Refresh tasks
        }
    });

    // Reset function
    document.getElementById('resetBtn').addEventListener('click', function() {
        taskForm.reset();
        document.querySelector('button[type="submit"]').textContent = 'Add Task';
    });

    // Set date input to only show future dates
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.setAttribute('min', today);
});

