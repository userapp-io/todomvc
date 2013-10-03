/*global todomvc */
'use strict';

/**
 * Services that persists and retrieves TODOs from the NodeJS backend if there is an active session
 */
todomvc.factory('todoStorage', function ($http, session) {
	var data = { todos: [] };

	return {
		reset: function() {
			data.todos.length = 0;
		},
		get: function (callback) {
			if (session.status().authorized) {
				$http.get('api/todos?token=' + session.token()).
					success(function(response, status, headers, config) {
						data.todos.length = 0;
						data.todos.push.apply(data.todos, response);
						callback && callback(null, response);
					}).
					error(function(response, status, headers, config) {
						callback && callback(status, response);
					});
			}

			return data;
		},
		put: function (todos) {
			if (session.status().authorized) {
				$http.post('api/todos?token=' + session.token(), todos).
					error(function(response, status, headers, config) {
						// Add error handling here?
					});
			}
		}
	};
});
