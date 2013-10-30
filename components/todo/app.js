// Create the application
"use strict";

window.ToDo = Ember.Application.create({rootElement: '#todo-1'});

ToDo.ApplicationAdapter = DS.FixtureAdapter.extend();

// Define validators and helpers
ToDo.validateTaskName = function (checkThisName) {
	var isValid = true;

	if (checkThisName == undefined) 
		isValid = false;
	else if (checkThisName.trim().length == 0)
		isValid = false;

	return isValid;
};

ToDo.validateStatus = function (checkThisStatus) {
	var isValid = true;

	if (checkThisStatus == undefined)
		isValid = false;
	else if (checkThisStatus.trim().length == 0)
		isValid = false;

	return isValid;
};

ToDo.validateDate = function (checkThisDate) {
	var isValid = true;
	var dateRegularExpression = /^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/;

	if (checkThisDate == undefined)
		isValid = false;
	else if (!checkThisDate.match(dateRegularExpression))
		isValid = false;
	else if (!ToDo.isValidDate(checkThisDate))
		isValid = false;

	return isValid;
};

ToDo.isValidDate = function(date) {
	var isValid = true;

	if (ToDo.isBlank(date))
		isValid = false;
	else if (isNaN((new Date(date)).getYear()))
		isValid = false;

	return isValid;
}

ToDo.isBlank = function(x) {
	return (x === undefined) || (x === "") || (x === null);
}

ToDo.getFormattedDateOrEmptyString = function(date, format, separator) {
	if(format === undefined)
		format = 'MMDDYYYY';

	if(separator === undefined)
		separator = '/';

	if (!ToDo.isValidDate(date))
		return "";
	else if (format == "YYYYMMDD") 
		return ToDo.formatDateYYYYMMDD(new Date(date), separator);
	else if (format == "MMDDYYYY") 
		return ToDo.formatDateMMDDYYYY(new Date(date), separator);


	return YYYY + separator + MM + separator + DD;
}

ToDo.formatDateYYYYMMDD = function(date, separator) {
	if(separator === undefined)
		separator = '/';

	var MM = ToDo.zeroPad(date.getMonth() + 1, 2);
	var DD = ToDo.zeroPad(date.getDate(), 2);
	var YYYY = date.getFullYear()

	return YYYY + separator + MM + separator + DD;
}

ToDo.formatDateMMDDYYYY = function(date, separator) {
	if(separator === undefined)
		separator = '/';

	var MM = ToDo.zeroPad(date.getMonth() + 1, 2);
	var DD = ToDo.zeroPad(date.getDate(), 2);
	var YYYY = date.getFullYear()

	return MM + separator + DD + separator + YYYY;
}

ToDo.zeroPad = function(number, width) {
	if(width === undefined)
		width = 1;

	var paddedResult = "" + number;

	while (width > paddedResult.length)
		paddedResult = "0" + paddedResult;

	return paddedResult;
}
// END of validators and helpers

// Router and Routes
ToDo.Router.map(function() {
	this.route("index", {path: "/"});
	this.route("about", {path: "/about"});
	this.resource("tasks", {path: "/tasks"}, function() {
		this.route("selectedTask", {path: ":task_id"});
	});
});

ToDo.AboutRoute = Ember.Route.extend({ });

ToDo.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('tasks');
	}
});

ToDo.TasksRoute = Ember.Route.extend({
	model: function() {
		ToDo.taskStatusCodes = Ember.ArrayController.create();
		this.store.find('status_code').then(
				function(result) {
					ToDo.taskStatusCodes = result;
				},
				function(error) {
					console.log("No Error Codes");
				}
		);
		return this.store.find('task');
	}
});
// END of Router and Routes

// MODELS
ToDo.StatusCode = DS.Model.extend({
	code: DS.attr('string'),
	decode: DS.attr('string')
});

// Fixtures for the app.
// TODO: Replace fixtures with call to AHR
ToDo.StatusCode.FIXTURES = [
		{ "id": "A", "decode": "Active"},
		{ "id": "I", "decode": "Inactive"},
		{ "id": "O", "decode": "On Hold"},
		{ "id": "C", "decode": "Completed"}
];
// END of Status Code Model

ToDo.Task = DS.Model.extend({
	taskName: DS.attr('string'),
	targetCompletionDate: DS.attr('date'),
	actualCompletionDate: DS.attr('date'),
	taskStatusCode: DS.attr('string'),

	taskStatus: function () {
		for(var ii=0;ii<ToDo.taskStatusCodes.toArray().length;ii++) 
			if (this.get('taskStatusCode') == ToDo.taskStatusCodes.toArray()[ii].get('id'))
				return ToDo.taskStatusCodes.toArray()[ii].get('decode');

		return ToDo.taskStatusCodes.toArray().length;
	}.property('taskStatusCode'),

	formattedTargetCompletionDate: function(key, value) {
		if(value)
			return value;
		else 
			return ToDo.getFormattedDateOrEmptyString(this.get('targetCompletionDate'));
	}.property('targetCompletionDate'),
	
	formattedActualCompletionDate: function(key, value) {
		if(value)
			return value;
		else 
			return ToDo.getFormattedDateOrEmptyString(this.get('actualCompletionDate'));
	}.property('actualCompletionDate'),

	sortedTargetCompletionDate: function() {
		return ToDo.getFormattedDateOrEmptyString(this.get('targetCompletionDate'), "YYYYMMDD", "");
	}.property('targetCompletionDate'),
	
	sortedActualCompletionDate: function() {
		return ToDo.getFormattedDateOrEmptyString(this.get('actualCompletionDate'), "YYYYMMDD", "");
	}.property('actualCompletionDate'),
		
	isLate:  function () {
		var currentDate = new Date();
		var targetDate = new Date(this.get('targetCompletionDate'));
		
		if (this.get('taskStatusCode') == "A") 
			if (targetDate < currentDate) 
				return true;
			else 
				return false;
		else
			return false;
	}.property('targetCompletionDate'),
	 
	isValidRecord: function() {
		var isValid = true;

		if (!ToDo.validateTaskName(this.get('taskName'))) 
			isValid = false;
		else if (!ToDo.validateStatus(this.get('taskStatusCode'))) 
			isValid = false;
		else if (!ToDo.validateDate(this.get('formattedTargetCompletionDate'))) 
			isValid = false;
		else if (this.get('taskStatusCode') == "C" && !ToDo.validateDate(this.get('formattedActualCompletionDate')))
			isValid = false;
		else if (this.get('formattedActualCompletionDate').trim().length > 0 && !ToDo.validateDate(this.get('formattedActualCompletionDate'))) 
			isValid = false;

		return isValid;
	}.property('taskName', 'taskStatusCode', 'formattedTargetCompletionDate', 'formattedActualCompletionDate'),

	isActive:  function () {
		return this.get('taskStatusCode') == "A"?true:false;
	}.property('taskStatusCode'),
	
	isInactive:  function () {
		return this.get('taskStatusCode') == "I"?true:false;
	}.property('taskStatusCode'),
	
	isOnHold:  function () {
		return this.get('taskStatusCode') == "O"?true:false;
	}.property('taskStatusCode'),
	
	isComplete:  function () {
		return this.get('taskStatusCode') == "C"?true:false;
	}.property('taskStatusCode')
	
});

// This is static fixture data
// TODO: Replace fixture data with dynamic AHR data
ToDo.Task.FIXTURES = [
	{ "id": 21, "taskName": "Task 31", "taskStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null},
	{ "id": 22, "taskName": "Task 32", "taskStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null},
	{ "id": 23, "taskName": "Task 33", "taskStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")},
	{ "id": 24, "taskName": "Task 34", "taskStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null}
];
// END MODELS

// Views
ToDo.EditTaskView = Ember.TextField.extend({
	didInsertElement: function () {
		this.$().focus();
	}
});

Ember.Handlebars.helper('edit-task', ToDo.EditTaskView);
// END Views

// Controllers
ToDo.TasksController = Ember.ArrayController.extend({
	sortProperties: ['sortedTargetCompletionDate'],
	sortAscending: true,
	newTaskName: "",
	newStatus: "A",
	newTargetCompletionDate: "",

	isSortedByTaskName: function() {
		if (this.sortProperties[0] == 'taskName')
			return true;
		else 
			return false;	
	}.property('sortProperties', 'sortAscending'),

	isSortedByTaskStatus: function() {
		if (this.sortProperties[0] == 'taskStatus')
			return true;
		else 
			return false;	
	}.property('sortProperties', 'sortAscending'),

	isSortedByTargetCompletionDate: function() {
		if (this.sortProperties[0] == 'sortedTargetCompletionDate')
			return true;
		else 
			return false;	
	}.property('sortProperties', 'sortAscending'),

	isSortedByActualCompletionDate: function() {
		if (this.sortProperties[0] == 'sortedActualCompletionDate')
			return true;
		else 
			return false;	
	}.property('sortProperties', 'sortAscending'),

	isValidRecord: function() {
		var isValid = true;

		if (!ToDo.validateTaskName(this.get('newTaskName'))) 
			isValid = false;
		else if (!ToDo.validateStatus(this.get('newStatus')))
			isValid = false;
		else if (!ToDo.validateDate(this.get('newTargetCompletionDate')))
			isValid = false;

		return isValid;
	}.property('newTaskName', 'newStatus', 'newTargetCompletionDate'),

	activeCount: function () {
		return this.filterBy('isActive', true).get('length');
	}.property('@each.isActive'),

	activeInflection: function () {
		var remaining = this.get('activeCount');
		return remaining === 1 ? 'task is' : 'tasks are';
	}.property('activeCount'),

	lateCount: function () {
		return this.filterBy('isLate', true).get('length');
	}.property('@each.isLate'),

	lateInflection: function () {
		var remaining = this.get('lateCount');
		return remaining === 1 ? 'task is' : 'tasks are';
	}.property('lateCount'),

	onHoldCount: function () {
		return this.filterBy('isOnHold', true).get('length');
	}.property('@each.isOnHold'),

	onHoldInflection: function () {
		var remaining = this.get('onHoldCount');
		return remaining === 1 ? 'task is' : 'tasks are';
	}.property('onHoldCount'),

	completeCount: function () {
		return this.filterBy('isComplete', true).get('length');
	}.property('@each.isComplete'),

	completeInflection: function () {
		var remaining = this.get('completeCount');
		return remaining === 1 ? 'task has' : 'tasks have';
	}.property('completeCount'),
	
	actions: {
		
		sortByTaskName: function() {
			if (this.get('sortProperties') == 'taskName')
				this.toggleProperty('sortAscending');
			else 
				this.set('sortProperties', ['taskName']);
		},

		sortByTaskStatus: function() {
			if (this.get('sortProperties') == 'taskStatus') 
				this.toggleProperty('sortAscending');
			else 
				this.set('sortProperties', ['taskStatus']);
		},
		
		sortByTargetCompletionDate: function() {
			if (this.get('sortProperties') == 'sortedTargetCompletionDate')
				this.toggleProperty('sortAscending');
			else
				this.set('sortProperties', ['sortedTargetCompletionDate']);
		},

		sortByActualCompletionDate: function() {
			if (this.get('sortProperties') == 'sortedActualCompletionDate')
				this.toggleProperty('sortAscending');
			else
				this.set('sortProperties', ['sortedActualCompletionDate']);
		},
	   
		createTask: function () {
			if (!this.get('isValidRecord'))
				return;

			var task = this.store.createRecord('task', {taskName: this.get('newTaskName'), 
														taskStatusCode: this.get('newStatus'), 
														targetCompletionDate: new Date(this.get('newTargetCompletionDate')) });
			this.set('newTaskName', "");
			this.set('newStatus', "A"); 
			this.set('newTargetCompletionDate', "");
			task.save();
		}
	}
});

ToDo.TaskController = Ember.ObjectController.extend({
	isEditing: false,
	userConfirmed: false,

	actions: {

		editTask: function () {
			this.set('isEditing', true);
		},

		acceptChanges: function () {
			if (!this.get('model.isValidRecord')) 
				return;

			this.set('model.targetCompletionDate', new Date(this.get('model.formattedTargetCompletionDate')));

			if (this.get('model.formattedActualCompletionDate').trim().length > 0)
				this.set('model.actualCompletionDate', new Date( this.get('model.formattedActualCompletionDate')));

			this.get('model').save();
			this.set('isEditing', false);
		},

		discardChanges: function () {
			this.set('isEditing', false);
			this.set('userConfirmed', false);
			this.get('model').rollback();
		},

		confirmRemoval: function () {
			this.set('userConfirmed', true);
		},

		doNotRemoveTask: function () {
			this.set('userConfirmed', false);
		},

		removeTask: function () {
			if (this.userConfirmed) {
				this.get('model').deleteRecord();
				this.get('model').save();
				this.userConfirmed = false;
			}
		}
	}
});
// END Controllers

