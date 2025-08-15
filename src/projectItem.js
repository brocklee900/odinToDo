
import { format } from "date-fns";
import { createToDoItem } from "./toDoItem";

function createProjectItem(name = "New Project") {
    let listName = name;

    return {
        get listName() {
            return listName;
        },

        set listName(newName) {
            listName = newName;
        },

    };
};

export { createProjectItem };