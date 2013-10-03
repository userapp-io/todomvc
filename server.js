var application_root = __dirname,
	path = require('path'),
	express = require('express'),
	mongoskin = require('mongoskin'),
	https = require('https');

var app = express();
var db = mongoskin.db('localhost:27017/todo', { safe: true });
var appId = '5249fe9e9da83'; // YOUR-USERAPP-APP-ID

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.static(path.join(application_root, 'app')));
});

// User utilities
var User = {
	cache: {},

	// Get the authorizing user
	get: function(token, callback) {
		// Check in cache for an entry newer than 10 minutes
		if (this.cache[token] && (new Date().getTime() - this.cache[token].timestamp) < 10*60*1000) {
			// Found in cache
			callback(this.cache[token].user);
		} else {
			// Not found in cache
			https.request({
				method: 'POST',
				host: 'api.userapp.io',
				path: '/v1/user.get?app_id=' + appId + '&token=' + token
			}, function(response) {
				var str = '';

				response.on('data', function(chunk) {
					str += chunk;
				});

				response.on('end', function() {
					var object = JSON.parse(str);
					var user = (!object.error_code ? object[0] : null);

					// Add to cache
					User.cache[token] = { 
						timestamp: new Date().getTime(),
						user: user
					};

					callback && callback(user);
				});
			}).end();
		}
	},

	// Removes a user with its session token from the cache
	removeFromCache: function(token) {
		this.cache[token] = null;
	}
};

// POST
app.post('/api/todos', function(req, res, next) {
	User.get(req.query.token, function(user) {
		if (user) {
			var collection = db.collection('todos');

			collection.remove({ user_id: user.user_id }, function(error, result) {
				if (error) return next(error);
			});

			// Add user_id to all todos
			var items = req.body;
			for (var i = 0; i < items.length; ++i) {
				items[i].user_id = user.user_id;
			}

			collection.insert(items, {}, function(error, results) {
				if (error) return next(error);
				res.send(results);
			});
		}
	});
});

// GET
app.get('/api/todos', function(req, res, next) {
	User.get(req.query.token, function(user) {
		if (user) {
			db.collection('todos').find({ user_id: user.user_id }).toArray(function(error, result) {
				if (error) return next(error);
				res.send(result);
			});
		}
	});
});

// Logout
app.del('/api/session', function(req, res, next) {
	/* The actual logout is done from the client side. 
	   We just have to remove the user from the cache, 
	   invalidating its session token.
	*/
	User.removeFromCache(req.query.token);
	res.send({ result: "OK" });
});

// Listen on port 3000
app.listen(3000);