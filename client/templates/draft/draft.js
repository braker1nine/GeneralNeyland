Session.setDefault('position_filter', -1);
Session.setDefault('name_filter', '');
Session.setDefault('main_view', 'players');
Session.setDefault('selected_round', "1");
Session.setDefault('roster_user', null);
Session.setDefault('is_admin', false);
Drafts = new Meteor.Collection('drafts');
Picks = new Meteor.Collection('picks');

var PICKS_PER_ROUND = 12,
	ROUNDS = 14; /// Need to make sure this is right?

var players_handle;
Deps.autorun(function() {
	players_handle = Meteor.subscribe('players', Session.get('position_filter'), Session.get('name_filter'));	
});

Players = new Meteor.Collection('players');

var draft, isAdmin = false
Meteor.startup(function() {
	Deps.autorun(function() {
		drafted_players_handle = Meteor.subscribe('drafted_players');
	});

	Deps.autorun(function() {
		var user = Meteor.user();

		if (user && user.username == 'chrisbrakebill') {
			Session.set('is_admin', true);
		} else {
			Session.set('is_admin', false);
		}
	});

	Deps.autorun(function() {
		draftHandle = Meteor.subscribe('drafts');
	});

	
	Deps.autorun(function() {
		if (draftHandle.ready()) {
			draft = Drafts.findOne();
			Session.set('draft', draft);
			if (draft.complete == true && Session.equals('main_view', 'players')) {
				Session.set('main_view', 'results');
			}
		}
	});

	var picksHandle;
	Deps.autorun(function() {
		var draft = Session.get('draft');
		if (draftHandle.ready() && draft) {
			picksHandle = Meteor.subscribe('picks', draft._id);
		}
	});
});

Meteor.startup(function() {
	var picked_players_loaded = false;
	Players.find({owner:{$exists:true}}).observe({
		added:function(doc) {
			if (picked_players_loaded) {
				var owner = Meteor.users.findOne({'profile.id':doc.owner});
				if (owner) {
					var ownerStr = /*(doc.owner == Meteor.user().profile.id ? 'You' : */owner.profile.firstName + ' ' + owner.profile.lastName;

					Alert({text: ownerStr + ' selected ' + doc.firstName + ' ' + doc.lastName + '.'});
				}
			}
		}
	})
	picked_players_loaded = true;
});

Session.setDefault('admin_pick_mode', false);


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
		Meteor.call('beginDraft', Session.get('draft')._id, function(e, r) {
			console.log(arguments);
		})
	},
	'click button.admin_draft_toggle':function() {
		Session.set('admin_pick_mode', !Session.equals('admin_pick_mode', true));
	},
	'click button.reset_draft':function() {
		Meteor.call('resetDraft', Session.get('draft')._id, function(e,r) {
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
		Meteor.call('undo_pick', function(e,r) {
			console.log(arguments);
		});
	},
	'click button.complete_draft':function() {
		Meteor.update(Session.get('draft')._id, {$set: {
			complete:true
		}});
	},
	'click ul.draft_nav li':function(e) {
		Session.set('main_view', e.target.dataset.view);
	}
})

_.extend(Template.draft, {
	draft_begun: function() {
		var draft = Session.get('draft');
		return draft && draft.current_pick > 0;
	},
	draft_complete:function() {
		var draft = Session.get('draft');
		return draft && draft.complete == true;
	},
	draft_created: function() {
		return Drafts.find().count() > 0;
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
	players_view: function() {
		return Session.equals('main_view', 'players');
	},

	is_active_view: function(view_name) {
		return Session.equals('main_view', view_name);
	}
});

_.extend(Template.result_view, {
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

_.extend(Template.draft_sidebar, {
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



Template.pick.user = function() {
	var user = Meteor.users.findOne({'profile.id':this.owner});
	return user.profile.firstName + ' ' + user.profile.lastName
}

_.extend(Template.players, {
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

_.extend(Template.player_row, player_row_funcs);
_.extend(Template.no_draft_player_row, player_row_funcs);

Template.player_row.events({
	'click .draft_button.active':function(e) {
		Meteor.call('makePick', draft._id, this._id, function(err, res) {
			Session.set('admin_pick_mode', false);
		});
	}
});

_.extend(Template.owner_dropdown, {
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

_.extend(Template.rosters, {
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
});



