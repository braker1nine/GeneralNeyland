if (Meteor.isClient){
	Meteor.startup(function() {

		var Workspace = Backbone.Router.extend({
			routes: {
				"":"home",
				"post/:post_id/":"post",
				"draft/":"draft",
				"history/":"history",
				"account/":"account",
				"*notFound":"notFound"
			},

			home: function() {
				if (Meteor.user()) {
					Session.set("page", "home");
				} else {
					Session.set("page","login");
				}
			},

			post: function(post_id) {
				if (Meteor.user()) {
					Session.set("page", "post");
					Session.set("viewing_post", post_id);
				} else {
					Session.set("page","login");
				}
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

			draft: function() {
				if (Meteor.user()) {
					Session.set("page","draft");
				} else {
					Session.set("page","login");
				}
			},

			history: function() {
				if(Meteor.user()) {
					Session.set("page", "history");
				} else {
					Session.set("page", "login");
				}
			},

			account: function() {
				if(Meteor.user()) {
					Session.set("page", "account");
				} else {
					Session.set("page", "login");
				}
			},

			notFound:function(path) {
				if (Meteor.user()) {
					Session.set("page","notFound");
				} else {
					Session.set("page","login");
				}
			}

		});

		Router = new Workspace;
		
		Backbone.history.start({pushState: true}); 
	});
}