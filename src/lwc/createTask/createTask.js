/**
 * @description Lightning Web Component for creating a task.
 * @track {string} name - The name of the task.
 * @track {string} description - The description of the task.
 * @track {string} dueDate - The due date of the task.
 */
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createTask from '@salesforce/apex/TaskController.createTask';

export default class CreateTask extends LightningElement {
    @track name;
    @track description = '';
    @track dueDate;

    /**
     * @description Handles the change event for the name input field.
     * @param {Event} event - The change event.
     */
    handleNameChange(event) {
        this.name = event.target.value;
    }

    /**
     * @description Handles the change event for the description textarea field.
     * @param {Event} event - The change event.
     */
    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    /**
     * @description Handles the change event for the due date input field.
     * @param {Event} event - The change event.
     */
    handleDueDateChange(event) {
        this.dueDate = event.target.value;
    }

    /**
     * @description Handles the form submit event.
     * @param {Event} event - The submit event.
     */
    handleFormSubmit(event) {
        event.preventDefault();

        if (!this.name) {
            return;
        }

        createTask({
            name: this.name,
            description: this.description,
            dueDate: this.dueDate,
        })
            .then(() => {
                this.name = '';
                this.description = '';
                this.dueDate = this.getDefaultDueDate();
                this.dispatchEvent(
                    new CustomEvent('taskcreated')
                );
                this.showToast('Success', 'Task created successfully.', 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    /**
     * @description Shows a toast message.
     * @param {string} title - The title of the toast message.
     * @param {string} message - The message of the toast.
     * @param {string} variant - The variant of the toast (e.g., 'success', 'error').
     */
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }

    /**
     * @description Initializes the dueDate property with the default due date.
     */
    connectedCallback() {
        this.dueDate = this.getDefaultDueDate();
    }

    /**
     * @description Gets the default due date as a string in the format 'YYYY-MM-DD'.
     * @returns {string} - The default due date.
     */
    getDefaultDueDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

//TODO: make hovers on the buttons
