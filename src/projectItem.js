
import { createToDoList } from "./toDoList";

function createProjectItem(name = "New Project", id) {
    let listName = name;
    let projectID = id;
    createToDoList(id);

    return {
        get listName() {
            return listName;
        },

        set listName(newName) {
            listName = newName;
        },

        get projectID() {
            return projectID;
        },

        /*
        get toDoList() {
            return toDoList;
        },
        */
    };
};

export { createProjectItem };