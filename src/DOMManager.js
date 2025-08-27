import { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID, 
    addToDoItem, removeToDoItem, editToDoItem, getActiveToDoID, setActiveToDoID, getActiveToDoListMap } from "./projectManager";
import { format } from 'date-fns';

function setupDOM() {
    const projectListDOM = document.querySelector("#projectContainer");
    const projectEditModal = document.querySelector("#projectModal");
    const projectDOMMap = new Map();

    const toDoListDOM = document.querySelector("#toDoContainer");
    const toDoModal = document.querySelector("#toDoModal");
    const toDoDOMMap = new Map();


    //Reset the to do list DOM (either by deleting its associated project item, of switching to a different project item)
    function clearToDoList() {
        while (toDoListDOM.lastElementChild) {
            toDoListDOM.removeChild(toDoListDOM.lastElementChild);
        };
    };

    //Update the header and footer(add button) of the toDoSection
    //Should only occur when the active project is updated
    function updateToDoSection(newText) {
        let toDoHeader = document.querySelector("#toDoHeader");
        let addBtn = document.querySelector("#toDoSection > .addItem");
        if (newText == undefined) {
            toDoHeader.textContent = "Create/Select a project to start adding To Do Items!";
            addBtn.style.display = "none"; //prevent user from adding items before selecting a project
        } else {
            toDoHeader.textContent = newText;
            addBtn.style.display = "block"; //make toDo add button visible after project is selected

            toDoDOMMap.clear();
            let map = getActiveToDoListMap();

            setActiveToDoID(undefined);
            map.forEach((toDoItem, id) => {
                toDoListDOM.appendChild(createToDoDOM(toDoItem.title, toDoItem.duedate, toDoItem.priority, toDoItem.notes, id));
                
            });
        };
    };

    //update the DOM to show which project is currently selected
    function updateActiveProject(newActiveID) {

        //remove the active styling from the old active project item (if one is selected)
        if (getActiveProjectID() != undefined) {
            projectDOMMap.get(getActiveProjectID()).removeAttribute("id");
        };

        //update the styling for the newly selected project (if undefined, there will be no active project)
        if (newActiveID != undefined) {
            projectDOMMap.get(newActiveID).setAttribute("id", "active");
            clearToDoList();
        };

        //update the activeID in the projectList object
        //if undefined, there is no active project item currently
        setActiveProjectID(newActiveID);
        
    };

    //Update DOM to show which toDo item is currently selected
    function updateActiveToDo(newActiveID) {
        
        //remove active styling from the old toDo list item (if one is selected)
        if (getActiveToDoID() != undefined) {
            toDoDOMMap.get(getActiveToDoID()).removeAttribute("id");
        };

        //update the styling for the newly selected toDo item (if undefined, there will be no active toDo item)
        if (newActiveID != undefined) {
            toDoDOMMap.get(newActiveID).setAttribute("id", "active");
        };

        //update the activeID in the toDoList object for the corresponding project item
        //if undefined, there is no active project item currently
        setActiveToDoID(newActiveID);

    };

    //Function to close editting modals and reset the inputs
    function closeModals() {
        projectEditModal.close();
        let form = projectEditModal.querySelector("form");
        form.reset();

        toDoModal.close();
        form = toDoModal.querySelector("form");
        form.reset();
    };

    //Attaching event listener to close button on the editting modals
    projectEditModal.querySelector(".dialogClose").addEventListener("click", closeModals);
    toDoModal.querySelector(".dialogClose").addEventListener("click", closeModals);

    let addStatus = 0; //1 if addItem button was clicked, 0 if not (modal triggered by edit button)
    function setAddStatus(num) {
        addStatus = num;
    };

    //Attaching event listener to Submit button on project editting Modal
    //functionality depends on if a new project item is being added, or an existing item is being editted
    projectEditModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {

        let currentID = getActiveProjectID();
        //if the user leaves the entry blank, it will default to "New Project"
        let value = projectEditModal.querySelector("#name").value == "" ? "New Project" : projectEditModal.querySelector("#name").value;
        
        //Create new project item
        if (addStatus == 1) {
            let projectID = addProjectItem(value);
            projectListDOM.appendChild(createProjectDOM(value, projectID));
            updateActiveProject(projectID);

        //Change the text of corresponding project item DOM
        } else {
            projectDOMMap.get(currentID).querySelector("p").textContent = value;
            editProjectName(currentID, value);
        };

        updateToDoSection(value);
        closeModals();
    });

    toDoModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {

        let currentToDo = getActiveToDoID();

        //values will go to default if the user leaves them blank
        let title = toDoModal.querySelector("#title").value == "" ? "New Item" : toDoModal.querySelector("#title").value;
        let duedate = format(toDoModal.querySelector("#date").value == "" ? new Date() : toDoModal.querySelector("#date").value, "MM/dd/yyyy");
        let priority = toDoModal.querySelector("#priority").value;
        let notes = toDoModal.querySelector("#notes").value == "" ? "No Notes" : toDoModal.querySelector("#notes").value;

        //Create new toDo item
        if (addStatus == 1) {
            let toDoID = addToDoItem(title, duedate, priority, notes);
            toDoListDOM.appendChild(createToDoDOM(title, duedate, priority, notes, toDoID));
            updateActiveToDo(toDoID);

        //Edit existing toDo item
        } else {
            let toDoItem = toDoDOMMap.get(currentToDo);
            toDoItem.querySelector(".title").textContent = title;
            toDoItem.querySelector(".duedate").textContent = duedate;
            toDoItem.classList.remove("priorityLow", "priorityMedium", "priorityHigh");
            if (priority == "low") {
                toDoItem.classList.add("priorityLow");
            } else if (priority == "medium") {
                toDoItem.classList.add("priorityMedium");
            } else {
                toDoItem.classList.add("priorityHigh");
            };
            toDoItem.querySelector(".toDoNotes").textContent = notes;
            editToDoItem(currentToDo, title, duedate, priority, notes);

        };

        closeModals();
    });

    //Creating DOM display of project item
    function createProjectDOM(name, projectID) {

        let div = document.createElement("div");
        div.classList.add("projectItem");
        div.addEventListener("click", (e) => {
            updateActiveProject(projectID);
            updateToDoSection(name);
        });
        projectDOMMap.set(projectID, div);

        let p = document.createElement("p");
        p.classList.add("title");
        p.textContent = name;
        div.appendChild(p);

        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        let b = document.createElement("button");
        b.classList.add("editBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            //event propagation activates the parent div event listener to update the active id
            projectEditModal.showModal();
            setAddStatus(0);
        });

        b = document.createElement("button");
        b.classList.add("removeBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeProjectItem(projectID);
            if (getActiveProjectID() == projectID) {                
                updateToDoSection(undefined);
                updateActiveProject(undefined);
            };
            projectListDOM.removeChild(div);
            projectDOMMap.delete(projectID);
        });

        div.appendChild(buttonsDiv);

        return div;
    };

    //Create DOM display of toDo item
    function createToDoDOM(title, duedate, priority, notes, toDoID) {

        let div = document.createElement("div");
        div.classList.add("toDoItem");
        //add priority class depending on the priority that the user input
        if (priority == "low") {
            div.classList.add("priorityLow");
        } else if (priority == "medium") {
            div.classList.add("priorityMedium");
        } else {
            div.classList.add("priorityHigh");
        };
        div.addEventListener("click", (e) => {
            updateActiveToDo(toDoID);
        });
        toDoDOMMap.set(toDoID, div);

        //headerDiv
        let headerDiv = document.createElement("div");
        headerDiv.classList.add("toDoItemHeader");

        let p = document.createElement("p");
        p.classList.add("title");
        p.textContent = title;
        headerDiv.appendChild(p);

        p = document.createElement("p");
        p.classList.add("duedate");
        p.textContent = duedate; //not sure what to do with date yet
        headerDiv.appendChild(p);

        //buttonsDiv
        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        let b = document.createElement("button");
        b.classList.add("editBtn");
        b.addEventListener("click", (e) => {
            toDoModal.showModal();
            setAddStatus(0);
        });
        buttonsDiv.appendChild(b);

        b = document.createElement("button");
        b.classList.add("removeBtn");
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeToDoItem(toDoID);
            if (getActiveToDoID() == toDoID) {
                updateActiveToDo(undefined); //only remove the active id if the current active to do is being removed
            };
            toDoListDOM.removeChild(div);
            toDoDOMMap.delete(toDoID);
        });
        buttonsDiv.appendChild(b);
        
        headerDiv.appendChild(buttonsDiv);
        //end buttonsDiv

        div.appendChild(headerDiv);
        //end HeaderDiv

        p = document.createElement("p");
        p.classList.add("toDoNotes");
        p.textContent = notes;
        div.appendChild(p);
        
        return div;

    };

    //Button to show project modal to add new projects to the project list
    document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {
        projectEditModal.showModal();
        setAddStatus(1);
    });

    //Button to show toDo modal to add new toDo's to the current active project item
    document.querySelector("#toDoSection > .addItem").addEventListener("click", (e) => {
        toDoModal.showModal();
        setAddStatus(1);
    });

    //functions to run when the page first loads
    updateToDoSection(undefined);
};


export { setupDOM };
