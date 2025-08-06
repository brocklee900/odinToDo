
function createToDoItem() {
    let title = "title";
    let description = "description";
    let dueDate = "1/11/1111";
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
            return dueDate;
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