if (Meteor.isServer) {
	var ownerData = [
		{
			id:1,
			name:'Chris Brakebill' 
		},
		{
			id:2,
			name: 'Danny Petersen'
		},
		{
			id:3,
			name: 'Dan Wells'
		},
		{
			id:4,
			name: 'Mike Gilmore'
		},
		{
			id:5,
			name: 'Bret Vukoder' 
		},
		{
			id:6,
			name: 'Jay Slagle'
		},
		{
			id:7,
			name: 'Henry Shiflett'
		},
		{
			id:8,
			name: 'Jameson Bundy'
		},
		{
			id:9,
			name: 'Stuart Deaderick'
		},
		{
			id:10,
			name: 'Eric Sollenberger'
		},
		{
			id:11,
			name: 'Mark Hoffman'
		},
		{
			id:12,
			name: 'Matt Davis'
		}
	];

	Meteor.startup(function() {
		// Temporary solution for testing
		// Need to initialize the signupDataCollection
		for (var i = ownerData.length - 1; i >= 0; i--) {
			if (Meteor.users.find({profile:{id:ownerData[i].id}}).count() == 0){
				Accounts.createUser({
					username: ownerData[i].name,
					password: ownerData[i].name,
					profile: {
						id: ownerData[i].id
					}
				})
			}
		};
	});

	// Temporary
	Meteor.users.allow({
		remove: function() {
			return true;
		}
	});
}


if (Meteor.isClient) {
	Template.signup.inviteCode = function() {
		return Session.get("signupcode");
	};

	Template.signup.userName = function() {
		return "Chris Brakebill";
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