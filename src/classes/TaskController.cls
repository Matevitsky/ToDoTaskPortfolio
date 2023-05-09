/**
 * Created by sergeymatevitsky on 05.05.2023.
 */

public with sharing class TaskController {

    @AuraEnabled(Cacheable=true)
    public static List<ToDo_Task__c> getIncompleteTasks() {
        String currentUserId = System.UserInfo.getUserId();
        return [SELECT Id, Name, Description__c, Due_Date__c, Status__c, Assigned_To__c FROM ToDo_Task__c WHERE Assigned_To__c = :currentUserId AND Status__c != 'Completed'];
    }

    @AuraEnabled(Cacheable=true)
    public static List<ToDo_Task__c> getCompletedTasks(Id userId) {
        return [SELECT Id, Name, Description__c, Due_Date__c, Status__c, Assigned_To__c FROM ToDo_Task__c WHERE Assigned_To__c = :userId AND Status__c = 'Completed'];
    }

    @AuraEnabled
    public static ToDo_Task__c createTask(String name, String description, Date dueDate, String status) {
        String currentUserId = System.UserInfo.getUserId();
        ToDo_Task__c task = new ToDo_Task__c(Name = name, Description__c = description, Due_Date__c = dueDate, Assigned_To__c =currentUserId, Status__c = status);
        System.debug('TASK To Create ' + task);
        insert task;
        return task;
    }

    @AuraEnabled
    public static ToDo_Task__c updateTask(ToDo_Task__c task) {
        //Add validation or additional logic here
        System.debug('Task to update  '+task);
        update task;
        return task;
    }

    @AuraEnabled
    public static void deleteTask(Id taskId) {
        ToDo_Task__c task = new ToDo_Task__c(Id = taskId);
        delete task;
    }
}