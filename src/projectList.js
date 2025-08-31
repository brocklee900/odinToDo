
import { createProjectItem } from "./projectItem";
import { storeProjects, retrieveProjects, removeToDoList } from "./storage";

function createProjectList() {

    let projectList = retrieveProjects();
    
    //If the localStorage is empty(First time opening page) set up default project
    if (projectList == null) {
        projectList = new Array();
        let newID = crypto.randomUUID();
        projectList.push(createProjectItem("New Project", newID));
        storeProjects(projectList);
    };
    let activeProjectID;

    const getProjectIndex = (id) => {
        return projectList.findIndex((project) => project.projectID == id); 
    };

    const addProjectItem = (name) => {
        let newID = crypto.randomUUID();
        projectList.push(createProjectItem(name, newID));
        storeProjects(projectList);
        return newID;
    };

    const removeProjectItem = (idToRemove) => {
        projectList.splice(getProjectIndex(idToRemove), 1);
        storeProjects(projectList);
        removeToDoList(idToRemove);
    };

    const editProjectName = (idToChange, name) => {
        projectList[getProjectIndex(idToChange)].listName = name;
        storeProjects(projectList);
    };

    const getProject = (id) => {
        return projectList[getProjectIndex(id)];
    };

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