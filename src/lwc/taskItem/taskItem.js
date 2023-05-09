/**
 * @description Lightning web component that represents a task item.
 *              It provides functionality for editing, completing, and deleting tasks.
 * @module taskItem
 */

import { LightningElement, api } from 'lwc';
import updateToDoTask from '@salesforce/apex/TaskController.updateTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteToDoTask from '@salesforce/apex/TaskController.deleteTask';

export default class TaskItem extends LightningElement {
    /**
     * @type {Object} task - The task object passed to the component via the `@api` decorator.
     */
    @api task;

    /**
     * @type {boolean} isEditing - Indicates whether the task is currently in edit mode.
     *                             Default value is `false`.
     */
    isEditing = false;

    /**
     * @type {Object} updatedTask - Represents the updated task with modified properties during edit mode.
     *                              It contains the properties `name`, `description`, and `dueDate`.
     */
    updatedTask = {};

    /**
     * @description Computes whether the task is completable based on the `Status__c` field of the task.
     * @returns {boolean} - `true` if the task is not completed, `false` otherwise.
     */
    get isCompletable() {
        return this.task.Status__c !== 'Completed';
    }

    /**
     * @description Computes whether the task is editable based on the `Status__c` field of the task.
     * @returns {boolean} - `true` if the task is not completed, `false` otherwise.
     */
    get isEditable() {
        return this.task.Status__c !== 'Completed';
    }

    /**
     * @description Handles the change event for the name input field during edit mode.
     * @param {Event} event - The change event object.
     */
    handleNameChange(event) {
        this.updatedTask.Name = event.target.value;
    }

    /**
     * @description Handles the change event for the description input field during edit mode.
     * @param {Event} event - The change event object.
     */
    handleDescriptionChange(event) {
        this.updatedTask.Description__c = event.target.value;
    }

    /**
     * @description Handles the change event for the due date input field during edit mode.
     * @param {Event} event - The change event object.
     */
    handleDueDateChange(event) {
        this.updatedTask.Due_Date__c = event.target.value;
    }

    /**
     * @description Handles the click event for the edit button.
     *              Enables edit mode and initializes the `updatedTask` object with the current task.
     */
    handleEdit() {
        this.isEditing = true;
        this.updatedTask = { ...this.task };
    }

    /**
     * @description Handles the click event for the complete button.
     *              Updates the task status to 'Completed' and triggers an update in the database.
     *              Shows a toast message upon successful completion.
     *              Dispatches a 'completetask' event to notify the parent component.
     */
    handleComplete() {
        const updatedRecord = Object.assign(
            {},
            this.task,
            {
                Status__c: 'Completed'
            }
        );

        updateToDoTask({ task: updatedRecord })
            .then(() => {
                this.showToast('Success', 'Task completed', 'success');
                this.dispatchEvent(new CustomEvent('completetask', { bubbles: true, composed: true }));
            })
            .catch(error => {
                this.showToast('Error', 'Error updating task', 'error');
                console.error(error);
            });
    }

    /**
     * @description Handles the click event for the delete button.
     *              Deletes the task from the database and shows a toast message upon successful deletion.
     *              Dispatches a 'deletetask' event with the task id to notify the parent component.
     */
    handleDelete() {
        deleteToDoTask({ taskId: this.task.Id })
            .then(() => {
                this.showToast('Success', 'Task deleted successfully', 'success');
                this.dispatchEvent(new CustomEvent('deletetask', { detail: this.task.Id }));
            })
            .catch(error => {
                this.showToast('Error', 'Error deleting task', 'error');
                console.error(error);
            });
    }

    /**
     * @description Handles the click event for the cancel button.
     *              Resets the `updatedTask` object and disables edit mode.
     */
    handleCancel() {
        this.updatedTask = {};
        this.isEditing = false;
    }

    /**
     * @description Handles the click event for the save button.
     *              Updates the task with the modified properties and triggers an update in the database.
     *              Shows a toast message upon successful update.
     *              Disables edit mode, updates the task object with the result, and dispatches an 'updatetask' event.
     */
    handleSave() {
        const updatedRecord = Object.assign(
            {},
            this.task,
            {
                Name: this.updatedTask.Name,
                Due_Date__c: this.updatedTask.Due_Date__c,
                Description__c: this.updatedTask.Description__c
            }
        );
        updateToDoTask({ task: updatedRecord })
            .then(result => {
                this.showToast('Success', 'Task updated successfully', 'success');
                this.isEditing = false;
                this.task = result;
                this.dispatchEvent(new CustomEvent('updatetask', { detail: this.updatedTask }));
            })
            .catch(error => {
                this.showToast('Error', 'Error updating task', 'error');
                console.error(error);
            });
    }

    /**
     * @description Shows a toast message with the provided title, message, and variant.
     * @param {string} title - The title of the toast message.
     * @param {string} message - The message content of the toast.
     * @param {string} variant - The variant of the toast ('success', 'error', 'warning', 'info').
     */
    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(toastEvent);
    }
}
