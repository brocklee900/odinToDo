
import { createToDoList } from "./toDoList";

function createProjectItem(name = "New Project") {
    let listName = name;
    let toDoList = createToDoList();

    return {
        get listName() {
            return listName;
        },

        set listName(newName) {
            listName = newName;
        },

        get toDoList() {
            return toDoList;
        },

    };
};

export { createProjectItem };