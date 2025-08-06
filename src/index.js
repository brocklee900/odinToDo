import "./styles.css";
import { createToDoItem } from "./toDoItem";


let itemOne = createToDoItem();
console.log(itemOne.title);
console.log(itemOne.description);
console.log(itemOne.dueDate);
console.log(itemOne.priority);
console.log(itemOne.notes);
console.log(itemOne.checklist);