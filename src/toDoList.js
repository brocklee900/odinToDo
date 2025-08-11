
import { format } from "date-fns";
import { createToDoItem } from "./toDoItem";

function createToDoList(name = "New Project", id) {
    let projectID = id;
    let listName = name;
    let toDoItems = [];

    const addToDoItem = (toDoItem) => {
        toDoItems.push(toDoItem);
    };

    const printToDos = () => {
        toDoItems.forEach(function(toDoItem) {
            console.log(toDoItem.title);
        });
    };

    return {
        get listName() {
            return listName;
        },

        set listName(newName) {
            listName = newName;
        },

        get toDoItems() {
            return toDoItems;
        },

        get projectID() {
            return projectID;
        },

        addToDoItem,
        printToDos,
    };
};

export { createToDoList };