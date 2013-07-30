function sendEmailNotification(options) {
	if (isDev) {
		console.log('Sending emails to', options);
	} else {
		Email.send({
			to:options.to,
			from:options.from,
			html:options.body
		})
	}
}


var defaultOptions = {sort:[["created_at", "desc"]]};
Posts = new Meteor.Collection('posts');
Meteor.publish('posts', function(options) {
	if (!options) options = defaultOptions;
	return Posts.find({}, options);
});

var initialized = false;
Posts.find({}, defaultOptions).observe({
	added: function(post) {
		if (initialized) {
			var users = Meteor.users.find().fetch();
			var emails = _.map(_.filter(users, function(user) {
				return user._id != post.authorId;
			}), function(user) {
				return (user.emails && user.emails.length ? user.emails[0].address : '');
			});
			var sender = Meteor.users.findOne({'profile.id':post.authorUserId}) || {profile: {firstName:'Kaiser', lastName:'Sose'}};

			var body = '' + sender.profile.firstName + ' '  + sender.profile.lastName + ' has posted a <a href="' + Meteor.absoluteUrl() + 'post/' + post._id + '/">message</a>.';
			sendEmailNotification({
				from:(sender.emails && sender.emails.length ? sender.emails[0].address : 'notifications@generalneylandscup.com'),
				to: emails,
				body: body
			});
		}
	}
});
initialized = true;

Posts.allow({
	insert:function(userId, doc) {
		if (!userId) return false;


		return true;
	},
	update:function(userId, doc, fieldNames, modifier) {
		if (!userId) return false;

		return true;
	}
})

Meteor.publish('recent_posts', function() {

});


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



Comments = new Meteor.Collection('comments');
Meteor.publish('comments', function(post_id) {
	var selector = {};
	if (post_id) {
		selector = {postId:post_id};
	}
	return Comments.find(selector, {sort:[["created_at", "desc"]]});
});

/* For comment notifications */
var initialized = false;
Comments.find({}, defaultOptions).observe({
	added: function(comment) {
		if (initialized) {
			var post = Posts.findOne(comment.postId);
			var otherComments = Comments.find({postId:comment.postId}).fetch();
			var receivers = Meteor.users.find({
				$and:[
					{$or:[
						{'profile.id':{$in: _.pluck(otherComments, 'authorUserId')}},
						{'profile.id':post.authorUserId}

					]},
					{$not:{'profile.id':comment.authorUserId}}
				]
			}).fetch();
			var emails = _.map(receivers, function(user) {
				return (user.emails && user.emails.length ? user.emails[0].address : '');
			});

			var sender = Meteor.users.findOne({'profile.id':comment.authorUserId}) || {profile: {firstName:'Kaiser', lastName:'Sose'}};

			var body = '' + sender.profile.firstName + ' '  + sender.profile.lastName + ' commented on <a href="' + Meteor.absoluteUrl() + 'post/' + post._id + '/">a message</a>.';
			if (emails.length) {
				sendEmailNotification({
					from:(sender.emails && sender.emails.length ? sender.emails[0].address : 'notifications@generalneylandscup.com'),
					to: emails,
					body: body
				});
			}
		}
	}
});

initialized = true;

Comments.allow({
	insert:function(userId, doc) {
		if (!userId) return false;


		return true;
	}
})

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



Meteor.publish('users', function(){
	if (this.userId) {
		return Meteor.users.find();
	} else {
		return [];
	}
})