import { addProjectItem, removeProjectItem, editProjectName } from "./projectManager";


function setupDOM() {
    const projectListDOM = document.querySelector("#projectContainer");
    const projectEditModal = document.querySelector("#editProjectName");
    const projectDOMMap = new Map();

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

        let currentID = e.target.parentNode.parentNode.dataset.projectID;
        let value = projectEditModal.querySelector("#name").value;
        //Create new project item
        if (currentID == "newItem") {
            let projectID = addProjectItem(value);
            projectListDOM.appendChild(createProjectDOM(value, projectID));

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
        projectDOMMap.set(projectID, div);

        let p = document.createElement("p");
        p.textContent = name;
        div.appendChild(p);

        let b = document.createElement("button");
        b.classList.add("editBtn");
        div.appendChild(b);
        b.addEventListener("click", (e) => {
            projectEditModal.showModal();
            projectEditModal.dataset.projectID = projectID; //set dataset value so that modal knows which project item to edit
        });

        b = document.createElement("button");
        b.classList.add("removeBtn");
        div.appendChild(b);
        b.addEventListener("click", (e) => {
            removeProjectItem(projectID);
            projectListDOM.removeChild(div);
            projectDOMMap.delete(projectID);
        });

        return div;
    };

    //Button to add projects to the project list
    document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {

        projectEditModal.showModal();
        projectEditModal.dataset.projectID = "newItem"; //set to newItem so submit button on modal knows to add new project item

    });
};

export { setupDOM };
