"use strict";
var runUnitTests = true;
Modernizr.load([
	//ToDo Handlebars Component
	{
		test : typeof Handlebars == 'undefined',
        yep: ['/js/libs/handlebars-1.0.0.js']
	},
	//ToDo Ember Component
	{
		test : typeof Ember == 'undefined',
        yep: ['/js/libs/ember-1.0.0.js', '/js/libs/ember-data.js'],
	    both: [ '/components/todo/layout.js', '/components/todo/app.js', '/components/todo/style.css']
	},
	//ToDo Ember Component
	{
		test : runUnitTests,
	    yep: ['/js/tests/unit_test_helpers.js']
	}
	
]);
