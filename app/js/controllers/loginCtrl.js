/*global todomvc, angular */
'use strict';

/**
 * The login controller (handles both login and sign-up)
 */
todomvc.controller('LoginCtrl', function TodoCtrl($scope, $rootScope, $location, session, todoStorage, filterFilter) {
	$scope.user = {};
	$scope.status = session.status();

	$scope.login = function() {
		session.login($scope.user, function(error, result) {
			if (error) {
				// Maybe wrong password?
				alert(error.message);
			} else if (result.lock_type) {
				// The user is locked
				alert('User is locked: ' + result.lock_type);
			} else {
				$scope.user = {};
			}

			$scope.$apply();
		});
	};

	$scope.signup = function() {
		UserApp.User.save($scope.user, function(error, result) {
			if (error) {
				// Something went wrong
				alert(error.message);
			} else {
				// Signed up, show login form
				$scope.form = 'login';
			}
			
			$scope.$apply();
		});
	};
});
