function getTaskList() {
    fetch("http://localhost:8080/api/tasks")
        .then(response => response.json().then(json => {
            const table = document.querySelector("#table_tasks");
            for (const task of json) {
                createTaskTable(table, task);
            }
        }));
}

function postTask() {

    const titleElement = document.querySelector("#title");
    const descriptionElement = document.querySelector("#description");

    const json = JSON.stringify({
        "title": titleElement.value,
        "description": descriptionElement.value,
        "status": "PENDING"
    });

    fetch(`http://localhost:8080/api/tasks`, {
        method: 'POST',
        body: json,
        headers: new Headers({ 'content-type': 'application/json' })
    })
        .then(response => response.json().then(json => {
            titleElement.value = "";
            descriptionElement.value = "";
            alert("Task created with success!");
        }))
}

function putTask(id/*:number */, task/*: TaskDTO */) {

    const json = JSON.stringify({
        "title": task.title,
        "description": task.description,
        "status": task.status
    });

    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("status", task.status);

    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        body: json,
        headers: new Headers({'content-type': 'application/json'})
    })
        .then(response => response.json().then(json => {
            const table = document.querySelector("#table_tasks");
            removeTaskTable(id);
            createTaskTable(table, json);
        }))
}

function deleteTask(id/*:number */) {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            removeTaskTable(id);
        })
}

function removeTaskTable(id) {
    const taskTr = document.querySelector(`#table_task_${id}`);
    taskTr.remove();
}

function createTaskTable(table, task) {

    const curTaskTr = document.createElement("tr");
    const taskTdTitle = document.createElement("td");
    const taskTdDescription = document.createElement("td");
    const taskTdStatus = document.createElement("td");
    const taskTdDelete = document.createElement("td");

    const taskStatusButton = document.createElement("button");
    taskStatusButton.innerText = task.status;
    taskStatusButton.onclick = () => putTask(task.id, {
        ...task,
        status: task.status === "PENDING" ? "COMPLETED" : "PENDING"
    });

    const taskDeleteButton = document.createElement("button");
    taskDeleteButton.innerText = "[Excluir]";
    taskDeleteButton.onclick = () => deleteTask(task.id);

    taskTdTitle.innerText = task.title;
    taskTdDescription.innerText = task.description;
    taskTdStatus.appendChild(taskStatusButton);
    taskTdDelete.appendChild(taskDeleteButton);

    curTaskTr.appendChild(taskTdTitle);
    curTaskTr.appendChild(taskTdDescription);
    curTaskTr.appendChild(taskTdStatus);
    curTaskTr.appendChild(taskTdDelete);
    curTaskTr.id = `table_task_${task.id}`;

    table.appendChild(curTaskTr);
}