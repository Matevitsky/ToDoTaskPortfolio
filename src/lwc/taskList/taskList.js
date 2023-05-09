/**
 * Created by sergeymatevitsky on 08.05.2023.
 */

/**
 * @description A Lightning Web Component that displays a list of tasks and allows users to manage them.
 * @track - Indicates that the property's value should be tracked for changes.
 * @wire - Wire a function to a property or method to automatically call it with new data.
 * @api - Exposes a public property or method that can be used in parent components.
 */
import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getTasksByStatus from '@salesforce/apex/TaskController.getTasksByStatus';

export default class TaskList extends LightningElement {
    @api status;
    @track tasks; // Tracks changes to the tasks list
    wiredTasksResponse; // Holds the reference to the wired task data
    isCreatNewTask = false; // Flag to control the visibility of the create task component
    taskToDo = false; // Flag to indicate if there are tasks to be completed

    /**
     * @wire - Wire the getTasksByStatus Apex method to fetch tasks based on the provided status.
     * @param {string} status - The status of the tasks to fetch.
     * @returns {Object} wiredTasksResponse - The response received from the wire service.
     */
    @wire(getTasksByStatus, { status: '$status' })
    wiredTasks(result) {
        this.wiredTasksResponse = result;
        if (result.data) {
            this.tasks = result.data;
            this.showCreateTaskComponent();
        } else if (result.error) {
            console.log('ERROR ' + result.error);
        }
    }

    /**
     * @description Shows or hides the create task component based on the task status.
     */
    showCreateTaskComponent() {
        this.taskToDo = this.status !== 'Completed';
    }

    /**
     * @description Handles the task delete event and refreshes the task list by calling refreshApex.
     */
    handleTaskDelete() {
        refreshApex(this.wiredTasksResponse);
    }

    /**
     * @description Dispatches a custom event to indicate that a task has been completed.
     */
    handleCompleteTask() {
        this.dispatchEvent(new CustomEvent('completetask', { bubbles: true, composed: true }));
    }

    /**
     * @description Toggles the visibility of the create task component.
     */
    toggleCreateTask() {
        this.isCreatNewTask = !this.isCreatNewTask;
    }

    /**
     * @description Handles the task created event and refreshes the task list by calling refreshApex.
     */
    handleTaskCreated() {
        this.refresh();
        this.toggleCreateTask();
    }

    /**
     * @description Refreshes the task list by calling the refreshApex method.
     */
    @api
    refresh() {
        refreshApex(this.wiredTasksResponse);
    }

    /**
     * @description Computes the block name based on the task status.
     * @returns {string} blockName - The computed block name.
     */
    get blockName() {
        return this.status === 'Not Started' ? 'Tasks to do' : 'Completed tasks';
    }
}
