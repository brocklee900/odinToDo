
import { createProjectList } from "./projectList";
import { createToDoList } from "./toDoList";

let projectList = createProjectList();
let currentToDoList;

function addProjectItem(name) {
    return projectList.addProjectItem(name);
};

function removeProjectItem(id) {
    projectList.removeProjectItem(id);
};

function editProjectName(id, name) {
    projectList.editProjectName(id, name);
};

function getActiveProjectID() {
    return projectList.activeProjectID;
};

function setActiveProjectID(newActiveID) {
    if (newActiveID == undefined) {
        currentToDoList == undefined;
    } else {
        currentToDoList = createToDoList(newActiveID);
    }
    projectList.activeProjectID = newActiveID;
};

function getActiveToDoList() {
    return currentToDoList.list;
};

function addToDoItem(title, duedate, priority, notes) {
    return currentToDoList.addToDoItem(title, duedate, priority, notes, getActiveProjectID());
};

function removeToDoItem(id) {
    currentToDoList.removeToDoItem(id);
};

function editToDoItem(id, title, duedate, priority, notes) {
    currentToDoList.editToDoItem(id, title, duedate, priority, notes);
};

function getActiveToDoID() {
    return currentToDoList.activeToDoID;
};

function setActiveToDoID(newActiveID) {
    currentToDoList.activeToDoID = newActiveID;
};


export { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID, 
    addToDoItem, removeToDoItem, editToDoItem, getActiveToDoID, setActiveToDoID, getActiveToDoList};