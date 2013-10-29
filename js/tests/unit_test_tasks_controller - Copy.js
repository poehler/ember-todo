
module("ToDo.TasksController", {
    setup: function () {
        Ember.run(this, function () {
            this.controller = ToDo.TasksController.create({});
        });
    }
});

// Run before each test case.
QUnit.testStart(function () {
    // Put the application into a known state, and destroy the defaultStore.
    // Be careful about DS.Model instances stored in ToDo; they'll be invalid
    // after this.
    // This is broken in some versions of Ember and Ember Data, see:
    // https://github.com/emberjs/data/issues/847
    Ember.run(function () { ToDo.reset(); });
    // Display an error if asynchronous operations are queued outside of
    // Ember.run.  You need this if you want to stay sane.
    Ember.testing = true;
});

// Run after each test case.
QUnit.testDone(function () {
    Ember.testing = false;
});


// Optional: Clean up after our last test so you can try out the app
// in the jsFiddle.  This isn't normally required.
QUnit.done(function () {
    Ember.run(function () { ToDo.reset(); });
});

// Load associations immediately, instead of waiting for FixtureAdapter's
// asynchronous loads.  Basically, all we need to do is access each object
// from inside Ember.run.
// TODO: We can't test this or insert where needed until ToDo.reset() works.
// TODO: Handle hasMany.
function loadAssociations(object /*, paths... */) {
    var paths = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < paths.length; i++) {
        var components = paths[i].split(".");
        for (var j = 0; j < components.length; j++) {
            Ember.run(function () {
                var path = components.slice(0, j+1).join(".");
                object.get(path);
            });
        }
    }
}


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

test('New Task Creation', function() {
    var obj = new ToDo.TasksController;
	obj.set('newTaskName', 'Goober');
	obj.set('newStatus', 'A');
	obj.set('newTargetCompletionDate', new Date("10/24/2013"));
	obj.store.createRecord('task', {taskName: 'Goober', taskStatusCode: 'A', targetCompletionDate: new Date("10/24/2013") });
    var result = ToDo.getFormattedDateOrEmptyString(obj.get('newTargetCompletionDate'), "MMDDYYYY", "/");
    equal(result, "10/24/2013", "formattedTargetCompletionDate was " + result);
});
