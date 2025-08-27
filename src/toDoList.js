
import { createToDoItem } from "./toDoItem";

function createToDoList() {

    const toDoList = new Map();
    let activeToDoID;

    const addToDoItem = (title, date, priority, notes) => {
        let newID = crypto.randomUUID();
        toDoList.set(newID, createToDoItem(title, date, priority, notes));
        return newID;
    };

    const removeToDoItem = (idToRemove) => {
        toDoList.delete(idToRemove);
    };

    const editToDoItem = (idToChange, title, date, priority, notes) => {
        let toDo = toDoList.get(idToChange);
        toDo.title = title;
        toDo.duedate = date;
        toDo.priority = priority;
        toDo.notes = notes;
        
    };

    const print = () => {
        console.log(toDoList);
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

        get map() {
            return toDoList;
        }

    };
};

export { createToDoList };