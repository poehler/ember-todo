jQuery(document).ready(function($) {
		
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
