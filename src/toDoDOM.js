
import { addToDoItem, removeToDoItem, editToDoItem, getActiveToDoID, setActiveToDoID, getActiveToDoListMap } from "./projectManager";
import { format } from 'date-fns';

const toDoListDOM = document.querySelector("#toDoContainer");
const toDoModal = document.querySelector("#toDoModal");
const toDoDOMMap = new Map();

let addStatus = 0; //1 if addItem button was clicked, 0 if not (modal triggered by edit button)
function setAddStatus(num) {
    addStatus = num;
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

    toDoModal.close();
    let form = toDoModal.querySelector("form");
    form.reset();
};

//Attaching event listener to close button on the editting modals
toDoModal.querySelector(".dialogClose").addEventListener("click", closeModals);

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

//Button to show toDo modal to add new toDo's to the current active project item
document.querySelector("#toDoSection > .addItem").addEventListener("click", (e) => {
    toDoModal.showModal();
    setAddStatus(1);
});

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
    clearToDoList();
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

export { updateToDoSection };