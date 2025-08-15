
import { createProjectItem } from "./projectItem";

function createProjectList() {

    const projectList = new Map();

    const addProjectItem = (name) => {
        let newID = crypto.randomUUID();
        projectList.set(newID, createProjectItem(name));
        return newID;
    };

    const removeProjectItem = (idToRemove) => {
        projectList.delete(idToRemove);
    };

    const editProjectName = (idToChange, name) => {
        projectList.get(idToChange).listName = name;
    };

    const print = () => {
        console.log(projectList);
    }

    return {
        addProjectItem,
        removeProjectItem,
        editProjectName,
    };
};

export { createProjectList };