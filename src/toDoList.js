
import { format } from "date-fns";
import { createToDoItem } from "./toDoItem";

function createToDoList() {
    let listName = "list";
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

        get toDoItems() {
            return toDoItems;
        },

        addToDoItem,
        printToDos,
    };
};

export { createToDoList };