
//If need to reset the local storage from the start, uncomment below
//localStorage.clear();

//Store project item data into localStorage
function storeProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
};

//Retrieve project item data from localStorage
function retrieveProjects()  {
    return JSON.parse(localStorage.getItem("projects"));
};

//Store ToDoList data (only stores for one project id)
function storeToDo(projectID, toDoList) {
    let toDos = new Map(JSON.parse(localStorage.getItem("toDos")));
    toDos.set(projectID, toDoList);
    localStorage.setItem("toDos", JSON.stringify(Array.from(toDos)));
};

//Retrieve toDoList data (if there was none for this projectID, create a new empty list for that projectID)
function retrieveToDos(projectID) {

    let toDos;

    //if no todos have been setup in the local storage yet
    if (JSON.parse(localStorage.getItem("toDos")) == null) {
        toDos = new Map();
        toDos.set(projectID, new Array());
        localStorage.setItem("toDos", JSON.stringify(Array.from(toDos)));
        return new Array();
    }

    toDos = new Map(JSON.parse(localStorage.getItem("toDos")));
    if (toDos.get(projectID) == undefined) { //if the toDoList hasn't been set up for this projectID yet
        toDos.set(projectID, new Array());
        localStorage.setItem("toDos", JSON.stringify(Array.from(toDos)));
        return new Array();
    } else {
        return toDos.get(projectID); //otherwise return the project ID's toDoList
    }
};

//Remove toDoList for project Item when project Item is deleted
function removeToDoList(projectID) {
    let toDos = new Map(JSON.parse(localStorage.getItem("toDos")));
    toDos.delete(projectID);
    localStorage.setItem("toDos", JSON.stringify(Array.from(toDos)));
};

export { storeProjects, retrieveProjects, storeToDo, retrieveToDos, removeToDoList };