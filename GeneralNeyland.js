
function checkAuthFunction(func, error) {
  return function() {
	if (checkAuth()) {
		func.apply(this, arguments);
	} else {
		error = error || 'You must be an admin to do that.';
		console.log(error)
	}
  }
}

function checkAuth() {
  if (GN.isAdmin()) {
	return true;
  } else {
	// Log or notify
	return false;
  }
}

// This is a General (haha, hilarious) controller for doing stuff...
GN = {
	isAdmin: function() {
		return Meteor.user() && Meteor.user().username == 'chrisbrakebill';
	},
	reset_dues: checkAuthFunction(function(callback) {
		Meteor.call('reset_dues', callback);
	})

}

UI.registerHelper('admin', function() {
	return GN.isAdmin();
});



function deParam(string) {
	var obj = {};
	var entries = string.split('&');
	for (var i=0; i < entries.length; i++) {
	  entries[i] = entries[i].split('=');
	  obj[entries[i][0]] = entries[i][1];
	}

	return obj;
  };

if (Meteor.isClient) {

  Meteor.subscribe('users');

  Template.layout.helpers({
    pageIs: function(page) {
      return Session.equals("page", page);
    },
    user: function() {
      return Meteor.users.findOne(Session.get('viewingUser'));
    }
  })

  Template.nav.helpers({
  	pageIs: function(page) {
  	  return Session.equals("page", page);
  	}
  });
  Template.nav.events({
	'click li.navItem a':function(e) {
	  e.preventDefault();
	  var url = $(e.target).attr('href');
	  if (url != '#') {
  		FlowRouter.go($(e.target).attr('href'));
	  }
	}
  })

  Template.teamsDropdown.helpers({
    owners: function() {
    	return Meteor.users.find().fetch();
    }
  })

  Template.login.events({
    'click input[type="button"]':function(e) {
      Meteor.loginWithPassword($(e.target).siblings('input[type="email"]').val(), $(e.target).siblings('input[type="password"]').val(), function(err) {
        console.log(err);
      });
    },
  })
}
