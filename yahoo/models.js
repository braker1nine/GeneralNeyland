Rosters = new Meteor.Collection('rosters')

/* 

Roster Model 
teamId
week


*/


Players = new Meteor.Collection('players')




/* ----------------- Fantasy Teams Collection ---------------- */
/* Team Model
{
	ownerUserId: int
	name: string
	teamKey:
	teamId: int
	logo: 
	faab balance: 
	roster: {
		seasonId: {
			week#
		}
	}
	season points?
}

*/
Teams = new Meteor.Collection('teams')