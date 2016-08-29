Session.setDefault('position_filter', -1);
Session.setDefault('name_filter', '');
Session.setDefault('main_view', 'players');
Session.setDefault('selected_round', "1");
Session.setDefault('roster_user', null);
Session.setDefault('admin_pick_mode', false);
Drafts = new Meteor.Collection('drafts', {
	transform: function(doc) {
		return new Draft(doc);
	}
});
Picks = new Meteor.Collection('picks');

var PICKS_PER_ROUND = 12,
	ROUNDS = 14; /// Need to make sure this is right?

var players_handle;

Draft = function(draft) {
	_.extend(this, draft);
	return this;
}

Draft.prototype.hasBegun = function() {
	return this.current_pick > 0;
}

Draft.prototype.isComplete = function() {
	return this.complete == true;
}

Draft.prototype.getCurrentPick = function() {
	return Picks.findOne({draft_id:this._id, overall:draft.current_pick});
}

Draft.prototype.getNextPick = function() {
	return Picks.findOne({draft_id:this._id, overall:draft.current_pick+1});
}

Draft.prototype.isUserPick = function(user) {

}

Draft.prototype.select = function(player_id) {

}

Players = new Meteor.Collection('players');

var draft, isAdmin = false, current_draft, picksHandle;

/*Meteor.startup(function() {
	var picked_players_loaded = false;
	Players.find({owner:{$exists:true}}).observe({
		added:function(doc) {
			if (picked_players_loaded) {
				var owner = Meteor.users.findOne({'profile.id':doc.owner});
				if (owner) {
					var ownerStr = owner.profile.firstName + ' ' + owner.profile.lastName;

					Alert({text: ownerStr + ' selected ' + doc.firstName + ' ' + doc.lastName + '.'});
				}
			}
		}
	});

	// This is a hack, but I don't want to notify ON startup
	setTimeout(function() {
		picked_players_loaded = true;
	}, 2000);
});*/


var positionMap = {
		1:{
			"abbrev": "QB",
			"id": 1,
			"name": "Quarterback",
			"plural": "Quarterbacks",
			"statcategoryId": 0
		},
		2:{
			"abbrev": "RB",
			"id": 2,
			"name": "Running Back",
			"plural": "Running Backs",
			"statcategoryId": 0
		},
		3:{
			"abbrev": "WR",
			"id": 3,
			"name": "Wide Receiver",
			"plural": "Wide Receivers",
			"statcategoryId": 0
		},
		4:{
			"abbrev": "TE",
			"id": 4,
			"name": "Tight End",
			"plural": "Tight Ends",
			"statcategoryId": 0
		},
		5:{
			"abbrev": "K",
			"id": 5,
			"name": "Place Kicker",
			"plural": "Place Kickers",
			"statcategoryId": 3
		},
		16:{
			"abbrev": "D/ST",
			"id": 16,
			"name": "Team Defense/Special Teams",
			"plural": "Defensive/Special Teams",
			"statcategoryId": 5
		}
	};

var position_types = [
	{
		id:-1,
		name: 'All',
	},
	{
		id:0,
		name: 'QB',
	},
	{
		id:2,
		name: 'RB',
	},
	{
		id:3,
		name: 'RB/WR',
	},
	{
		id:5,
		name:'WR/TE'
	},
	{
		id:6,
		name: 'TE',
	},
	{
		id:16,
		name: 'D/ST',
	},
	{
		id:17,
		name: 'K',
	},

];

var proTeams = {
		"0": {
			"abbrev": "FA",
			"id": 0,
			"location": " ",
			"name": "FA",
		},
		"1": {
			"abbrev": "Atl",
			"id": 1,
			"location": "Atlanta",
			"name": "Falcons",
		},
		"2": {
			"abbrev": "Buf",
			"id": 2,
			"location": "Buffalo",
			"name": "Bills",
		},
		"3": {
			"abbrev": "Chi",
			"id": 3,
			"location": "Chicago",
			"name": "Bears",
		},
		"4": {
			"abbrev": "Cin",
			"id": 4,
			"location": "Cincinnati",
			"name": "Bengals",
		},
		"5": {
			"abbrev": "Cle",
			"id": 5,
			"location": "Cleveland",
			"name": "Browns",
		},
		"6": {
			"abbrev": "Dal",
			"id": 6,
			"location": "Dallas",
			"name": "Cowboys",
		},
		"7": {
			"abbrev": "Den",
			"id": 7,
			"location": "Denver",
			"name": "Broncos",
		},
		"8": {
			"abbrev": "Det",
			"id": 8,
			"location": "Detroit",
			"name": "Lions",
		},
		"9": {
			"abbrev": "GB",
			"id": 9,
			"location": "Green Bay",
			"name": "Packers",
		},
		"10": {
			"abbrev": "Ten",
			"id": 10,
			"location": "Tennessee",
			"name": "Titans",
		},
		"11": {
			"abbrev": "Ind",
			"id": 11,
			"location": "Indianapolis",
			"name": "Colts",
		},
		"12": {
			"abbrev": "KC",
			"id": 12,
			"location": "Kansas City",
			"name": "Chiefs",
		},
		"13": {
			"abbrev": "Oak",
			"id": 13,
			"location": "Oakland",
			"name": "Raiders",
		},
		"14": {
			"abbrev": "StL",
			"id": 14,
			"location": "St. Louis",
			"name": "Rams",
		},
		"15": {
			"abbrev": "Mia",
			"id": 15,
			"location": "Miami",
			"name": "Dolphins",
		},
		"16": {
			"abbrev": "Min",
			"id": 16,
			"location": "Minnesota",
			"name": "Vikings",
		},
		"17": {
			"abbrev": "NE",
			"id": 17,
			"location": "New England",
			"name": "Patriots",
		},
		"18": {
			"abbrev": "NO",
			"id": 18,
			"location": "New Orleans",
			"name": "Saints",
		},
		"19": {
			"abbrev": "NYG",
			"id": 19,
			"location": "New York",
			"name": "Giants",
		},
		"20": {
			"abbrev": "NYJ",
			"id": 20,
			"location": "New York",
			"name": "Jets",
		},
		"21": {
			"abbrev": "Phi",
			"id": 21,
			"location": "Philadelphia",
			"name": "Eagles",
		},
		"22": {
			"abbrev": "Ari",
			"id": 22,
			"location": "Arizona",
			"name": "Cardinals",
		},
		"23": {
			"abbrev": "Pit",
			"id": 23,
			"location": "Pittsburgh",
			"name": "Steelers",
		},
		"24": {
			"abbrev": "SD",
			"id": 24,
			"location": "San Diego",
			"name": "Chargers",
		},
		"25": {
			"abbrev": "SF",
			"id": 25,
			"location": "San Francisco",
			"name": "49ers",
		},
		"26": {
			"abbrev": "Sea",
			"id": 26,
			"location": "Seattle",
			"name": "Seahawks",
		},
		"27": {
			"abbrev": "TB",
			"id": 27,
			"location": "Tampa Bay",
			"name": "Buccaneers",
		},
		"28": {
			"abbrev": "Wsh",
			"id": 28,
			"location": "Washington",
			"name": "Redskins",
		},
		"29": {
			"abbrev": "Car",
			"id": 29,
			"location": "Carolina",
			"name": "Panthers",
		},
		"30": {
			"abbrev": "Jac",
			"id": 30,
			"location": "Jacksonville",
			"name": "Jaguars",
		},
		"33": {
			"abbrev": "Bal",
			"id": 33,
			"location": "Baltimore",
			"name": "Ravens",
		},
		"34": {
			"abbrev": "Hou",
			"id": 34,
			"location": "Houston",
			"name": "Texans",
		}
	}


var searchT;
Template.draft.events({
	'keyup input.player_search, blur input.player_search':function(e) {
		clearTimeout(searchT);
		searchT = setTimeout(function() {
			Session.set('name_filter', e.target.value);
			Deps.flush();
			if (e.type != 'blur') {
				e.target.focus();
			}
		}, 300);
	},

	'click button.set_order':function(e, tmpl) {
		Meteor.call('setDraftOrder', function(e, r) {
			console.log(arguments);
		})
	},
	'click button.initialize':function(e, tmpl) {
		Meteor.call('initializeDraft', function(e, r) {
			console.log(arguments);
		})
	},
	'click button.begin_draft':function(e, tmpl) {
		Meteor.call('beginDraft', current_draft._id, function(e, r) {
			console.log(arguments);
		})
	},
	'click button.admin_draft_toggle':function() {
		Session.set('admin_pick_mode', !Session.equals('admin_pick_mode', true));
	},
	'click button.reset_draft':function() {
		Meteor.call('resetDraft', current_draft._id, function(e,r) {
			Session.set('main_view', 'players');
			console.log(arguments);
		});
	},
	'click button.reset_draft_order':function() {
		Meteor.call('resetDraftOrder', function(e,r) {
			console.log(arguments);
		});
	},
	'click button.refresh_players':function() {
		Meteor.call('get_players', function(e,r) {
			console.log(arguments);
		});
	},
	'click button.undo_pick':function() {
		Meteor.call('undo_pick', current_draft._id,  function(e,r) {
			console.log(arguments);
		});
	},
	'click button.complete_draft':function() {
		Meteor.update(current_draft._id, {$set: {
			complete:true
		}});
	},
	'click button.reset_player_owners':function(e) {
		Meteor.call('resetPlayerOwners', function(e,r) {
			console.log(e,r);
		});
	},
	'click ul.draft_nav li':function(e) {
		Session.set('main_view', e.target.dataset.view);
	}
})

Template.draft.onCreated(() => {
	Deps.autorun(function() {
		players_handle = Meteor.subscribe('players', Session.get('position_filter'), Session.get('name_filter'));
		drafted_players_handle = Meteor.subscribe('drafted_players');
		draftHandle = Meteor.subscribe('drafts');

		if (draftHandle && draftHandle.ready()) {
			var year = new Date().getYear();
			draft = Drafts.findOne({year:year});
			var draftId = draft ? draft._id : undefined;
			Session.set('draft_id', draftId);
			Session.set('draft', draft);
			if (draft && draft.complete == true && Session.equals('main_view', 'players')) {
				Session.set('main_view', 'results');
			}
		}

		var draftId = Session.get('draft_id');
		if (draftId) {
			current_draft = Drafts.findOne(draftId);
		} else {
			current_draft = null;
		}

		if (draftHandle.ready() && current_draft) {
			picksHandle = Meteor.subscribe('picks', current_draft._id);
		}
	});

})

Template.draft.helpers({
	attributes:function(name) {
		var disabled = {disabled:'disabled'};
		var draft = Drafts.findOne(Session.get('draft_id'));
		switch(name) {
			case 'set_order':
				if (draft && draft.hasBegun()) {
					return disabled
				}
				break;
			case 'initialize':
				if (draft) {
					return disabled
				}
				break;
			case 'begin_draft':
				if (!draft || draft.hasBegun()) {
					return disabled
				}
				break;
			case 'reset_draft':
				if (!draft) {
					return disabled
				}
				break;
			case 'reset_draft_order':
				if (draft) {
					return disabled;
				}
				break;
			case 'undo_pick':
				if (!draft || !draft.hasBegun() || draft.current_pick < 0) {
					return disabled;
				}
				break;
			case 'complete_draft':
				if (!draft || !draft.hasBegun()) {
					return disabled;
				}
				break;
		}
	},

	draft_begun: function() {
		var draft = Session.get('draft');
		return draft && draft.current_pick > 0;
	},
	draft_complete:function() {
		var draft = Session.get('draft');
		return draft && draft.complete == true;
	},
	draft_created: function() {
		var draft = Session.get('draft');
		return draft != undefined;
	},
	searchValue: function() {
		return Session.get('name_filter');
	},
	order_set: function(){
		return Meteor.user() && Meteor.user().profile.draft_slot != null;
	},
	admin_draft:function() {
		return Session.equals('admin_pick_mode', true);
	},

	is_active_view: function(view_name) {
		return Session.equals('main_view', view_name);
	}
});

Template.result_view.helpers({
	round: function() {
		var rounds = [];
		for (var i = 1; i <= ROUNDS; i++) {
			rounds.push(i);
		};

		return rounds;
	},
	is_selected_round: function() {
		if (Session.equals('selected_round', this.toString())) {
			return 'active';
		} else {
			return '';
		}
	},
	num: function() {
		return this.toString();
	},

	pick:function() {
		return Picks.find({
			round:parseInt(Session.get('selected_round').toString())
		}, {
			sort: {
				overall:1,
			}
		});
	},
	pick_num: function() {
		var round_pick = this.overall - ((this.round - 1)*12);
		return round_pick + ' <span class="overall">(' + this.overall + ')</span>';
	},
	owner_name: function() {
		var owner = Meteor.users.findOne({'profile.id':this.owner});
		if (owner) {
			return owner.profile.firstName + ' ' + owner.profile.lastName;
		}
	},
	player_desc: function() {
		var player = Players.findOne(this.player_id);
		if (player) {
			return player.firstName + ' ' + player.lastName + ', <span class="position">' + positionMap[player.defaultPositionId].abbrev + '</span><span class="pro_team">'+proTeams[player.proTeamId].abbrev+'</span>';
		}
	}
});

Template.result_view.events({
	'click .round_nav li':function(e) {
		Session.set('selected_round', e.target.dataset.round);
	}
})

Template.draft_sidebar.helpers({
	previous_pick: function() {
		var draft = Session.get('draft');
		if (draft) {
			return Picks.findOne({overall:draft.current_pick-1});
		};
	},
	current_pick: function() {
		var draft = Session.get('draft');
		if (draft) {
			return Picks.findOne({overall:draft.current_pick});
		};
	},

	next_pick: function() {
		var draft = Session.get('draft');
		if (draft) {
			return Picks.findOne({overall:draft.current_pick+1});
		}
	},

	next_next_pick: function() {
		var draft = Session.get('draft');
		if (draft) {
			return Picks.findOne({overall:draft.current_pick+2});
		}
	}
})

Template.draft_order.helpers({
	user: function() {
		return Meteor.users.find({}, {sort: {'profile.draft_slot':1}});
	},
	draft_created: function() {
		var draft = Session.get('draft');
		return draft != undefined;
	}
})

Template.draft_order.events({
	'click .arrow.up':function(e) {
		var currentSpot = this.profile.draft_slot,
			toSpot = this.profile.draft_slot-1;

		if (toSpot < 1) {
			Alert({text:'Player is already in the top spot'})
		} else {
			var userInToSpot = Meteor.users.findOne({'profile.draft_slot':toSpot});
			Meteor.users.update(userInToSpot._id, {$inc: {'profile.draft_slot':1}})
			Meteor.users.update(this._id, {$inc: {'profile.draft_slot':-1}});
		}
	},
	'click .arrow.down': function(e) {
		var currentSpot = this.profile.draft_slot,
			toSpot = this.profile.draft_slot+1;

		if (toSpot > 12) {
			Alert({text:'Player is already in the last spot'})
		} else {
			var userInToSpot = Meteor.users.findOne({'profile.draft_slot':toSpot});
			Meteor.users.update(userInToSpot._id, {$inc: {'profile.draft_slot':-1}})
			Meteor.users.update(this._id, {$inc: {'profile.draft_slot':1}});
		}
	}
})

Template.position_filter.helpers({
	type: function() {
		return position_types;
	},
	isActive: function(id) {
		var filt = parseInt(Session.get('position_filter'));
		if (id == filt) {
			return 'active';
		} else {
			return '';
		}
	}
})

Template.position_filter.events({
	'click li':function(e, tmp) {
		Session.set('position_filter', e.target.dataset.type);
	}
});



Template.pick.user = function() {
	var user = Meteor.users.findOne({'profile.id':this.owner});
	return user.profile.firstName + ' ' + user.profile.lastName
}

Template.pick.playerName = function() {
	if (this.player_id) {
		var player = Players.findOne(this.player_id);
		return player.firstName + ' ' + player.lastName + ', '
			+positionMap[player.defaultPositionId].abbrev + ' '
			+proTeams[player.proTeamId].abbrev.toUpperCase();
	}

	return '';
}

Template.players.helpers({
	player: function() {
		return Players.find({owner:{$exists:false}}, {sort:{percentOwned:-1, lastName:1}});
	},

	no_players: function() {
		return Players.find({owner:{$exists:false}}).count() == 0;
	},
	draft_begun: function() {
		var draft = Session.get('draft');
		return draft && draft.current_pick > 0;
	},
	players_ready: function() {
		return players_handle.ready();
	}
});

var player_row_funcs = {
	position: function() {
		return positionMap[this.defaultPositionId].abbrev;
	},
	pro_team: function(){
		return proTeams[this.proTeamId].abbrev;
	},
	percent_owned: function() {
		return this.percentOwned.toFixed(1) + '%';
	},
	isUserPick: function() {
		var isUserPick = false;
		var draft = Session.get('draft');
		if (draft && draft.current_pick) {
			var pick = Picks.findOne({draft_id:draft._id, overall:draft.current_pick});
			if (pick) {
				isUserPick = (pick.owner == Meteor.user().profile.id)
			}
		}

		return Session.equals('admin_pick_mode', true) || isUserPick;
	},

	draft_begun: function() {
		var draft = Session.get('draft')
		return draft && draft.current_pick > 0;
	}
};

Template.player_row.helpers(player_row_funcs);
Template.no_draft_player_row.helpers(player_row_funcs);

Template.player_row.events({
	'click .draft_button.active':function(e) {
		Meteor.call('makePick', draft._id, this._id, function(err, res) {
			Session.set('admin_pick_mode', false);
		});
	}
});

Template.owner_dropdown.helpers({
	user: function() {
		return Meteor.users.find();
	},
	selected: function() {
		return Session.equals('roster_user', this.profile.id + '');
	}
});

Template.owner_dropdown.events({
	'change select': function(e) {
		Session.set('roster_user', e.target.value);
	}
})


Template.rosters.helpers({
	owner_name: function() {
		var selected = parseInt(Session.get('roster_user'));
		if (selected) {
			var user = Meteor.users.findOne({'profile.id':selected});
			if (user) {
				return user.profile.firstName + ' ' + user.profile.lastName;
			}
		} else {
			Session.set('roster_user', Meteor.user().profile.id);
		}
	},
	player:function() {
		return Players.find({owner:parseInt(Session.get('roster_user'))});
	}
})
