module.exports = function(config) {
  config.set({
    port: 9876,
	proxies:  { '/': 'http://localhost:8082/' },
    frameworks: ['qunit'],
    browsers: ['PhantomJS'],
	plugins: [
		'karma-qunit',
		'karma-chrome-launcher',
		'karma-ember-preprocessor',
		'karma-phantomjs-launcher'
	],
	preprocessors: {
		"components/todo/templates.html": 'ember'
	},
    basePath: '',
    files: [
          "js/libs/jquery-1.9.1.js",
          "js/libs/modernizr.custom.32625.js",
          "js/libs/handlebars-1.0.0.js",
          "js/libs/ember-1.0.0.js",
          "js/libs/ember-data.js",
          "js/libs/spin.min.js",
          "js/component-loader.js",
          "components/todo/loader.js",
          "components/todo/app.js",
          "components/todo/layout.js",
          "components/todo/templates.html",
          "js/tests/unit_test_task_controller.js"//,
//          "js/tests/unit_test_helpers.js"
        ],
    exclude: [ ],
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    captureTimeout: 60000,
    singleRun: true
  });
};

