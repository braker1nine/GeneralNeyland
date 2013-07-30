InvitedUsers = new Meteor.Collection('invitedUsers')

isDev = process.env.ROOT_URL == 'http://localhost:3000';

var ownerData = [
	{
		id:1,
		firstName:'Chris',
		lastName:'Brakebill',
		userName:'chrisbrakebill',
		email:'chris.brakebill@gmail.com',
	},
	{
		id:2,
		firstName: 'Danny',
		lastName:'Petersen',
		userName:'dannypetersen',
		email:'dpeters924@gmail.com',
	},
	{
		id:3,
		firstName: 'Dan',
		lastName:'Wells',
		userName:'danwells',
		email:'danthemanwells@gmail.com',
	},
	{
		id:4,
		firstName: 'Mike',
		lastName:'Gilmore',
		userName:'mikegilmore',
		email:'michael.t.gilmore@gmail.com',
	},
	{
		id:5,
		firstName: 'Bret',
		lastName:'Vukoder' ,
		userName:'bretvukoder',
		email:'bvukoder@gmail.com',
	},
	{
		id:6,
		firstName: 'Jay',
		lastName:'Slagle',
		userName:'jayslagle',
		email:'jayslagle@gmail.com',
	},
	{
		id:7,
		firstName: 'Henry',
		lastName:'Shiflett',
		userName:'henryshiflett',
		email:'henryshiflett@gmail.com',
	},
	{
		id:8,
		firstName: 'Jameson',
		lastName:'Bundy',
		userName:'jamesonbundy',
		email:'jameson.bundy@gmail.com',
	},
	{
		id:9,
		firstName: 'Stuart',
		lastName:'Deaderick',
		userName:'stuartdeaderick',
		email:'stuart.deaderick@gmail.com',
	},
	{
		id:10,
		firstName: 'Eric',
		lastName:'Sollenberger',
		userName:'ericsollenberger',
		email:'esollenb@gmail.com',
	},
	{
		id:11,
		firstName: 'Mark',
		lastName:'Hoffman',
		userName:'markhoffman',
		email:'bmarkhoffman86@gmail.com',
	},
	{
		id:12,
		firstName: 'Matt',
		lastName:'Davis',
		userName:'mattdavis',
		email:'mdavis865@gmail.com',
	}
];

Meteor.startup(function() {
	// Temporary solution for testing
	// Need to initialize the signupDataCollection
	for (var i = ownerData.length - 1; i >= 0; i--) {
		if (Meteor.users.find({profile:{id:ownerData[i].id}}).count() == 0){
			var owner = ownerData[i];
			if (InvitedUsers.find({id:ownerData[i].id}).count() == 0) {

				InvitedUsers.insert(ownerData[i]);
			}

			if (Meteor.users.find({username:ownerData[i].userName}).count() == 0) {
				var password = (isDev ? 'chris': (new Meteor.Collection.ObjectID())._str);
				var id = Accounts.createUser({
					email:ownerData[i].email,
					username: ownerData[i].userName,
					password: password,
					profile: {
						id: ownerData[i].id,
						firstName: ownerData[i].firstName,
						lastName: ownerData[i].lastName
					}
				});

				if (id && !isDev) {
					Email.send({
						from:'chris.brakebill@gmail.com',
						to:owner.email,
						subject:'Welcome to General Neyland\'s Cup',
						html: '<h1>An account has been created for you.</h1><br><b>Username:</b> ' + owner.email + '<br><b>Password:</b> ' + password + '<br>Login <a href="http://generalneylandscup.com">here.</a>'
					})
				}


			}
		}
	};
});