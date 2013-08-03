if (Meteor.isClient) {

	function printTimeAgo(time) {
		var now = new Date();
		var diff = now.getTime() - time;

		function printFunction(val, unit) {
			return val + ' '+ unit + (val != 1 ? 's':'') + ' ago';
		}

		var val;
		if (diff < 60*1000) {
			val = Math.round(diff/1000);
			return  val + ' seconds ago';
		} else if (diff < 1000*60*60) {
			val = Math.round(diff/(60*1000));
			return printFunction(val, 'minute');
		} else if (diff < 1000*60*60*24) {
			val = Math.round(diff/(1000*60*60));
			return printFunction(val, 'hour');
		} else if (diff < 1000*60*60*24*7) {
			val = Math.round(diff/(1000*60*60*24));
			return printFunction(val, 'day');
		} else if (diff < 1000*60*60*24*30) {
			val = Math.round(diff/(1000*60*60*24*7));
			return printFunction(val, 'week');
		} else if (diff < 100*60*60*24*365) {
			val = Math.round(diff/(1000*60*60*24*30));
			return printFunction(val, 'month');
		} else {
			val = Math.round(diff/(1000*60*60*24*365));
			return printFunction(val, 'year');
		}
	}
    
	Template.activityEntry.username = function() {
		var author = Meteor.users.findOne({'profile.id':this.authorUserId});
		if (author) {
			return author.profile.firstName + ' ' + author.profile.lastName
		} else {
		    return 'Kaiser Sose';
		}
	}

	Template.activityEntry.postTime = function() {
		var postDate = new Date(this.created_at);
		return printTimeAgo(postDate.getTime());
		
	};

	Template.activityEntry.variable = function(type) {
		if (this[type] && this[type].length) {
			return this[type].length;
		} else {
			return 0;
		}
	}

	Template.activityEntry.action = function(type) {
		if (this[type] && this[type].length) {
			if (this[type].indexOf(Meteor.user().profile.id) >= 0) return "active";
		}
	}

	Template.activityEntry.comments = function() {
		return Comments.find({postId:this._id}, {sort:["created_at", "asc"]}).fetch();
	};

	Template.activityEntry.events({
		'click .reactions .button':function(e) {
			debugger;
			var type = e.target.dataset.type;
			var obj = {}, modifier;
			
			if (this[type] && this[type].indexOf(Meteor.user().profile.id) >= 0) {
				this[type].splice(this[type].indexOf(Meteor.user().profile.id), 1);
				obj[type] = this[type];
				modifier = {$set:obj};
			} else {
				obj[type] = Meteor.user().profile.id;
				modifier = {$push:obj};
			}
			Posts.update(this._id, modifier, function(error) {
				debugger;
			});
		},

		'click .commentButton':function(e) {
			var text = $(e.target).prev('textarea').val();
			if (text != undefined && text != "") {
				Comments.insert({
					authorUserId:Meteor.user().profile.id,
					postId: this._id,
					content:text,
					created_at:Date.now()
				}, function(err, id) {
					console.log(err);
				})
			}
		},
		'click .postTime':function() {
			Router.navigate('/post/' + this._id + '/', true);
		}
	});

	Template.comment.authorName = function() {
		var user = Meteor.users.findOne({'profile.id':this.authorUserId});
		if (user) {
			return user.profile.firstName + ' ' + user.profile.lastName;
		} else {
			return 'Kaiser Sose';
		}
	};

	Template.comment.commentTime = function() {
		return printTimeAgo(this.created_at);
	}

	Template.comment.preserve(['img.img-polaroid']);
}