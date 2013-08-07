Drafts = new Meteor.Collection('drafts');
Picks = new Meteor.Collection('picks');
DraftChatMessages = new Meteor.Collection('draftChatMessages');

// Draft Constants
var PICKS_PER_ROUND = 12,
	ROUNDS = 15;

/* 

Picks Data Model
round - int
index - overall selection
player - (probably an id?)
owner/user - id
draftId

*/
// Publish the draft model
/*if (Meteor.isServer) {
	Meteor.publish('picks', function(draftId) {

	});

	Meteor.publish('drafts', function() {

	});
} else if (Meteor.isClient) {
	draftHandle = Meteor.subscribe('drafts');
	pickHandle = Meteor.subscribe('picks');
}*/



/*

Draft Data Model
year
order - array of userIds
teams
leagueId
isTest

*/


/* DRAFT CONSTANTS */
if (Meteor.isServer) {

}

Meteor.methods({

	/*
		Params is an object with draft positions keyed on user id or username
	*/
	setDraftOrder: function(params) {


	},

	initializeDraft: function (isMock) {
		var new_draft = {};
		new_draft.year = new Date().getYear();

		// Grab the owner ids and shuffle them
		var shuffled_owners = _.shuffle(_.map(Meteor.users.find().fetch(), function(user) {
			return ((user && user.profile) ? user.profile.id : -1);
		}));
		new_draft.order = shuffled_owners;

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

		} else {
			return null;
		}
	},

	beginDraft: function(draft_id) {
		var draft = Drafts.findOne(draft_id);
		if (draft) {
			Draft.update(draft_id, {
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
			var current_pick = Picks.findOne({
				draft_id:draft_id,
				overall: draft.current_pick
			});

			if (current_pick) {
				
				if (this.userId == current_pick.owner) {
					var player = Players.findOne(player_id);

					if (player) {
						Picks.update({
							draft_id:draft_id,
							overall: draft.current_pick
						}, {
							$set: {
								player_id:player_id
							}
						});

						Drafts.update(draft_id, {
							$inc: {
								overall:1
							}
						})
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

	resetDraft: function(id) {
		
	}
})