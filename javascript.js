document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const noResultsMessage = document.getElementById('noResults');
    const resetButton = document.getElementById('resetButton');

    let tasks = [];
    let editIndex = null; // Track the index of the task being edited

    // Function to add a row to the task table
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
                <button class="edit-btn">Update</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        // Add delete functionality
        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1); // Remove the task from the list
                displayTasks(); // Re-display the tasks
                showMessage('Task deleted successfully!');
            }
        });

        // Add edit functionality
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        // Apply priority color to the priority cell
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
            showMessage('Task added successfully!');
        } else {
            // Update the existing task
            tasks[editIndex] = newTask;
            showMessage('Task updated successfully!');
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
        wordCountDisplay.style.color = wordCount > 30 ? 'red' : '#888';
    });

    // Set date input to only show future dates
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.setAttribute('min', today);

    // Function to filter tasks by search or priority
    function filterTasks() {
        const searchQuery = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredTasks = tasks.filter(task => 
            (task.title.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery)) &&
            (filterValue === '' || task.priority === filterValue)
        );

        taskTable.innerHTML = ''; // Clear the table

        if (filteredTasks.length > 0) {
            filteredTasks.forEach((task, index) => {
                addTaskRow(task, tasks.indexOf(task));
            });
            noResultsMessage.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', filterTasks);
    filterSelect.addEventListener('change', filterTasks);

    // Function to display a popup message
    function showMessage(message) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <p>${message}</p>
            <button class="close-btn">Close</button>
        `;
        document.body.appendChild(popup);

        // Close button functionality
        popup.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Automatically remove popup after 3 seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 3000);
    }

    // Help and Documentation Popup Logic
    document.getElementById('helpButton').addEventListener('click', function() {
        document.getElementById('helpPopup').style.display = 'block';
        document.getElementById('helpMessage').textContent = "Hey!"; // Show "Hello" message
    });

    // Close help popup
    document.getElementById('closePopup').addEventListener('click', function() {
        document.getElementById('helpPopup').style.display = 'none';
    });

    // Add this inside the DOMContentLoaded event listener
    resetButton.addEventListener('click', function() {
        taskForm.reset(); // Reset the form fields to their initial values
        document.querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text to 'Add Task'
        editIndex = null; // Clear the edit index
        noResultsMessage.style.display = 'none'; // Hide no results message
    });
});
