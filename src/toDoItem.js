
function createToDoItem(newTitle, newDate, newPriority, newNotes) {
    let title = newTitle;
    let duedate = newDate;
    let priority = newPriority;
    let notes = newNotes;


    return {
        get title() {
            return title;
        },

        set title(newTitle) {
            title = newTitle;
        },

        get duedate() {
            return duedate;
        },

        set duedate(newDate) {
            duedate = newDate;
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