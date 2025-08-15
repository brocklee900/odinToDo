
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
}

export { addProjectItem, removeProjectItem, editProjectName };