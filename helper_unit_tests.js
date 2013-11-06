test('New Task Name Set', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTaskName', 'Goober');
    var result = obj.get('newTaskName');
    equal(result, 'Goober', "taskName was " + result);
});

test('New Task Status Set', function() {
    var obj = new ToDo.TasksController;
	obj.set('newStatus', 'A');
    var result = obj.get('newStatus');
    equal(result, 'A', "taskStatus was " + result);
});

test('New Task Target Completion Date', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTargetCompletionDate', new Date("10/24/2013"));
	var tmpDate = new Date("10/24/2013");
    var result = obj.get('newTargetCompletionDate') - tmpDate;
    equal(result, 0, "targetCompletionDate was " + result);
});

test('Formatted New Task Target Completion Date', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTargetCompletionDate', new Date("10/24/2013"));
    var result = ToDo.getFormattedDateOrEmptyString(obj.get('newTargetCompletionDate'), "MMDDYYYY", "");
    equal(result, "10242013", "formattedTargetCompletionDate was " + result);
});

test('Formatted New Task Target Completion Date 2', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTargetCompletionDate', new Date("10/24/2013"));
    var result = ToDo.getFormattedDateOrEmptyString(obj.get('newTargetCompletionDate'), "MMDDYYYY", "/");
    equal(result, "10/24/2013", "formattedTargetCompletionDate was " + result);
});

/*
test('New Task Creation', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTaskName', 'Goober');
	obj.set('newStatus', 'A');
	obj.set('newTargetCompletionDate', new Date("10/24/2013"));
	obj.store.createRecord('task', {taskName: 'Goober', taskStatusCode: 'A', targetCompletionDate: new Date("10/24/2013") });
    var result = ToDo.getFormattedDateOrEmptyString(obj.get('newTargetCompletionDate'), "MMDDYYYY", "/");
    equal(result, "10/24/2013", "formattedTargetCompletionDate was " + result);
});
*/
