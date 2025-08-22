
import { format } from 'date-fns';

function createToDoItem(newTitle, newDate, newPriority, newNotes) {
    let title = newTitle;
    let dueDate = new Date(newDate);
    let priority = newPriority;
    let notes = newNotes;


    return {
        get title() {
            return title;
        },

        set title(newTitle) {
            title = newTitle;
        },

        get dueDate() {
            return format(dueDate, "MM, dd, yyyy");
        },

        set dueDate(newDate) {
            dueDate = new Date(newDate);
        },

        get priority() {
            return priority;
        },

        set priority(newPriority) {
            priority = newPriority;
        },

        get notes() {
            return notes;
        },

        set notes(newNotes) {
            notes = newNotes;
        },

    };
};

export { createToDoItem };