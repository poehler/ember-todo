jQuery(document).ready(function($) {
	var spinnerOptions = {
		lines: 13, 
		length: 20,
		width: 10,
		radius: 30,
		corners: 0.8,
		rotate: 0,
		direction: 1,
		color: '#000',
		speed: 1, 
		trail: 51,
		shadow: false,
		hwaccel: false,
		className: 'spinner',
		zIndex: 2e9,
		top: 100,
		left: 300
	};

		
	$("#todo-1").after("<div class=\"spinner\"></div>")
	var spinnerTarget = $("#todo-1 + .spinner").get(0);
	var spinner = new Spinner(spinnerOptions).spin(spinnerTarget);

	var detectedComponents = {};

	var detectComponents = function(element) {
		$.each(element.className.split(" "), function() {
			var type = getComponentNameFromClass(this);
			if (typeof type === "string")
				detectedComponents[type] = true;			
		}); 
	};
	var getComponentNameFromClass = function(className) {
		var result = className.match(/(.*?)-component$/);
		if (result == null)
			return false;
		else
			return result[1];
	};

	$('[class*="-component"]').each(function(i, element) {
		detectComponents(element);
	});	

	Modernizr.load([

		//ToDo Ember Component
		{
			test: detectedComponents["todo"] != undefined,
			yep : 'components/todo/loader.js'
		},

		//Goober Component - Just for demonstration of multiple component loads.
		{
			test: detectedComponents["goober"] != undefined,
			yep : 'components/goober/loader.js'
		}

	]);
});
