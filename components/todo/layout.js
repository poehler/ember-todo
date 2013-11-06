(function() {
	"use strict";
	$('[class*="todo-component"]').each(function(i, element) {
        var todoDiv = '#' + this.id;
        var todoComponentName = this.getAttribute("data-component-name");
        var todoTemplate = this.getAttribute("data-template-name");
        function compile(template) {
            var templateName = template.split('/todo/').reverse()[0].replace('.handlebars', '');
            $.ajax({
                url: template,
                cache: false,
                async: false,
                success: function (source) {
                    var processedHandlebarTemplate= source.toString().replace(/#todoComponentName#/g, todoComponentName);
                    var input = Ember.Handlebars.precompile(processedHandlebarTemplate);
                    Ember.TEMPLATES[todoComponentName + "/" + templateName] = Ember.Handlebars.template(input);
                }
            });
    	}
    	compile('http://localhost:8082/components/todo/application.handlebars');
    	compile('http://localhost:8082/components/todo/tasks.handlebars');
    	compile('http://localhost:8082/components/todo/about.handlebars');

    	var emberLoadPollingDelay = 100;
    	var timer = window.setInterval(function() {
    		if (typeof window[todoComponentName] === "object") {
    			$(todoDiv + " + .loading").addClass("done");
    			$(todoDiv + " + .loading").remove();
    			window.clearInterval(timer);
    		}
    	}, emberLoadPollingDelay);
	});	
})()

