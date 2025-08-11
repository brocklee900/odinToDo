
import { createToDoList } from "./toDoList";

function listManager() {
    let projectList = [];

    function addList(name) {
        let id = crypto.randomUUID();
        projectList.push(createToDoList(name, id));
        return id;
    };

    function removeList(idToRemove) {
        projectList.forEach((currentList) => {
            if (currentList.projectID == idToRemove) {
                let indexToRemove = projectList.indexOf(currentList);
                projectList.splice(indexToRemove, 1);
            };
        });
    };

    function editListName(idToEdit, name) {
        projectList.forEach((currentList) => {
            if (currentList.projectID == idToEdit) {
                currentList.listName = name;
            };
        });
    };

    function printLists() {
        projectList.forEach((currentList) => {
            console.log(currentList.listName);
        });
    }

    return {
        addList,
        removeList,
        editListName,
        printLists,
        get projectList() {
            return projectList;
        },
    };
};

export { listManager };