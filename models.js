
// User Additions?
Posts = new Meteor.Collection('posts');
/* Post Model
{
	authorId: the userId of the author of the post
	targetUserId: the team who the writer is writing too. to use a facebook paradigm, whose wall its on. Defaults to the author
	content: Text
	created_at: Date it was created
	like: array of user Ids of likers (for UI since we have only 12 users, might always show photos)
	meh: same as above but for dislikes
	hate: 'hate hate hate'
	comments: array of commentIds <- not sure I need this
}

*/

/* -------------- Post Permissions ---------------*/
/*Posts.allow({
	insert: function() {

	},

	update:function() {

	},

	remove: function () {

	}
});*/

/* ---------------------------------------------- */

/* Post Related Meteor Methods <- I don't think this stuff is necessary. use Meteor.allow/deny? */
Meteor.methods({

	createPost: function(text) {

	},

	deletePost: function (postId) {

	},

	likePost: function(postId) {

		if (this.userId) {
			var obj = {};
			obj.likes = Meteor.user().profile.id;
			Posts.update(postId, {$push: obj});
		}
	},

	unLikePost: function(postId) {
		if (this.userId) {
			var obj;
			this.likes.splice(this.likes.indexOf(Meteor.user().profile.id), 1);
			obj.likes = this.likes;
			Posts.update(postId, {$set: obj});
		}
	},

	mehPost: function(postId) {

	},

	hatePost: function (postId) {

	},
});


/* ----------------------------------------------- */


Comments = new Meteor.Collection('comments');
/* Comment Model
{
	authorId: the userId of the author of the post
	postId:
	content: Text
	created_at: Date it was created
	*cheers: array of user Ids of likers (for UI since we have only 12 users, might always show photos)
	*jeers: same as above but for dislikes
}

*/

/* ----------------- Comment Server Methods ---------- */
Meteor.methods({
	createComment: function(text, postId) {

	},

	deleteComment: function (commentId) {

	},

});
/* ------------------------------------------------------ */

Meteor.methods({
	mostHatedUser: function() {
		console.log('mostHatedUser');
	},

	mostLikedUser: function() {

	}
})

