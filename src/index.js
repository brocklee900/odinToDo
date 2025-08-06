import "./styles.css";
import { createToDoItem } from "./toDoItem";
import { createToDoList } from "./toDoList";

let listOne = createToDoList();
listOne.addToDoItem(createToDoItem());
listOne.addToDoItem(createToDoItem());
listOne.addToDoItem(createToDoItem());
listOne.printToDos();