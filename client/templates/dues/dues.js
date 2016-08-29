Session.setDefault('dues', 50);


Template.dues.helpers({
	dues_owed: function() {
		return Session.get('dues');
	},
	owner:function() {
		return Meteor.users.find({}, {
			sort: {
				'profile.id':1
			}
		});
	},

	paid:function() {
		return this.profile.dues_paid == true;
	},

	prize:function(place) {
		var dues = Session.get('dues')
		switch(place) {
			case 1:
				return dues*9;
				break;

			case 2:
				return dues*2;
				break;

			case 3:
				return dues;
				break;
		}
	}
});

Template.dues.events({
	'click .status':function(e) {
		if (GN.isAdmin()) {
			Meteor.call('toggle_dues', this._id, !this.profile.dues_paid, function(err,res) {
				console.log(err, res);
			});
		}
	},
	'click button.reset_dues': function(e) {
		GN.reset_dues(function(err, res) {
			debugger;
		});
	},
})
