/**
 * Created by sergeymatevitsky on 18.05.2023.
 */
public with sharing class TaskController {
    public class TaskControllerException extends Exception {
    }

    private static final TaskService taskService = new TaskService();

    /**
     * @description Retrieves tasks based on the provided status.
     * @param {String} status - The status of the tasks to retrieve.
     * @return {List<ToDo_Task__c>} - The list of tasks.
     */
    @AuraEnabled(Cacheable=true)
    public static List<ToDo_Task__c> getTasksByStatus(String status) {

        switch on status {
            when 'Not Started' {
                return taskService.getNotStartedTasks();
            }
            when 'Completed' {
                return taskService.getCompletedTasks();
            }
        }
        return new List<ToDo_Task__c>();
    }

    /**
     * @description Creates a new task with the provided details.
     * @param {String} name - The name of the task.
     * @param {String} description - The description of the task.
     * @param {Date} dueDate - The due date of the task.
     * @return {ToDo_Task__c} - The created task.
     * @throws TaskControllerException if the name is empty.
     */
    @AuraEnabled
    public static ToDo_Task__c createTask(String name, String description, Date dueDate) {
        if (nameNotValid(name)) {
            throw new TaskControllerException('Name cannot be empty');
        }

        String currentUserId = System.UserInfo.getUserId();
        ToDo_Task__c task = new ToDo_Task__c(
                Name = name,
                Description__c = description,
                Due_Date__c = dueDate,
                Assigned_To__c = currentUserId,
                Status__c = 'Not Started'
        );

        return taskService.insertTask(task);

    }

    private static Boolean nameNotValid(String name) {

        return String.isBlank(name);
    }

    /**
     * @description Updates an existing task.
     * @param {ToDo_Task__c} task - The task to update.
     * @return {ToDo_Task__c} - The updated task.
     */
    @AuraEnabled
    public static ToDo_Task__c updateTask(ToDo_Task__c task) {
        if (nameNotValid(task.Name)) {
            throw new TaskControllerException('Name cannot be empty');
        }
        return taskService.updateTask(task);
    }

    /**
     * @description Deletes a task based on the provided task ID.
     * @param {Id} taskId - The ID of the task to delete.
     * @return {ToDo_Task__c} - The deleted task.
     */
    @AuraEnabled
    public static ToDo_Task__c deleteTask(Id taskId) {
        ToDo_Task__c task = new ToDo_Task__c(Id = taskId);
        return taskService.deleteTask(task);
    }
}
