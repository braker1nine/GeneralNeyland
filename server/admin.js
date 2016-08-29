Meteor.methods({
	setPassword: function(user, password) {
		if (this.userId && this.userId == Meteor.users.findOne({username:'chrisbrakebill'})._id) {
			Accounts.setPassword(user, password);
		}
	}
})