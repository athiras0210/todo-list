// This function is called when the window has finished loading
window.onload = function () {
    // Load the to-do lists from local storage
    loadLists();
};

// Function to load the to-do lists from local storage and display them on the page
function loadLists() {
    // Retrieve all tasks from local storage
    var allList = JSON.parse(localStorage.getItem('todo')) || [];

    // If tasks exist, filter them into two lists: todoList and doneList
    if (allList) {
        var todoList = allList.filter(l => l.status == true) || [];
        var doneList = allList.filter(l => l.status == false) || [];
        if (todoList.length > 0) {
            document.getElementById('todoDiv').style.display = 'flex';
            // Display the To-Do list
            var todoListUl = document.getElementById('todoList');
            todoListUl.innerHTML = '';
            todoList.forEach(element => {
                // Create HTML for each task in the To-Do list
                var li = `<li class="list-group-item d-flex justify-content-between align-items-center todo-item" data-id='${element.id}'>
                <span class="task-name">${element.description}</span>
                <div>
                    <button class="btn btn-success btn-sm mr-2" onclick="markAsDone(${element.id})"><i class="fas fa-check"></i> </button>
                    <button class="btn btn-primary btn-sm mr-2" onclick="editTask(${element.id})"><i class="fas fa-edit"></i> </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${element.id})"><i class="fas fa-trash-alt"></i> </button>
                </div>
            </li>`;
                todoListUl.innerHTML += li;
            });
        } else {
            document.getElementById('todoDiv').style.display = 'none';
        }

        if (doneList.length > 0) {
            document.getElementById('doneDiv').style.display = 'flex';
            // Display the Done list
            var doneListUl = document.getElementById('doneList');
            doneListUl.innerHTML = '';
            doneList.forEach(element => {
                // Create HTML for each task in the Done list
                var li = `<li class="list-group-item d-flex justify-content-between align-items-center completed-task todo-item" data-id='${element.id}'>
                <span class="task-name">${element.description}</span>
                <div>
                    <button class="btn btn-primary btn-sm mr-2" onclick="undoTask(${element.id})"><i class="fas fa-undo"></i></button>
                </div>
            </li>`;
                doneListUl.innerHTML += li;
            });
        } else {
            document.getElementById('doneDiv').style.display = 'none';
        }
    }
}

// Function to handle keyup event on the input field
function handleKeyUp() {
    var text = document.getElementById('todoInput').value;
    if (text.length > 0) {
        document.getElementById('errorMessage').innerHTML = '';
    }
}

// Function to add a new task
function addTask() {
    // Get the task description from the input field
    var text = document.getElementById('todoInput').value;

    // Validate if the task name is not blank
    if (!text || text.length == 0) {
        document.getElementById('errorMessage').innerHTML = 'Task name can not be blank';
        document.getElementById('todoInput').focus();
        return;
    }

    // Retrieve existing tasks from local storage or initialize an empty array
    var allList = JSON.parse(localStorage.getItem('todo')) || [];

    // Generate a new task object with an ID, description, and status (true for todo)
    var nextId = allList.length > 0 ? parseInt(allList[allList.length - 1].id) + 1 : 1;
    var newTask = { id: nextId, description: text, status: true };

    // Add the new task to the list of tasks
    allList.push(newTask);

    // Save the updated list of tasks to local storage
    localStorage.setItem('todo', JSON.stringify(allList));

    // Clear the input field
    document.getElementById('todoInput').value = '';

    // Reload the lists to reflect the changes
    loadLists();
}

// Function to mark a task as done
function markAsDone(id) {
    // Retrieve tasks from local storage
    var allList = JSON.parse(localStorage.getItem('todo')) || [];

    // Find the task with the specified ID and update its status to done (false)
    allList.find(x => x.id == id).status = false;

    // Save the updated list of tasks to local storage
    localStorage.setItem('todo', JSON.stringify(allList));

    // Reload the lists to reflect the changes
    loadLists();
}

// Function to put back a task in To Do List from Done List
function undoTask(id) {
    // Retrieve tasks from local storage
    var allList = JSON.parse(localStorage.getItem('todo')) || [];

    // Find the task with the specified ID and update its status to done (true)
    allList.find(x => x.id == id).status = true;

    // Save the updated list of tasks to local storage
    localStorage.setItem('todo', JSON.stringify(allList));

    // Reload the lists to reflect the changes
    loadLists();
}

// Function to delete a task
function deleteTask(id) {
    // Retrieve tasks from local storage
    var allList = JSON.parse(localStorage.getItem('todo')) || [];

    // Find the task with the specified ID and get its description
    var taskDescription = allList.find(x => x.id == id).description;

    // Confirm with the user before deleting the task
    var confirmDeleteTask = confirm('Are you sure you want to remove this task: ' + taskDescription + '?');

    // If confirmed, delete the task and update local storage
    if (confirmDeleteTask) {
        var arrayAfterDelete = allList.filter(x => x.id != id);
        localStorage.setItem('todo', JSON.stringify(arrayAfterDelete));
        loadLists();
    }
}

// Function to edit a task
function editTask(id) {
    // Retrieve the task item and its original text
    var taskItem = document.querySelector(`#todoList li[data-id="${id}"]`);
    var taskName = taskItem.querySelector('.task-name');
    var originalText = taskName.textContent;

    // Replace the task item HTML with an input field for editing
    taskItem.innerHTML = `
        <input type="text" class="form-control task-input" value="${originalText}">
        <div class="button-container ml-auto d-flex">
            <button class="btn btn-success btn-sm save-btn" onClick="saveTaskChanges(${id})"><i class="fas fa-save"></i></button>
            <button class="btn btn-secondary btn-sm cancel-btn" onClick="cancelTaskEdit(${id},'${originalText}')"><i class="fas fa-times"></i></button>
        </div>
    `;

    // Focus on the input field and place the cursor at the end
    var inputField = taskItem.querySelector('.task-input');
    inputField.focus();
    inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
}

// Function to save changes to a task
function saveTaskChanges(id) {
    // Retrieve the input field and updated task description
    var taskInput = document.querySelector(`#todoList li[data-id="${id}"] .task-input`);
    var allList = JSON.parse(localStorage.getItem('todo')) || [];
    var task = allList.find(x => x.id == id);

    // Update the task description with the input field value
    task.description = taskInput.value;

    // Save the updated list of tasks to local storage
    localStorage.setItem('todo', JSON.stringify(allList));

    // Reload the lists to reflect the changes
    loadLists();
}

// Function to cancel editing a task
function cancelTaskEdit(id, originalText) {
    // Retrieve the task item and replace its HTML with the original text
    var taskItem = document.querySelector(`#todoList li[data-id="${id}"]`);
    taskItem.innerHTML = `
        <span class="task-name">${originalText}</span>
        <div>
            <button class="btn btn-success btn-sm mr-2" onclick="markAsDone(${id})"><i class="fas fa-check"></i></button>
            <button class="btn btn-primary btn-sm mr-2" onclick="editTask(${id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${id})"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
}
