module('integration tests', {
    setup: function() {
		ToDo.reset();
    }
});

test('Initial Redirect', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'tasks.index', 'Redirects to /tasks');
  });
});

test('ajax response with 2 people yields table with 2 rows', function() {
	
		visit("/tasks").then(function() {
			var rows = find("ul").length;
			equal(rows, 2, rows);
		});
});

