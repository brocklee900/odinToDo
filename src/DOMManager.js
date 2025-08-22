import { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID, addToDoItem, removeToDoItem, getActiveToDoID, setActiveToDoID } from "./projectManager";
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

        //remove the active styling from the old active project item
        if (getActiveProjectID() != undefined) {
            projectDOMMap.get(getActiveProjectID()).removeAttribute("id");
        };

        //update the styling for the new activeID (sometimes there will be no active, so not always set)
        if (newActiveID != undefined) {
            projectDOMMap.get(newActiveID).setAttribute("id", "active");
            clearToDoList();
        };

        //will set Active to undefined depending on the case (project item deleted or new project to be added)
        setActiveProjectID(newActiveID);
        
    };

    function updateActiveToDo(newActiveID) {
        
        if (getActiveToDoID() != undefined) {
            toDoDOMMap.get(getActiveToDoID()).removeAttribute("id");
        };

        if (newActiveID != undefined) {
            toDoDOMMap.get(newActiveID).setAttribute("id", "active");
        };

        setActiveToDoID(newActiveID);
        console.log("Active to do id set to:", newActiveID);

    };

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

        let title = toDoModal.querySelector("#title").value == "" ? "New Item" : toDoModal.querySelector("@title").value;
        let duedate = toDoModal.querySelector("#date").value == "" ? new Date() : toDoModal.querySelector("#date").value;
        let priority = toDoModal.querySelector("#priority").value;
        let notes = toDoModal.querySelector("#notes").value == "" ? "No Notes" : toDoModal.querySelector("#notes").value;
        console.log(title, duedate, priority, notes);

        if (currentToDo == undefined) {
            let toDoID = addToDoItem(title, duedate, priority, notes);
            toDoListDOM.appendChild(createToDoDOM(title, duedate, priority, notes, toDoID));
            updateActiveToDo(toDoID);
        }

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
