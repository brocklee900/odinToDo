import { addProjectItem, removeProjectItem, editProjectName, getActiveProjectID, setActiveProjectID } from "./objectManager";
import { updateToDoSection } from "./toDoDOM";
import { retrieveProjects } from "./storage";

function setUpDOM() {
    const projectListDOM = document.querySelector("#projectContainer");
    const projectEditModal = document.querySelector("#projectModal");
    const projectDOMMap = new Map();

    //populate the project items from the saved local storage data
    retrieveProjects().forEach((project) => {
        projectListDOM.append(createProjectDOM(project.listName, project.projectID));
    });


    let addStatus = 0; //1 if addItem button was clicked, 0 if not (modal triggered by edit button)
    //Open modal. If editting an existing project, prepopulate the inputs with existing data
    function openModal(num, name) {
        addStatus = num;
        if (num == 0) {
            projectEditModal.querySelector("#name").value = name;
        }
        projectEditModal.showModal();
    };

    //Function to close editting modals and reset the inputs
    function closeModals() {
        projectEditModal.close();
        let form = projectEditModal.querySelector("form");
        form.reset();
    };

    //update the DOM to show which project is currently selected
    function updateActiveProject(newActiveID) {

        //remove the active styling from the old active project item (if one is selected)
        if (getActiveProjectID() != undefined) {
            projectDOMMap.get(getActiveProjectID()).removeAttribute("id");
        };

        //update the styling for the newly selected project (if undefined, there will be no active project)
        if (newActiveID != undefined) {
            projectDOMMap.get(newActiveID).setAttribute("id", "active");
        };

        //update the activeID in the projectList object
        //if undefined, there is no active project item currently
        setActiveProjectID(newActiveID);
        
    };

    //Attaching event listener to close button on the editting modals
    projectEditModal.querySelector(".dialogClose").addEventListener("click", closeModals);

    //Attaching event listener to Submit button on project editting Modal
    //functionality depends on if a new project item is being added, or an existing item is being editted
    projectEditModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {

        let currentID = getActiveProjectID();
        //if the user leaves the entry blank, it will default to "New Project"
        let value = projectEditModal.querySelector("#name").value == "" ? "New Project" : projectEditModal.querySelector("#name").value;
        
        //Create new project item
        if (addStatus == 1) {
            let projectID = addProjectItem(value);
            projectListDOM.appendChild(createProjectDOM(value, projectID));
            updateActiveProject(projectID);

        //Change the text of corresponding project item DOM
        } else {
            projectDOMMap.get(currentID).querySelector("p").textContent = value;
            editProjectName(currentID, value);
        };

        updateToDoSection(value);
        closeModals();
    });

    //Creating DOM display of project item
    function createProjectDOM(name, projectID) {

        let div = document.createElement("div");
        div.classList.add("projectItem");
        div.addEventListener("click", (e) => {
            updateActiveProject(projectID);
            updateToDoSection(name);
        });
        projectDOMMap.set(projectID, div);

        let p = document.createElement("p");
        p.classList.add("title");
        p.textContent = name;
        div.appendChild(p);

        let buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        let b = document.createElement("button");
        b.classList.add("editBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            e.stopPropagation();
            //event propagation activates the parent div event listener to update the active id
            updateActiveProject(projectID);
            updateToDoSection(name);
            openModal(0, name);
        });

        b = document.createElement("button");
        b.classList.add("removeBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeProjectItem(projectID);
            if (getActiveProjectID() == projectID) {                
                updateToDoSection(undefined);
                updateActiveProject(undefined);
            };
            projectListDOM.removeChild(div);
            projectDOMMap.delete(projectID);
        });

        div.appendChild(buttonsDiv);

        return div;
    };

    //Button to show project modal to add new projects to the project list
    document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {
        openModal(1);
    });

    updateToDoSection(undefined);
}

export {setUpDOM};
