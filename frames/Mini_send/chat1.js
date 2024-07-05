window.onload = function() {
    document.getElementById("addTaskBtn").onclick = addTask;

    function addTask() {
        var taskInput = document.getElementById("taskInput").value.trim();
        var dateInput = document.getElementById("dateInput").value;
        var timeInput = document.getElementById("timeInput").value;

        if (taskInput === "" || dateInput === "" || timeInput === "") {
            alert("Please fill in all fields.");
            return;
        }

        var taskDateTimeString = dateInput + " " + timeInput;

        var taskList = document.getElementById("taskList");
        var newTaskItem = document.createElement("li");

        // Create checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onchange = function() {
            if (this.checked) {
                newTaskItem.classList.add("completed");
            } else {
                newTaskItem.classList.remove("completed");
            }
        };

        // Create text node
        var taskText = document.createTextNode(taskInput + " - " + taskDateTimeString);

        // Create delete button
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.onclick = function() {
            taskList.removeChild(newTaskItem);
            sortTasksByDateTime();
        };

        // Append elements to task item
        newTaskItem.appendChild(checkbox);
        newTaskItem.appendChild(taskText);
        newTaskItem.appendChild(deleteButton);

        // Append task item to task list
        taskList.appendChild(newTaskItem);

        // Clear input fields
        document.getElementById("taskInput").value = "";
        document.getElementById("dateInput").value = "";
        document.getElementById("timeInput").value = "";

        sortTasksByDateTime();
    }

    function sortTasksByDateTime() {
        var taskList = document.getElementById("taskList");
        var tasks = Array.from(taskList.getElementsByTagName("li"));

        tasks.sort(function(a, b) {
            var dateA = new Date(a.childNodes[1].nodeValue.split(" - ")[1]);
            var dateB = new Date(b.childNodes[1].nodeValue.split(" - ")[1]);
            return dateA - dateB;
        });

        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        tasks.forEach(function(task) {
            taskList.appendChild(task);
        });
    }
};
