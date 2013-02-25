if (Meteor.isClient){
	var Workspace = Backbone.Router.extend({
		routes: {
			"":"home",
			"signup/:code":"signup",
			"user/:name":"user"
		},

		home: function() {
			Session.set("page", "home");
		},

		signup: function(code) {
			Session.set("page", "signup");
			Session.set("signupcode", code);
			console.log('Signup for code ' + code);
		},

		user: function(name) {
			Session.set("page", "user");
			console.log('Routing to user ' + name);
		}	

	});

	var Router = new Workspace;
}