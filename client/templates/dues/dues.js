var dues = 40;

Template.dues.helpers({
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
		if (Meteor.user() && Meteor.user().username == 'chrisbrakebill') {
			Meteor.call('toggle_dues', this._id, !this.profile.dues_paid, function(err,res) {
				debugger;
			});
		}
	}
})