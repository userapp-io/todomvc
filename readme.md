# [UserApp](https://www.userapp.io) Demo based on [TodoMVC](http://todomvc.com) with AngularJS and NodeJS

This demo application demonstrates how user authentication can be added to a simple web app using UserApp. It's based on the AngularJS version of TodoMVC and changes has been made to enable user log in, sign up and persistant storage of the todos with NodeJS.

## Dependencies

* MongoDB
* NodeJS, including express and mongoskin
* UserApp

## Getting started

* [Sign up](https://app.userapp.io/#/sign-up/) for a UserApp account
* Download the the demo application to your computer
* Install MongoDB
* Install NodeJS and npm
* Install the needed NodeJS libraries with npm (express and mongoskin)
* Open server.js and app/js/app.js and insert your own UserApp App Id (search for "YOUR-USERAPP-APP-ID")
* Run the NodeJS backend: node server.js
* Open a new browser tab and go to http://localhost:3000

## How it works

* UserApp handles the sessions which are created from the client side using JavaScript.
* When a user logs in a token is returned from UserApp.
* When retrieving and persisting todos, the token is sent along with the request to the NodeJS backend.
* The nodeJS server check that the token is valid and uses the user's id to get and save the todos.
* The server caches these requests up to 10 minutes. This way minimal requests and roundtrips are done to UserApp.

## What to do next?

* Create a permission that give users the right to create new todos, or just read them.
* Add functionality to reset the password. Hint: this must be done from the NodeJS backend.

## License

Everything in this repo is MIT License unless otherwise specified.

TodoMVC:

MIT © Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen Sawchuk.

NodeJS backend and incremental changes:

MIT © Timothy E. Johansson

_If you find any bugs or have any issues getting the demo app to run, please [let us know](https://github.com/userapp-io/todomvc/issues)._
