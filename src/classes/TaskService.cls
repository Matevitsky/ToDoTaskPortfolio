public with sharing class TaskService {
    public class TaskServiceException extends Exception {
    }

    public List<ToDo_Task__c> getNotStartedTasks() {
        String currentUserId = System.UserInfo.getUserId();
        List<ToDo_Task__c> notStartedTasks = [SELECT Id, Name, Description__c, Due_Date__c, Status__c, Assigned_To__c FROM ToDo_Task__c WHERE Assigned_To__c = :currentUserId AND Status__c = 'Not Started' ORDER BY CreatedDate DESC];
        return notStartedTasks;
    }

    public List<ToDo_Task__c> getCompletedTasks() {
        String currentUserId = System.UserInfo.getUserId();
        List<ToDo_Task__c> completedTasks = [SELECT Id, Name, Description__c, Due_Date__c, Status__c, Assigned_To__c FROM ToDo_Task__c WHERE Assigned_To__c = :currentUserId AND Status__c = 'Completed'];
        return completedTasks;
    }

    public ToDo_Task__c insertTask(ToDo_Task__c task) {
        try {
            Database.insert (task);
            return task;
        } catch (DmlException e) {
            throw new TaskServiceException('Could not create task: ' + e.getMessage());
        }
    }

    public ToDo_Task__c updateTask(ToDo_Task__c task) {
        try {
            Database.update (task);
            return task;
        } catch (DmlException e) {
            throw new TaskServiceException('Could not update task: ' + e.getMessage());
        }
    }

    public ToDo_Task__c deleteTask(ToDo_Task__c task) {
        try {
            Database.delete(task);
            return task;
        } catch (DmlException e) {
            throw new TaskServiceException('Could not delete task: ' + e.getMessage());
        }
    }
}