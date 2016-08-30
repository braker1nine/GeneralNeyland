if (Meteor.isClient) {

	Template.activityEntry.helpers({
		class: function() {
			if (this.entry.previous && this.entry.previous.authorUserId == this.entry.authorUserId
				&& this.entry.previous.created_at == this.entry.created_at) {
				return ' repeat'
			} else {
				return '';
			}
		},
		gravatar: function() {
			var author = Meteor.users.findOne({'profile.id':this.entry.authorUserId});
			if (author) {
				var email = author.emails[0].address;
				return Gravatar.imageUrl(email)
			}
		},

		username: function() {
			var author = Meteor.users.findOne({'profile.id':this.entry.authorUserId});
			if (author) {
				return author.profile.firstName + ' ' + author.profile.lastName
			} else {
			    return '';
			}
		},

		variable: function(type) {
			if (this.entry[type] && this.entry[type].length) {
				return this.entry[type].length;
			} else {
				return 0;
			}
		},

		action: function(type) {
			if (this.entry[type] && this.entry[type].length) {
				if (this.entry[type].indexOf(Meteor.user().profile.id) >= 0) return "active";
			}
		},

		comments: function() {
			return Comments.find({postId:this.entry._id}, {sort:["created_at", "asc"]}).fetch();
		},
	})

	Template.activityEntry.events({
		'click .reactions .button':function(e) {
			var type = e.target.dataset.type;
			var obj = {}, modifier;
			
			if (this.entry[type] && this.entry[type].indexOf(Meteor.user().profile.id) >= 0) {
				this.entry[type].splice(this.entry[type].indexOf(Meteor.user().profile.id), 1);
				obj[type] = this.entry[type];
				modifier = {$set:obj};
			} else {
				obj[type] = Meteor.user().profile.id;
				modifier = {$push:obj};
			}
			Posts.update(this.entry._id, modifier, function(error) {
				debugger;
			});
		},
	});
}