if (Meteor.isClient) {


	Template.activityFeed.recentEntries = function() {
		return Posts.find().fetch()
	}

	Template.activityEntry.username = function() {
		var author = Meteor.users.findOne({profile:{id:this.authorUserId}});
	    return author.username;
	}

	Template.activityEntry.userCheered = function() {
		if (this.cheers && this.cheers.indexOf(Meteor.user().profile.id) > -1) return 'active';
	}

	Template.activityEntry.userJeered = function() {
		if (this.jeers && this.jeers.indexOf(Meteor.user().profile.id) > -1) return 'active';
	}

	Template.activityEntry.events({
		'click .cheersButton':function(e) {
			if (this.cheers && this.cheers.indexOf(Meteor.user().profile.id) >= 0) {
				this.cheers.splice(this.cheers.indexOf(Meteor.user().profile.id), 1);
				Posts.update(this._id, {$set: {cheers:this.cheers}});
			} else {
				Posts.update(this._id, {$push: {cheers:Meteor.user().profile.id}});
			}
		},
		'click .jeersButton':function(e) {
			if (this.jeers && this.jeers.indexOf(Meteor.user().profile.id) >= 0) {
				this.jeers.splice(this.jeers.indexOf(Meteor.user().profile.id), 1);
				Posts.update(this._id, {$set: {jeers:this.jeers}});
			} else {
				Posts.update(this._id, {$push: {jeers:Meteor.user().profile.id}});
			}
		}
	});
}