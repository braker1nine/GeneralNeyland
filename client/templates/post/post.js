var post;

var PostView = {
	getCurrentPost: function() {
		var id = Session.get('viewing_post')
		if (post && post._id == id) {
			return post;
		} else {
			return Posts.findOne(id);
		}
	}
}



_.extend(Template.post, {
	post: function() {
		return PostView.getCurrentPost();
	},
	authorName: function() {
		var author = Meteor.users.findOne({'profile.id':this.authorUserId});
		return author.profile.firstName + ' ' + author.profile.lastName;
	}
})
