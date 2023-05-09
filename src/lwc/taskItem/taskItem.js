/**
 * Created by sergeymatevitsky on 08.05.2023.
 */

import {LightningElement,api} from 'lwc';

export default class TaskItem extends LightningElement {
    @api task;

    editTask() {
        // Dispatch an event to the parent component to notify that this task should be edited
        const editEvent = new CustomEvent('edittask', {
            detail: { taskId: this.task.Id }
        });
        this.dispatchEvent(editEvent);
    }

    deleteTask() {
        // Dispatch an event to the parent component to notify that this task should be deleted
        const deleteEvent = new CustomEvent('deletetask', {
            detail: { taskId: this.task.Id }
        });
        this.dispatchEvent(deleteEvent);
    }
}