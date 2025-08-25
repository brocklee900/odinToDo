import { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID, 
    addToDoItem, removeToDoItem, editToDoItem, getActiveToDoID, setActiveToDoID } from "./projectManager";
import { format } from 'date-fns';

function setupDOM() {
    const projectListDOM = document.querySelector("#projectContainer");
    const projectEditModal = document.querySelector("#projectModal");
    const projectDOMMap = new Map();

    const toDoListDOM = document.querySelector("#toDoContainer");
    const toDoModal = document.querySelector("#toDoModal");
    const toDoDOMMap = new Map();

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

    //Reset the to do list DOM (either by deleting its associated project item, of switching to a different project item)
    function clearToDoList() {
        while (toDoListDOM.lastElementChild) {
            toDoListDOM.removeChild(toDoListDOM.lastElementChild);
        };
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

    //Attaching event listener to Submit button on project editting Modal
    //functionality depends on if a new project item is being added, or an existing item is being editted
    projectEditModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {

        let currentID = getActiveProjectID();
        //if the user leaves the entry blank, it will default to "New Project"
        let value = projectEditModal.querySelector("#name").value == "" ? "New Project" : projectEditModal.querySelector("#name").value;
        
        //Create new project item
        if (currentID == undefined) {
            let projectID = addProjectItem(value);
            projectListDOM.appendChild(createProjectDOM(value, projectID));
            updateActiveProject(projectID);

        //Change the text of corresponding project item DOM
        } else {
            projectDOMMap.get(currentID).querySelector("p").textContent = value;
            editProjectName(currentID, value);
        };

        closeModals();
    });

    //not sure what to do with the duedate format yet
    toDoModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {
;
        let currentToDo = getActiveToDoID();

        //values will go to default if the user leaves them blank
        let title = toDoModal.querySelector("#title").value == "" ? "New Item" : toDoModal.querySelector("#title").value;
        let duedate = toDoModal.querySelector("#date").value == "" ? new Date() : toDoModal.querySelector("#date").value;
        let priority = toDoModal.querySelector("#priority").value;
        let notes = toDoModal.querySelector("#notes").value == "" ? "No Notes" : toDoModal.querySelector("#notes").value;

        if (currentToDo == undefined) {
            let toDoID = addToDoItem(title, duedate, priority, notes);
            toDoListDOM.appendChild(createToDoDOM(title, duedate, priority, notes, toDoID));
            updateActiveToDo(toDoID);
        } else {
            let toDoItem = toDoDOMMap.get(currentToDo);
            console.log(toDoItem.querySelector(".title"));
            toDoItem.querySelector(".title").textContent = title;
            console.log(toDoItem.querySelector(".duedate"));
            toDoItem.querySelector(".duedate").textContent = format(new Date(duedate), "MM/dd/yyyy");
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
        });

        b = document.createElement("button");
        b.classList.add("removeBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeProjectItem(projectID);
            if (getActiveProjectID == projectID) {
                updateActiveProject(undefined);
            };
            projectListDOM.removeChild(div);
            projectDOMMap.delete(projectID);
        });

        div.appendChild(buttonsDiv);

        return div;
    };

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
        p.textContent = format(new Date(duedate), "MM/dd/yyyy"); //not sure what to do with date yet
        headerDiv.appendChild(p);

        //buttonsDiv
        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        let b = document.createElement("button");
        b.classList.add("editBtn");
        b.addEventListener("click", (e) => {
            toDoModal.showModal();
        });
        buttonsDiv.appendChild(b);

        b = document.createElement("button");
        b.classList.add("removeBtn");
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeToDoItem(toDoID);
            if (getActiveToDoID == toDoID) {
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

    //Button to add projects to the project list
    document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {

        projectEditModal.showModal();
        updateActiveProject(undefined);

    });

    document.querySelector("#toDoSection > .addItem").addEventListener("click", (e) => {

        toDoModal.showModal();
        updateActiveToDo(undefined);

    })

    
};

export { setupDOM };
