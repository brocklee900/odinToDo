
import { createProjectItem } from "./projectItem";

function createProjectList() {

    const projectList = new Map();
    let activeProjectID;

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

    const getProject = (id) => {
        return projectList.get(id);
    };

    const print = () => {
        console.log(projectList);
    }

    return {
        addProjectItem,
        removeProjectItem,
        editProjectName,
        getProject,

        get activeProjectID() {
            return activeProjectID;
        },

        set activeProjectID(id) {
            activeProjectID = id;
        },
    };
};

export { createProjectList };