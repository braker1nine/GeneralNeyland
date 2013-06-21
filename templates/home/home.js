if (Meteor.isClient) {

	Template.activityFeed.recentEntries = function() {
		return Posts.find({}, {sort:[["created_at", "desc"]]}).fetch()
	};

	Template.activityFeed.events({
		'click .createPost .btn': function(e) {
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


	Template.standings.teams = function() {
		return Meteor.users.find().fetch(); // need to sort these
	};

	Template.standingsRow.events({
		'click tr.user':function(e){
			Router.navigate('/user/'+this._id, {trigger:true});
		}
	})

}

if (Meteor.isServer) {
	Meteor.methods({
	})
}