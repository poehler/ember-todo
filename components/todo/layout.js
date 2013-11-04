(function() {
	"use strict";
	function compile(template) {
	  var templateName = template.split('/todo/').reverse()[0].replace('.handlebars', '');
	  $.ajax({
		url: template,
		cache: false,
		async: false,
		success: function (source) {
		  var input = Ember.Handlebars.precompile(source.toString());
		  Ember.TEMPLATES[templateName] = Ember.Handlebars.template(input);
		}
	  });
	}
	compile('http://localhost:8082/components/todo/application.handlebars');
	compile('http://localhost:8082/components/todo/tasks.handlebars');
	compile('http://localhost:8082/components/todo/about.handlebars');

	var emberLoadPollingDelay = 100;
	var timer = window.setInterval(function() {
		if (typeof window["ToDo"] === "object") {
			$("#todo-1 + .loading").addClass("done");
			$("#todo-1 + .loading").remove();
			window.clearInterval(timer);
		}
	}, emberLoadPollingDelay);
})()

