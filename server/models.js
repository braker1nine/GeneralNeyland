Drafts = new Meteor.Collection('drafts');
Picks = new Meteor.Collection('picks');

// Draft Constants
var PICKS_PER_ROUND = 12,
	ROUNDS = 14;

/* 

Picks Data Model
round - int
index - overall selection
player - (probably an id?)
owner/user - id
draftId

*/
// Publish the draft model
if (Meteor.isServer) {
	Meteor.publish('picks', function(draftId) {
		return Picks.find({draft_id:draftId});
	});

	Meteor.publish('drafts', function() {
		return Drafts.find();
	});
} else if (Meteor.isClient) {
	
}



/*

Draft Data Model
year
order - array of userIds
teams
leagueId

*/


/* DRAFT CONSTANTS */
if (Meteor.isServer) {

Meteor.methods({

	/*
		Params is an object with draft positions keyed on user id or username
	*/
	setDraftOrder: function() {
		if (Meteor.user() && Meteor.user().username == 'chrisbrakebill') {
			var shuffled_owners = _.shuffle(_.map(Meteor.users.find().fetch(), function(user) {
				return ((user && user.profile) ? user.profile.id : -1);
			}));

			for (var i = 0; i < shuffled_owners.length; i++) {
				Meteor.users.update({'profile.id':shuffled_owners[i]}, {$set: {'profile.draft_slot':(i+1)}});
			};

			return shuffled_owners;

		} else {
			return new Meteor.Error(403, 'NO WAY JOSE');
		}

	},

	initializeDraft: function (isMock) {
		var new_draft = {};
		new_draft.year = new Date().getYear();

		//Drafts.remove({year:new_draft.year});

		// Grab the owner ids and shuffle them
		
		new_draft.order = _.map(Meteor.users.find({}, {sort:{'profile.draft_slot':1}}).fetch(), function(user){ return user.profile.id});
		console.log(new_draft.order);
		new_draft.isMock = (isMock == true);
		var id = Drafts.insert(new_draft);
		

		if (id) {
			new_draft = Drafts.findOne(id);
			var new_pick, pick_id
			// Instantiate pick objects for the draft
			for (var i = 0; i < ROUNDS; i++) {
				for (var j = 0; j < new_draft.order.length; j++) {
					new_pick = {};
					new_pick.round = i+1;
					new_pick.overall = (i*new_draft.order.length) + j + 1;
					new_pick.draft_id = new_draft._id;
					new_pick.owner = new_draft.order[(i % 2 == 0) ? (j):(new_draft.order.length - (j+1))];
					console.log('Inserting new pick', new_pick);
					pick_id = Picks.insert(new_pick);
					if (!pick_id) {
						console.log('!!! ---- Insert failed ---- !!!');
					}
				}
			}

			return id;

		} else {
			return null;
		}
	},

	beginDraft: function(draft_id) {
		var draft = Drafts.findOne(draft_id);
		if (draft) {
			Drafts.update(draft_id, {
				$set: {
					current_pick: 1,
				}
			});
		} else {
			return new Meteor.Error(404, 'Could not find the league.');
		}
	},

	makePick: function(draft_id, player_id) {
		var draft = Drafts.findOne(draft_id);
		if (draft) {
			console.log(draft);
			console.log('draft_id: ' + draft_id + ', current_pick: ' + draft.current_pick);
			var current_pick = Picks.findOne({
				draft_id:draft_id,
				overall: draft.current_pick
			});

			if (current_pick) {
				console.log('Making pick for pick');
				var pick_owner = Meteor.users.findOne({'profile.id':current_pick.owner});
				if (this.userId == pick_owner._id || (Meteor.user() && Meteor.user().username == 'chrisbrakebill')) {
					var player = Players.findOne(player_id);

					if (player) {
						if (player.owner) {
							return new Meteor.Error(400, 'Player was already selected.');
						}

						Picks.update({
							draft_id:draft_id,
							overall: draft.current_pick
						}, {
							$set: {
								player_id:player_id
							}
						});

						Players.update(player_id, {$set: {owner:current_pick.owner}});

						Drafts.update(draft_id, {
							$inc: {
								current_pick:1
							}
						})
						var owner = Meteor.users.findOne({'profile.id':current_pick.owner});
						console.log(owner.username + ' picked ' + player.firstName + ' ' + player.lastName);
					} else {
						return new Meteor.Error(404, 'Player not found.');
					}

				} else {
					return new Meteor.Error(403, 'Not your pick bro.');
				}

			} else {
				return new Meteor.Error(400, 'No pick.');
			}

		} else {
			return new Meteor.Error(404, 'Draft not found.');
		}



	},

	mockDraft: function () {
		
	},

	undo_pick: function() {
		var draft = Drafts.findOne();

		var pick_selector = {
			draft_id:draft._id,
			overall:draft.current_pick-1
		};

		var lastPick = Picks.findOne(pick_selector);

		Picks.update(pick_selector, {$unset: {player_id:''}});
		Players.update(lastPick.player_id, {$unset:{owner:''}});
		Drafts.update(draft._id, {$inc: {current_pick:-1}});
	},

	resetDraft: function(id) {
		var selector = id;
		Drafts.remove(selector);

		var pick_selector = {draft_id:id};
		Picks.remove(pick_selector);

		Players.update({}, {
			$unset: {
				owner:''
			}
		}, {multi:true});

	},

	resetDraftOrder: function() {
		Meteor.users.update({}, {
			$unset: {
				'profile.draft_slot':''
			}
		}, {multi:true})
	}
});

}