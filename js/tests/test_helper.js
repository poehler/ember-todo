(function (host) {
  var document = host.document;
  var ToDo = host.ToDo;

  var testing = function(){
    var helper = {
      container: function(){
        return ToDo.__container__;
      },
      route: function( name ){
        return helper.container().lookup('route:' + name);
      },
      controller: function( name ){
        return helper.container().lookup('controller:' + name);
      },
      path: function(){
        return helper.controller('application').get('currentPath');
      }
    };
    return helper;
  };

  Ember.Test.registerHelper('path', function() {
    return testing().path();
  });

  Ember.Test.registerHelper('getTaskController', function() {
    return testing().controller('task');
  });

  Ember.Test.registerHelper('getTasksRoute', function() {
    return testing().route('tasks');
  });


  Ember.Test.registerHelper('getTasksController', function() {
    return testing().controller('tasks');
  });

  // Move app to an element on the page so it can be seen while testing.
  document.write('<div id="test-app-container"><div id="ember-testing"></div></div>');
  ToDo.rootElement = '#ember-testing';
  ToDo.setupForTesting();
  ToDo.injectTestHelpers();

}(window));
