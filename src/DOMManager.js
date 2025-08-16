import { addProjectItem, removeProjectItem, editProjectName, getActiveProject, setActiveProject } from "./projectManager";


function setupDOM() {
    const projectListDOM = document.querySelector("#projectContainer");
    const projectEditModal = document.querySelector("#editProjectName");
    const projectDOMMap = new Map();


    //update the DOM to show which project is currently selected
    function updateActive(newActiveID) {

        //remove the active styling from the old active project item
        if (getActiveProject() != undefined) {
            projectDOMMap.get(getActiveProject()).removeAttribute("id");
        };

        //update the styling for the new activeID (sometimes there will be no active, so not always set)
        if (newActiveID != undefined) {
            projectDOMMap.get(newActiveID).setAttribute("id", "active");
        };

        //will set Active to undefined depending on the case (project item deleted or new project to be added)
        setActiveProject(newActiveID);
        
    };

    //Function to close project editting modal
    function closeModal() {
        projectEditModal.close();
        let form = projectEditModal.querySelector("form");
        form.reset();
    };

    //Attaching event listener to close button on project editting modal
    projectEditModal.querySelector(".dialogClose").addEventListener("click", closeModal);

    //Attaching event listener to Submit button on project editting Modal
    //functionality depends on if a new project item is being added, or an existing item is being editted
    projectEditModal.querySelector(".dialogSubmit").addEventListener("click", (e) => {

        let currentID = getActiveProject();
        let value = projectEditModal.querySelector("#name").value;
        //Create new project item
        if (currentID == undefined) {
            let projectID = addProjectItem(value);
            projectListDOM.appendChild(createProjectDOM(value, projectID));
            updateActive(projectID);

        //Change the text of corresponding project item DOM
        } else {
            projectDOMMap.get(currentID).querySelector("p").textContent = value;
            editProjectName(currentID, value);
        };

        closeModal();
    });

    //Creating DOM display of project item
    function createProjectDOM(name, projectID) {

        let div = document.createElement("div");
        div.classList.add("projectItem");
        div.addEventListener("click", (e) => {
            updateActive(projectID);
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
            //event propagation activates the parent div event listener to update the active id
            projectEditModal.showModal();
        });

        b = document.createElement("button");
        b.classList.add("removeBtn");
        buttonsDiv.appendChild(b);
        b.addEventListener("click", (e) => {
            e.stopPropagation(); //stop propagation to prevent the id from updating again from the parent div event listener
            removeProjectItem(projectID);
            updateActive(undefined);
            projectListDOM.removeChild(div);
            projectDOMMap.delete(projectID);
        });

        div.appendChild(buttonsDiv);

        return div;
    };

    //Button to add projects to the project list
    document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {

        projectEditModal.showModal();
        updateActive(undefined);

    });
};

export { setupDOM };
