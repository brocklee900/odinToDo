
import { createToDoItem } from "./toDoItem";
import { storeToDo, retrieveToDos } from "./storage";

function createToDoList(id) {

    const toDoList = retrieveToDos(id);
    let projectID = id;
    let activeToDoID;

    const getToDoIndex = (id) => {
        return toDoList.findIndex((toDo) => toDo.toDoID == id); 
    };

    const addToDoItem = (title, date, priority, notes) => {
        let newID = crypto.randomUUID();
        toDoList.push(createToDoItem(title, date, priority, notes, newID));
        storeToDo(projectID, toDoList)
        return newID;
    };

    const removeToDoItem = (idToRemove) => {
        toDoList.splice(getToDoIndex(idToRemove), 1);
        storeToDo(projectID, toDoList);
    };

    const editToDoItem = (idToChange, title, date, priority, notes) => {
        let toDo = toDoList[getToDoIndex(idToChange)];
        toDo.title = title;
        toDo.duedate = date;
        toDo.priority = priority;
        toDo.notes = notes;
        storeToDo(projectID, toDoList);
        
    };

    return {
        addToDoItem,
        removeToDoItem,
        editToDoItem,

        get activeToDoID() {
            return activeToDoID;
        },

        set activeToDoID(id) {
            activeToDoID = id;
        },

        get list() {
            return toDoList;
        }

    };
};

export { createToDoList };