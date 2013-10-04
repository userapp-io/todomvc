/*global todomvc */
'use strict';

/**
 * Services for session management (login, sign-up, etc.)
 */
todomvc.factory('session', function ($http, $rootScope) {
	var user = {};
	var token = null;
	var status = { authorized: false };
	var heartBeatInterval = -1;

	return {
		user: user,
		status: function() {
			return status;
		},
		reset: function() {
			clearInterval(heartBeatInterval);
			token = null;
			status.authorized = false;

			for (var key in user) {
				delete user[key];
			}
		},
		token: function(value) {
			if (value) {
				token = value;
				UserApp.setToken(token);
				status.authorized = true;
			}
			
			return token;
		},
		login: function(user, callback) {
			var that = this;
			this.reset();

			UserApp.User.login(user, function(error, result) {
				if (!error && !result.lock_type) {
					that.token(result.token);
					that.startHeartbeat();

					// Get the logged in user
					that.getUser(function() {
						callback && callback(error, result);
					});

					$rootScope.$broadcast('login');
				} else {
					callback && callback(error, result);
				}
			});
		},
		logout: function(callback) {
			var that = this;

			UserApp.User.logout(function(error) {
				if (!error) {
					// Make sure to clear the cache at the backend too
					// (else the token will still be valid for a while)
					$http.delete('api/session?token=' + that.token());

					that.reset();
					$rootScope.$broadcast('logout');
				}

				callback && callback(error);
			});
		},
		getUser: function(callback) {
			var that = this;

			UserApp.User.get({ user_id: "self" }, function(error, result) {
				if (!error) {
					angular.extend(user, result[0]);
				}

				callback && callback(error, result);
			});
		},
		startHeartbeat: function(interval) {
			var that = this;

			clearInterval(heartBeatInterval);
			heartBeatInterval = setInterval(function() {
				UserApp.Token.heartbeat(function(error, result) {
					if (error) {
						that.reset();
						$rootScope.$broadcast('logout');
					} else {
						status.authorized = result.alive;
					}
				});
			}, interval || 20000);
		}
	};
});
