function sendEmailNotification(options) {
	/*if (isDev) {
		console.log('Sending emails', options);
		Email.send({
			to:'chris@brakebill.me',
			from: options.from,
			html: options.body
		})
	} else {
		Email.send({
			to:options.to,
			from:options.from,
			html:options.body
		})
	}*/
}

var converter = new Showdown.converter();

var defaultOptions = {sort:[["created_at", "desc"]]};
Posts = new Meteor.Collection('posts');
Meteor.publish('current_post', function(post_id, options) {
	if (!options) options = defaultOptions;
	if (!post_id) return [];

	return Posts.find(post_id, options);
});

Meteor.publish('recent_posts', function(count) {
	if (typeof count == 'undefined') { count = 10; }
	var options = _.clone(defaultOptions);
	options.limit = count;
	return Posts.find({}, options)
});

var initialized = false;
Posts.find({}, defaultOptions).observe({
	added: function(post) {
		if (initialized) {
			var users = Meteor.users.find().fetch();
			var emails = _.map(_.filter(users, function(user) {
				return user._id != post.authorId && user.profile.disableEmails != true;
			}), function(user) {
				return (user.emails && user.emails.length ? user.emails[0].address : '');
			});
			var sender = Meteor.users.findOne({'profile.id':post.authorUserId}) || {profile: {firstName:'Kaiser', lastName:'Sose'}};

			var body = '' + sender.profile.firstName + ' '  + sender.profile.lastName + ' has posted a <a href="' + Meteor.absoluteUrl() + 'post/' + post._id + '/">message</a>. ';
				body += '<blockquote style="margin:20px;padding:20px;border-radius:0; background:#EEE;color:#666;">'+converter.makeHtml(post.content)+'</blockquote>'
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

initialized = true;


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


/* ---------------------- #Dues Methods -------------- */
Meteor.methods({
	toggle_dues: function(_id, val) {
		if (Meteor.user() && Meteor.user().username == 'chrisbrakebill') {
			Meteor.users.update(_id, {$set: {
				'profile.dues_paid':val
			}});

			if (val == true) {
				var payer = Meteor.users.findOne(_id);
				var emails = Meteor.users.find({}, {fields:{
					emails:1
				}}).fetch();
				emails = _.map(emails, function(user) {
					return user.emails[0].address
				});

				sendEmailNotification({
					to:emails,
					from:'dues@generalneylandscup.com',
					body:payer.profile.firstName + ' has paid his league dues.'
				});
			}
		}
	},
	reset_dues: function() {
		console.log('resetting dues');
		Meteor.users.update({}, {$set: {
			'profile.dues_paid':false
		}}, {
			multi:true
		});
	},
})

Meteor.users.allow({
	update:function(userId, doc, fieldNames, modifier) {
		var user = !userId || Meteor.users.findOne(userId);
		if (user && user.username == 'chrisbrakebill') {
			return true;
		} else {
			return false;
		}
	}
})

Meteor.publish('users', function(){
	if (this.userId) {
		return Meteor.users.find();
	} else {
		return [];
	}
})

Meteor.methods({
	update_email: function(email) {
		if (this.userId) {

			var oldEmail = Meteor.user().emails[0].address;

			Meteor.users.update(this.userId, { $pull: { 'emails': {
				address: oldEmail
			}}});


			Meteor.users.update(this.userId, { $push: { 'emails': {
				address: email,
				verified: false
			}}});

			return email;
		} else {
			return new Meteor.Error(401);
		}
	}
})
