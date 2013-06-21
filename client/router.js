if (Meteor.isClient){
	var Router;
	Meteor.startup(function() {
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
				if (Meteor.user() || InvitedUsers.find({inviteCode:code}).count() == 0) {
					Router.navigate('/', {trigger:true});
				} else {
					Session.set("page", "signup");
					Session.set("signupcode", code);
					console.log('Signup for code ' + code);
				}
			},

			user: function(name) {
				Session.set("page", "user");
				Session.set("viewingUser", name);
				console.log('Routing to user ' + name);
			}	

		});

		Router = new Workspace;
		
		Backbone.history.start({pushState: true}); 
	});
}