if (Meteor.isClient) {
	Session.setDefault('post_count', 10)

	/*PostsHandle = Meteor.subscribe('posts');
	PostsCursor = null;
	Deps.autorun(function() {
		if (PostsHandle != undefined && PostsHandle.ready()) {
			PostsCursor = Posts.find();

			PostsCursor.observe({
				added: function(id, fields) {

				},
				changed:function(id, fields) {
					debugger;
				}
			});

		}
	});*/


	Template.activityFeed.helpers({
		recentEntries: function() {
			return Posts.find({}, {sort:[["created_at", "desc"]], limit:Session.get('post_count')});
		},
		morePosts: function() {
			return Session.equals('post_count', Posts.find({}).count());
		}
	})

	Template.activityFeed.events({
		'click .createPost .postButton': function(e) {
			var text = $(e.target).parent().children('textarea').val();
			if (text && text != "") {
				Posts.insert({
					content:text,
					likes:[],
					mehs:[],
					hates:[],
					authorUserId:Meteor.user().profile.id,
					targetUserId:Meteor.user().profile.id,
					comments:[],
					created_at:Date.now()
				}, function (err, id) {
					if (err) {

					} else {
						console.log("Created post ", id);
						$('.createPost textarea').val('');
					}
				})
			}
		},
		'click .loadMorePosts': function(e) {
			Session.set('post_count', Session.get('post_count') + 10);
		}
	});

	function ResetPostReactions() {
		Posts.find().forEach(function(post) { 
			Posts.update(post._id, {$set:{likes:[]}});
			Posts.update(post._id, {$set:{mehs:[]}});
			Posts.update(post._id, {$set:{hates:[]}});
		});
	}

}