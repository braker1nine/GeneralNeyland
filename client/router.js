if (Meteor.isClient){
	Meteor.startup(function() {
		var view_handle;

		var Workspace = Backbone.Router.extend({
			routes: {
				"":"home",
				"post/:post_id/":"post",
				"draft/":"draft",
				"history/":"history",
				"account/":"account",
				"dues/":"dues",
				"*notFound":"notFound"
			},

			home: function() {
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if (Meteor.user()) {
						Session.set("page", "home");
					} else {
						Session.set("page","login");
					}
				});
			},

			post: function(post_id) {
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if (Meteor.user()) {
						Session.set("page", "post");
						Session.set("viewing_post", post_id);
					} else {
						Session.set("page","login");
					}
				});
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
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if (Meteor.user()) {
						Session.set("page","draft");
					} else {
						Session.set("page","login");
					}
				});
			},

			history: function() {
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if(Meteor.user()) {
						Session.set("page", "history");
					} else {
						Session.set("page", "login");
					}
				});
			},

			account: function() {
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if(Meteor.user()) {
						Session.set("page", "account");
					} else {
						Session.set("page", "login");
					}
				});
			},

			dues: function() {
				!view_handle || view_handle.stop();
				view_handle = Deps.autorun(function() {
					if(Meteor.user()) {
						Session.set("page", "dues");
					} else {
						Session.set("page", "login");
					}
				})
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
		
		Deps.autorun(function(){
			if (!Meteor.loggingIn()) {
				Backbone.history.start({pushState: true}); 
			}
		})
	});
}