import "./styles.css";
import { listManager } from "./listManager";

const myManager = listManager();
const projectListDOM = document.querySelector("#projectContainer");
const projectEditModal = document.querySelector("#editProjectName");

projectEditModal.querySelector(".dialogClose").addEventListener("click", (e) => {
    projectEditModal.close();
    let form = projectEditModal.querySelector("form");
    form.removeChild(form.lastElementChild);
    form.reset();
});

//Creating DOM display of project item
function createProjectDOM(name, projectID) {
    let div = document.createElement("div");
    div.classList.add("projectItem");

    let p = document.createElement("p");
    p.textContent = name;
    div.appendChild(p);

    let b = document.createElement("button");
    b.classList.add("editBtn");
    div.appendChild(b);
    b.addEventListener("click", (e) => {
        projectEditModal.showModal();
        let submitButton = document.createElement("button");
        submitButton.classList.add("dialogSubmit");
        submitButton.textContent = "Submit";
        let form = projectEditModal.querySelector("form")
        form.appendChild(submitButton);
        submitButton.addEventListener("click", (e) => {
            p.textContent = projectEditModal.querySelector("#name").value;
            form.removeChild(submitButton);
            myManager.editListName(projectID, p.textContent);
            projectEditModal.close();
            form.reset();
        });
    });

    b = document.createElement("button");
    b.classList.add("removeBtn");
    div.appendChild(b);
    b.addEventListener("click", (e) => {
        myManager.removeList(projectID);
        projectListDOM.removeChild(div);
    });

    return div;
}

//Button to add projects to the project list
document.querySelector("#projectSection > .addItem").addEventListener("click", (e) => {

    projectEditModal.showModal();
    let inputName = projectEditModal.querySelector("#name");
    inputName.value = "New Project";
    let submitButton = document.createElement("button");
    submitButton.classList.add("dialogSubmit");
    submitButton.textContent = "Submit";
    let form = projectEditModal.querySelector("form")
    form.appendChild(submitButton);
    submitButton.addEventListener("click", (e) => {
        form.removeChild(submitButton);
        let projectID = myManager.addList(inputName.value);
        projectListDOM.appendChild(createProjectDOM(inputName.value, projectID));
        projectEditModal.close();
        form.reset();
    });

});