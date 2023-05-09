/**
 * Created by sergeymatevitsky on 05.05.2023.
 */

import { LightningElement } from 'lwc';

export default class MainComponent extends LightningElement {
    notStartedStatus = 'Not Started';
    completedStatus = 'Completed';

    /**
     * @description Handles the task created event.
     */
    handleTaskCreated() {
        const taskList = this.template.querySelector('c-task-list');
        taskList.refresh();
    }

    /**
     * @description Handles the task complete event.
     */
    handleTaskComplete() {
        const taskLists = this.template.querySelectorAll('c-task-list');
        taskLists.forEach(taskList => {
            taskList.refresh();
        });
    }
}