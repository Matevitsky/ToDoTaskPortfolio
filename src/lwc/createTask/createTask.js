import {LightningElement, track} from "lwc";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import createTask from '@salesforce/apex/TaskController.createTask';


export default class CreateTask extends LightningElement {


    name = '';
    description = '';
    dueDate = '';
    status = ''

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handleStatusChange(event) {
        this.status = event.target.value;
    }

    handleDueDateChange(event) {
        this.dueDate = event.target.value;
    }

//TODO: take status from DB
    statusOptions = [
        {label: 'Not Started', value: 'Not Started'},
        {label: 'In Progress', value: 'In Progress'},
        {label: 'Completed', value: 'Completed'}
    ];


    handleFormSubmit(event) {
        createTask({
            name: this.name,
            description: this.description,
            dueDate: this.dueDate,
            status: this.status
        })
            .then(() => {
                this.name = '';
                this.description = '';
                this.dueDate = '';
                this.showToast('Success', 'Task created successfully.', 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

}
