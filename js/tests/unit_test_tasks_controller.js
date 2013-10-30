
module("ToDo.TasksController", {
		
	setup: function() {
		ToDo.reset();
		ToDo.ApplicationAdapter = DS.FixtureAdapter.extend({ simulateRemoteResponse: false });
		ToDo.Task.FIXTURES = [
			{ "id": 21, "taskName": "Task 31", "taskStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null},
			{ "id": 22, "taskName": "Task 32", "taskStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null},
			{ "id": 23, "taskName": "Task 33", "taskStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")},
			{ "id": 24, "taskName": "Task 34", "taskStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null}
		];
	}
});

test('Initialize TasksController', function() {
	var controller = getTasksController();
	ok(controller, 'TasksController is ok');
});

test('Check Data', function() {

	var controller = getTasksController();
	var store = controller.get('store');
  
	Ember.run(function () {
		store.find('task',21).then(function(task) {                
			equal(task.get('taskName'), 'Task 31', "Default task not found expected 'Task 31' instead found: " + task.get('taskName'));
		});        
	});

});

test('Add task to store manually', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var foundNewTestTask = false

	Ember.run(function () {
		controller.set('newTaskName', "new Test Task");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "10/31/2013");
		controller.get("store").createRecord('task', {taskName: controller.get('newTaskName'), taskStatusCode: controller.get("newStatus"), targetCompletionDate: new Date(controller.get("newTargetCompletionDate"))});

		store.find('task').then(function(tasks) {                
			for(var ii=0;ii<tasks.toArray().length;ii++) 
				if(tasks.toArray()[ii].get('taskName') == "new Test Task")
					foundNewTestTask = true;

		});        
	});
	equal(foundNewTestTask, true, "New Task Found");

});

test('Add task to store using controller action', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var foundNewTestTask = false

	Ember.run(function () {
		controller.set('newTaskName', "new Test Task 2");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "10/31/2013");
		controller.send("createTask");

		store.find('task').then(function(tasks) {                
			for(var ii=0;ii<tasks.toArray().length;ii++)
				if(tasks.toArray()[ii].get('taskName') == "new Test Task 2") 
					foundNewTestTask = true;
		});        
	});
	equal(foundNewTestTask, true, "New Task Found");

});

test('Validate Valid Record', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var isValidRecord = false

	Ember.run(function () {
		controller.set('newTaskName', "Validate good record");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "10/31/2013");
		isValidRecord = controller.get("isValidRecord");
	});
	equal(isValidRecord, true, "Record was valid.  Expected true received: " + isValidRecord);

});

test('Validate Invalid Record', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var isValidRecord = true

	Ember.run(function () {
		controller.set('newTaskName', "");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "10/31/2013");
		isValidRecord = controller.get("isValidRecord");
	});
	equal(isValidRecord, false, "Record was invalid (no name).  Expected false received: " + isValidRecord);

});

test('Validate Invalid Record', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var isValidRecord = true

	Ember.run(function () {
		controller.set('newTaskName', "invalid recored");
		controller.set('newStatus', ""); 
		controller.set('newTargetCompletionDate', "10/31/2013");
		isValidRecord = controller.get("isValidRecord");
	});
	equal(isValidRecord, false, "Record was invalid (no status).  Expected false received: " + isValidRecord);

});

test('Validate Invalid Record', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var isValidRecord = true

	Ember.run(function () {
		controller.set('newTaskName', "invalid record");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "");
		isValidRecord = controller.get("isValidRecord");
	});
	equal(isValidRecord, false, "Record was invalid (no completion date).  Expected false received: " + isValidRecord);

});

test('Validate Invalid Record', function() {
	var controller = getTasksController();
	var store = controller.get('store');
	var isValidRecord = true

	Ember.run(function () {
		controller.set('newTaskName', "invalid record");
		controller.set('newStatus', "A"); 
		controller.set('newTargetCompletionDate', "13/40/2013");
		isValidRecord = controller.get("isValidRecord");
	});
	equal(isValidRecord, false, "Record was invalid (invalid completion date).  Expected false received: " + isValidRecord);

});

test('Validate Sorting by Task Name', function() {
	var controller = getTasksController();

	controller.set("sortProperties", ["targetCompletionDate"]);
	controller.set("sortAscending", true);

	Ember.run(function () {
		controller.send("sortByTaskName");
		controller.get("isSortedByTaskName");
		equal(controller.get("sortProperties"), "taskName", "Sort by TaskName did not work.  Expected taskName received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), true, "Sort by TaskName ascending.  Expected true received: " + controller.get("sortAscending"));

		controller.send("sortByTaskName");
		controller.get("isSortedByTaskName");
		equal(controller.get("sortProperties"), "taskName", "Sort by TaskName did not work.  Expected taskName received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), false, "Sort by TaskName descending.  Expected false received: " + controller.get("sortAscending"));
	});

});

test('Validate Sorting by Task Status', function() {
	var controller = getTasksController();

	controller.set("sortProperties", ["targetCompletionDate"]);
	controller.set("sortAscending", true);

	Ember.run(function () {
		controller.send("sortByTaskStatus");
		controller.get("isSortedByTaskStatus");
		equal(controller.get("sortProperties"), "taskStatus", "Sort by Status did not work.  Expected taskStatus received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), true, "Sort by Status ascending.  Expected true received: " + controller.get("sortAscending"));

		controller.send("sortByTaskStatus");
		controller.get("isSortedByTaskStatus");
		equal(controller.get("sortProperties"), "taskStatus", "Sort by Status did not work.  Expected taskStatus received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), false, "Sort by Status descending.  Expected false received: " + controller.get("sortAscending"));
	});

});

test('Validate Sorting by Task Target Completion Date', function() {
	var controller = getTasksController();

	controller.set("sortProperties", ["taskName"]);
	controller.set("sortAscending", true);

	Ember.run(function () {
		controller.send("sortByTargetCompletionDate");
		controller.get("isSortedByTargetCompletionDate");
		equal(controller.get("sortProperties"), "sortedTargetCompletionDate", "Sort by TargetCompletionDate did not work.  Expected sortedTargetCompletionDate received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), true, "Sort by TargetCompletionDate ascending.  Expected true received: " + controller.get("sortAscending"));

		controller.send("sortByTargetCompletionDate");
		controller.get("isSortedByTargetCompletionDate");
		equal(controller.get("sortProperties"), "sortedTargetCompletionDate", "Sort by TargetCompletionDate did not work.  Expected sortedTargetCompletionDate received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), false, "Sort by TargetCompletionDate descending.  Expected false received: " + controller.get("sortAscending"));
	});

});

test('Validate Sorting by Task Actual Completion Date', function() {
	var controller = getTasksController();

	controller.set("sortProperties", ["taskName"]);
	controller.set("sortAscending", true);

	Ember.run(function () {
		controller.send("sortByActualCompletionDate");
		controller.get("isSortedByActualCompletionDate");
		equal(controller.get("sortProperties"), "sortedActualCompletionDate", "Sort by ActualCompletionDate did not work.  Expected sortedActualCompletionDate received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), true, "Sort by ActualCompletionDate ascending.  Expected true received: " + controller.get("sortAscending"));

		controller.send("sortByActualCompletionDate");
		controller.get("isSortedByActualCompletionDate");
		equal(controller.get("sortProperties"), "sortedActualCompletionDate", "Sort by ActualCompletionDate did not work.  Expected sortedActualCompletionDate received: " + controller.get("sortProperties"));
		equal(controller.get("sortAscending"), false, "Sort by ActualCompletionDate descending.  Expected false received: " + controller.get("sortAscending"));
	});

});

