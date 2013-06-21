if (Meteor.isClient) {
	Template.user.posts = function() {
		return Posts.find({targetUserId:this.profile.id}, {sort:[["created_at", "desc"]]}).fetch();
	}
}