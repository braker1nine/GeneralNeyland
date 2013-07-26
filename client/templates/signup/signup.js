if (Meteor.isClient) {
	Template.signup.inviteCode = function() {
		return Session.get("signupcode");
	};

	Template.signup.events({
		'click #createAccountButton':function(e) {
			e.preventDefault();
			// Need to authenticate the code


			Meteor.loginWithFacebook({
				requestPermissions: []
			}, function (err) {
				if (err) {
					Session.set('errorMessage', err.reason || 'Unknown error');
				} else {
					Router.navigate("", {trigger:true});
				}
			});
		}
	})
}