
import { createProjectList } from "./projectList";

let projectList = createProjectList();

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
    return projectList.activeProjectID
};

function setActiveProjectID(newActiveID) {
    projectList.activeProjectID = newActiveID;
};

//private function to get the current active project's to Do List
//used for manipulating the todo items
function getActiveToDoList() {
    return projectList.getProject(getActiveProjectID()).toDoList;
};

function addToDoItem(title, duedate, priority, notes) {
    return getActiveToDoList().addToDoItem(title, duedate, priority, notes);
};

function removeToDoItem(id) {
    getActiveToDoList().removeToDoItem(id);
};

function getActiveToDoID() {
    return getActiveToDoList().activeToDoID;
};

function setActiveToDoID(newActiveID) {
    getActiveToDoList().activeToDoID = newActiveID;
};


export { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID, addToDoItem, removeToDoItem, getActiveToDoID, setActiveToDoID};