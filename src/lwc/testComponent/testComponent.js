/**
 * Created by sergeymatevitsky on 08.05.2023.
 */

import {LightningElement, api} from 'lwc';
import updateToDoTask from '@salesforce/apex/TaskController.updateTask';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import deleteToDoTask from '@salesforce/apex/TaskController.deleteTask'

export default class TestComponent extends LightningElement {
    @api task;
    isEditing = false;

    updatedTask = {};

    handleNameChange(event) {
        this.updatedTask.name = event.target.value;
    }

    handleDescriptionChange(event) {
        this.updatedTask.description = event.target.value;
    }

    handleDueDateChange(event) {
        this.updatedTask.dueDate = event.target.value;
    }

    handleEdit() {
        // enable editing mode
        this.isEditing = true;

        // make a copy of the task object to update
        this.updatedTask = {...this.task};
    }

    handleDelete() {
        deleteToDoTask({taskId: this.task.Id})
            .then(result => {
                // Show success message
                const toastEvent = new ShowToastEvent({
                    title: 'Success',
                    message: 'Task deleted successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);

                // dispatch a custom event to notify parent component
                this.dispatchEvent(new CustomEvent('deletetask', {detail: this.task.Id}));
            })
            .catch(error => {
                // Show error message
                const toastEvent = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error deleting task',
                    variant: 'error'
                });
                this.dispatchEvent(toastEvent);
                console.error(error);
            });

        // dispatch a custom event to notify parent component
        this.dispatchEvent(new CustomEvent('deletetask', {detail: this.task.Id}));
    }

    handleCancel() {
        // reset the updatedTask object and disable editing mode
        this.updatedTask = {};
        this.isEditing = false;
    }

    handleSave() {
        // dispatch a custom event to notify parent component with updated task
        this.dispatchEvent(new CustomEvent('updatetask', {detail: this.updatedTask}));

        const updatedRecord = Object.assign(
            {},
            this.task,
            {
                Name: this.updatedTask.name,
                Due_Date__c: this.updatedTask.dueDate,
                Description__c: this.updatedTask.description
            }
        );

        updateToDoTask({task: updatedRecord})
            .then(result => {
                // Show success message
                const toastEvent = new ShowToastEvent({
                    title: 'Success',
                    message: 'Task updated successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);

                // Set isEditing flag to false and update the task variable
                this.isEditing = false;
                this.task = result;
            })
            .catch(error => {
                // Show error message
                const toastEvent = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error updating task',
                    variant: 'error'
                });
                this.dispatchEvent(toastEvent);
                console.error(error);
            });
    }
}
