/**
 * Created by sergeymatevitsky on 08.05.2023.
 */

import {LightningElement, wire, track, api} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getIncompleteTasks from '@salesforce/apex/TaskController.getIncompleteTasks';
//import deleteTask from '@salesforce/apex/TaskController.deleteTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskList extends LightningElement {
    @track showEditModal = false;
    @track selectedTaskId;
    @api tasks;

    @wire(getIncompleteTasks)
    wiredTasks({error, data}) {
        if(data) {
            this.tasks = data;
            console.log('TASKS -> '+JSON.stringify(data));
        }else if (error) {
            console.error(error);
        }
    }


    handleEditClick(event) {
        this.selectedTaskId = event.target.dataset.id;
        this.showEditModal = true;
    }

    async handleDeleteClick(event) {
        const taskId = event.target.dataset.id;
        try {
           // await deleteTask({taskId: taskId});
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Task deleted successfully',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
            await refreshApex(this.tasks);
        } catch (error) {
            console.error(error);
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: 'Task deletion failed. Please try again.',
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
        }
    }

    handleTaskCreated() {
        this.showEditModal = false;
        return refreshApex(this.tasks);
    }

}
