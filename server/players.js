Players = new Meteor.Collection('players');

var slotCatMap = {
	0:[1],
	2:[2],
	3:[2,3],
	4:[3],
	5:[3,4],
	6:[4],
	16:[16],
	17:[5],
	23:[2,3,4]
}
Meteor.publish('players', function(slotCategoryId, name) {
	var selector = {};

	var options = {
		limit:100,
		sort: {
			percentOwned:-1,
			lastName:1
		}
	};

	if (slotCategoryId != -1) {
		selector.defaultPositionId =  {
			$in:slotCatMap[slotCategoryId]
		}
	}

	if (name && name != '') {
		selector['$or'] = [
			{firstName:{$regex : ".*"+name+".*", $options:'i'}},
			{lastName:{$regex : ".*"+name+".*", $options:'i'}}
		]
	}


	return Players.find(selector, options);
})

Meteor.startup(function(){
	Meteor.http.get('http://games.espn.go.com/ffl/api/v2/playerInit', {}, function(error, result) {
		if (error) {

		} else if (result && result.statusCode <= 302) {
			if (!result.data) result.data = JSON.parse(result.content);

			var player, playerMap;
			for (var i = 0; i < result.data.players.length; i++) {
				player = result.data.players[i];
				_.defaults(player, result.data.defaults.players);

				if ((player.dpi > 0 && player.dpi < 6 && !player.tp) || player.dpi == 16) {

					playerMap = {
						playerId:player.pi,
						lastName:player.ln,
						firstName:player.fn,
						percentOwned:player.po,
						defaultPositionId:player.dpi,
						proTeamId:player.pti,
						teamPlayer:player.tp
					}

					if (Players.find({playerId:player.pi}).count() > 0) {
						Players.update({playerId:player.pi}, playerMap);
					} else {
						Players.insert(playerMap);
					}
				}
			}
		}
	});
})