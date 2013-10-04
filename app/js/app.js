/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', []).run(function($rootScope, session, todoStorage) {
	// Initialize UserApp
	UserApp.initialize({
		appId:'YOUR-USERAPP-APP-ID' // YOUR-USERAPP-APP-ID
	});

	// The logged in user
	$rootScope.user = session.user;

	// Event triggered when logged in
	$rootScope.$on('login', function() {
		$rootScope.$apply(function() {
			todoStorage.get(); // Refresh todo list
		});
	});

	// Event triggered when logged out
	$rootScope.$on('logout', function() {
		$rootScope.$apply(function() {
			todoStorage.reset(); // Clear todo list
		});
	});

	// Logout
	$rootScope.logout = function() {
		session.logout();
	};
});