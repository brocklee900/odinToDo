
import { format } from 'date-fns';

function createToDoItem() {
    let title = "title";
    let description = "description";
    let dueDate = new Date(2000, 0, 1);
    let priority = "High";
    let notes = "notes";
    let checklist = [];


    return {
        get title() {
            return title;
        },

        get description() {
            return description;
        },

        get dueDate() {
            return format(dueDate, "MM, dd, yyyy");
        },

        get priority() {
            return priority;
        },

        get notes() {
            return notes;
        },

        get checklist() {
            return checklist;
        }
    };
};

export { createToDoItem };