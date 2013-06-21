Drafts = new Meteor.Collection('drafts');
Picks = new Meteor.Collection('picks');
DraftChatMessages = new Meteor.Collection('draftChatMessages');

/* 

Picks Data Model
round - int
index - overall selection
player - (probably an id?)
owner/user - id
draftId?

*/



/*

Draft Data Model
year
order - array of
teams
leagueId

*/


/* DRAFT CONSTANTS */
if (Meteor.isServer) {

	var PICKS_PER_ROUND = 12,
		ROUNDS = 15;

}

Meteor.methods({

	/*
		Params is an object with draft positions keyed on user id or username
	*/
	setDraftOrder: function(params) {


	},

	initializeDraft: function () {

	},

	resetDraft: function() {

	}
})