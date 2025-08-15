
import { createProjectList } from "./projectList";

let projectList = createProjectList();

function addProjectItem(name) {
    return projectList.addProjectItem(name);
};

function removeProjectItem(id) {
    projectList.removeProjectItem(id);
};

function editProjectName(id, name) {
    projectList.editProjectName(id, name);
};

function getActiveProject() {
    return projectList.activeProject
};

function setActiveProject(newActiveID) {
    projectList.activeProject = newActiveID;
};

export { addProjectItem, removeProjectItem, editProjectName, getActiveProject, setActiveProject };