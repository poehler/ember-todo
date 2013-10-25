(function() {
	"use strict";
	$.get("components/todo/templates.html", function(contents) {
		$("#todo-1").html(contents);
	});

	var emberLoadPollingDelay = 100;
	var timer = window.setInterval(function() {
		if (typeof window["ToDo"] === "object") {
			window.clearInterval(timer);
			$("#todo-1 + .spinner").remove();
		}
	}, emberLoadPollingDelay);
})()

