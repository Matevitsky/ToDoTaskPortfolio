@IsTest
private class TaskControllerTest {
    @IsTest
    static void testGetTasksByStatus() {

        List<ToDo_Task__c> notStartedTasks = new List<ToDo_Task__c>();

        List<ToDo_Task__c> result = TaskController.getTasksByStatus('Not Started');

        System.assertEquals(notStartedTasks.size(), result.size(), 'Incorrect number of tasks for Not Started status');


        List<ToDo_Task__c> completedTasks = new List<ToDo_Task__c>();

        result = TaskController.getTasksByStatus('Completed');


        System.assertEquals(completedTasks.size(), result.size(), 'Incorrect number of tasks for Completed status');

        List<ToDo_Task__c> unknownStatusTasks = new List<ToDo_Task__c>();


        result = TaskController.getTasksByStatus('Unknown');


        System.assertEquals(unknownStatusTasks.size(), result.size(), 'Incorrect number of tasks for unknown status');
    }

    @IsTest
    static void testCreateTask() {

        ToDo_Task__c createdTask = TaskController.createTask('Task 1', 'Description 1', Date.today());

        System.assertNotEquals(null, createdTask.Id, 'Task creation failed');

        try {
            TaskController.createTask('', 'Description 2', Date.today());
            System.assert(false, 'Expected TaskControllerException was not thrown');
        } catch (TaskController.TaskControllerException ex) {
            System.assertEquals('Name cannot be empty', ex.getMessage(), 'Incorrect exception message');
        }

    }

    @IsTest
    static void testUpdateTask() {

        ToDo_Task__c task = TaskController.createTask('Task 3', 'Description 3', Date.today());
        task.Name = 'Updated Task';
        ToDo_Task__c updatedTask = TaskController.updateTask(task);

        System.assertEquals('Updated Task', updatedTask.Name, 'Task update failed');

        task.Name = '';
        try {
            TaskController.updateTask(task);
            System.assert(false, 'Expected TaskControllerException was not thrown');
        } catch (TaskController.TaskControllerException ex) {
            System.assertEquals('Name cannot be empty', ex.getMessage(), 'Incorrect exception message');
        }

    }

    @IsTest
    static void testDeleteTask() {

        ToDo_Task__c task = TaskController.createTask('Task 4', 'Description 4', Date.today());
        ToDo_Task__c deletedTask = TaskController.deleteTask(task.Id);

        System.assertEquals(task.Id, deletedTask.Id, 'Task deletion failed');

    }
}

