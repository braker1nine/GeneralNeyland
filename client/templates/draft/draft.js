Session.setDefault('position_filter', -1);
Session.setDefault('name_filter', '');
Drafts = new Meteor.Collection('drafts');
Picks = new Meteor.Collection('picks');

var isAdmin = false;
Deps.autorun(function() {
	var user = Meteor.user();
	if (user && user.username == 'chrisbrakebill') {
		isAdmin = true;
	} else {
		isAdmin = false;
	}
});

Deps.autorun(function() {
	draftHandle = Meteor.subscribe('drafts');
});


var draft;
Deps.autorun(function() {
	if (draftHandle.ready()) {
		draft = Drafts.findOne();
	}
});

var picksHandle;
Deps.autorun(function() {
	if (draftHandle.ready()) {
		picksHandle = Meteor.subscribe('picks', draft._id);
	}
});

Session.setDefault('admin_pick_mode', false);

var players_handle;
Deps.autorun(function() {
	players_handle = Meteor.subscribe('players', Session.get('position_filter'), Session.get('name_filter'));	
});

Players = new Meteor.Collection('players');

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
			"tickerAbbrev": "fa",
			"universeId": 0
		},
		"1": {
			"abbrev": "Atl",
			"id": 1,
			"location": "Atlanta",
			"name": "Falcons",
			"tickerAbbrev": "atl",
			"universeId": 2
		},
		"2": {
			"abbrev": "Buf",
			"id": 2,
			"location": "Buffalo",
			"name": "Bills",
			"tickerAbbrev": "buf",
			"universeId": 1
		},
		"3": {
			"abbrev": "Chi",
			"id": 3,
			"location": "Chicago",
			"name": "Bears",
			"tickerAbbrev": "chi",
			"universeId": 2
		},
		"4": {
			"abbrev": "Cin",
			"id": 4,
			"location": "Cincinnati",
			"name": "Bengals",
			"tickerAbbrev": "cin",
			"universeId": 1
		},
		"5": {
			"abbrev": "Cle",
			"id": 5,
			"location": "Cleveland",
			"name": "Browns",
			"tickerAbbrev": "cle",
			"universeId": 1
		},
		"6": {
			"abbrev": "Dal",
			"id": 6,
			"location": "Dallas",
			"name": "Cowboys",
			"tickerAbbrev": "dal",
			"universeId": 2
		},
		"7": {
			"abbrev": "Den",
			"id": 7,
			"location": "Denver",
			"name": "Broncos",
			"tickerAbbrev": "den",
			"universeId": 1
		},
		"8": {
			"abbrev": "Det",
			"id": 8,
			"location": "Detroit",
			"name": "Lions",
			"tickerAbbrev": "det",
			"universeId": 2
		},
		"9": {
			"abbrev": "GB",
			"id": 9,
			"location": "Green Bay",
			"name": "Packers",
			"tickerAbbrev": "gnb",
			"universeId": 2
		},
		"10": {
			"abbrev": "Ten",
			"id": 10,
			"location": "Tennessee",
			"name": "Titans",
			"tickerAbbrev": "ten",
			"universeId": 1
		},
		"11": {
			"abbrev": "Ind",
			"id": 11,
			"location": "Indianapolis",
			"name": "Colts",
			"tickerAbbrev": "ind",
			"universeId": 1
		},
		"12": {
			"abbrev": "KC",
			"id": 12,
			"location": "Kansas City",
			"name": "Chiefs",
			"tickerAbbrev": "kan",
			"universeId": 1
		},
		"13": {
			"abbrev": "Oak",
			"id": 13,
			"location": "Oakland",
			"name": "Raiders",
			"tickerAbbrev": "oak",
			"universeId": 1
		},
		"14": {
			"abbrev": "StL",
			"id": 14,
			"location": "St. Louis",
			"name": "Rams",
			"tickerAbbrev": "stl",
			"universeId": 2
		},
		"15": {
			"abbrev": "Mia",
			"id": 15,
			"location": "Miami",
			"name": "Dolphins",
			"tickerAbbrev": "mia",
			"universeId": 1
		},
		"16": {
			"abbrev": "Min",
			"id": 16,
			"location": "Minnesota",
			"name": "Vikings",
			"tickerAbbrev": "min",
			"universeId": 2
		},
		"17": {
			"abbrev": "NE",
			"id": 17,
			"location": "New England",
			"name": "Patriots",
			"tickerAbbrev": "nwe",
			"universeId": 1
		},
		"18": {
			"abbrev": "NO",
			"id": 18,
			"location": "New Orleans",
			"name": "Saints",
			"tickerAbbrev": "nor",
			"universeId": 2
		},
		"19": {
			"abbrev": "NYG",
			"id": 19,
			"location": "New York",
			"name": "Giants",
			"tickerAbbrev": "nyg",
			"universeId": 2
		},
		"20": {
			"abbrev": "NYJ",
			"id": 20,
			"location": "New York",
			"name": "Jets",
			"tickerAbbrev": "nyj",
			"universeId": 1
		},
		"21": {
			"abbrev": "Phi",
			"id": 21,
			"location": "Philadelphia",
			"name": "Eagles",
			"tickerAbbrev": "phi",
			"universeId": 2
		},
		"22": {
			"abbrev": "Ari",
			"id": 22,
			"location": "Arizona",
			"name": "Cardinals",
			"tickerAbbrev": "ari",
			"universeId": 2
		},
		"23": {
			"abbrev": "Pit",
			"id": 23,
			"location": "Pittsburgh",
			"name": "Steelers",
			"tickerAbbrev": "pit",
			"universeId": 1
		},
		"24": {
			"abbrev": "SD",
			"id": 24,
			"location": "San Diego",
			"name": "Chargers",
			"tickerAbbrev": "sdg",
			"universeId": 1
		},
		"25": {
			"abbrev": "SF",
			"id": 25,
			"location": "San Francisco",
			"name": "49ers",
			"tickerAbbrev": "sfo",
			"universeId": 2
		},
		"26": {
			"abbrev": "Sea",
			"id": 26,
			"location": "Seattle",
			"name": "Seahawks",
			"tickerAbbrev": "sea",
			"universeId": 2
		},
		"27": {
			"abbrev": "TB",
			"id": 27,
			"location": "Tampa Bay",
			"name": "Buccaneers",
			"tickerAbbrev": "tam",
			"universeId": 2
		},
		"28": {
			"abbrev": "Wsh",
			"id": 28,
			"location": "Washington",
			"name": "Redskins",
			"tickerAbbrev": "was",
			"universeId": 2
		},
		"29": {
			"abbrev": "Car",
			"id": 29,
			"location": "Carolina",
			"name": "Panthers",
			"tickerAbbrev": "car",
			"universeId": 2
		},
		"30": {
			"abbrev": "Jac",
			"id": 30,
			"location": "Jacksonville",
			"name": "Jaguars",
			"tickerAbbrev": "jac",
			"universeId": 1
		},
		"33": {
			"abbrev": "Bal",
			"id": 33,
			"location": "Baltimore",
			"name": "Ravens",
			"tickerAbbrev": "bal",
			"universeId": 1
		},
		"34": {
			"abbrev": "Hou",
			"id": 34,
			"location": "Houston",
			"name": "Texans",
			"tickerAbbrev": "hou",
			"universeId": 1
		}
	}

Template.draft.preserve(['input.player_search']);

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
		Meteor.call('beginDraft', draft._id, function(e, r) {
			console.log(arguments);
		})
	},
	'click button.admin_draft_toggle':function() {
		Session.set('admin_pick_mode', !Session.equals('admin_pick_mode', true));
	},
	'click button.reset_draft':function() {
		Meteor.call('resetDraft', draft._id, function(e,r) {
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
	}
})

_.extend(Template.draft, {
	draft_begun: function() {
		var draft = Drafts.findOne();
		return draft && draft.current_pick > 0;
	},
	draft_created: function() {
		return Drafts.find().count() > 0;
	},
	searchValue: function() {
		return Session.get('name_filter');
	},
	admin: function() {
		return isAdmin;
	},
	order_set: function(){
		return Meteor.user() && Meteor.user().profile.draft_slot != null;
	},
	admin_draft:function() {
		return Session.equals('admin_pick_mode', true);
	}
})

Template.draft_order.user = function() {
	return Meteor.users.find({}, {sort: {'profile.draft_slot':1}});
}

_.extend(Template.position_filter, {
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
});

Template.position_filter.events({
	'click li':function(e, tmp) {
		Session.set('position_filter', e.target.dataset.type);
	}
});



_.extend(Template.players, {
	player: function() {
		return Players.find({}, {sort:{percentOwned:-1, lastName:1}});
	},

	no_players: function() {
		return Players.find({}).count() == 0;
	},
	draft_begun: function() {
		var draft = Drafts.findOne();
		return draft && draft.current_pick > 0;
	},
	players_ready: function() {
		return players_handle.ready();
	}
});

_.extend(Template.player_row, {
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
		var draft = Drafts.findOne();
		if (draft.current_pick) {
			var pick = Picks.findOne({draft_id:draft._id, overall:draft.current_pick});
			if (pick) {
				isUserPick = (pick.owner == Meteor.user().profile.id)
			}
		}

		return Session.equals('admin_pick_mode', true) || isUserPick;
	},

	draft_begun: function() {
		var draft = Drafts.findOne();
		return draft && draft.current_pick > 0;
	}
});

Template.player_row.events({
	'click .draft_button.active':function(e) {
		debugger;
		Meteor.call('makePick', draft._id, this._id, function(err, res) {
			Session.set('admin_pick_mode', false);
		});
	}
})