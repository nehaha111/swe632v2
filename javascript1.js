document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const descriptionInput = document.getElementById('description');
    const wordCountDisplay = document.getElementById('wordCount');
    const deadlineInput = document.getElementById('deadline');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const helpButton = document.getElementById('helpButton');
    const helpTooltip = document.getElementById('helpTooltip');

    let tasks = [];
    let editIndex = null;

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
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        // Delete task
        row.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            displayTasks();
        });

        // Edit task
        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(index);
        });

        // Apply priority color
        const priorityCell = row.cells[3];
        if (task.priority === 'High') {
            priorityCell.style.color = 'red';
        } else if (task.priority === 'Medium') {
            priorityCell.style.color = 'orange';
        } else if (task.priority === 'Low') {
            priorityCell.style.color = 'green';
        }
    }

    // Display tasks
    function displayTasks() {
        taskTable.innerHTML = '';
        tasks.forEach((task, index) => {
            addTaskRow(task, index);
        });
    }

    // Add or update a task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTask =
