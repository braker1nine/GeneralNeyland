if (Meteor.isClient) {
	
	Deps.autorun(function(){
		if (!Meteor.loggingIn()) {
			UsersHandle = Meteor.subscribe('users');
		}
	});

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


	Template.activityFeed.recentEntries = function() {
		return Posts.find({}, {sort:[["created_at", "desc"]]}).fetch();
	};

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
					}
				})
			}
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