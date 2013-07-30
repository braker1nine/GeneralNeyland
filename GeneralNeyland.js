
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

  Template.body.pageIs = function(page) {
    return Session.equals("page", page);
  }

  Template.body.user = function() {
    return Meteor.users.findOne(Session.get('viewingUser'));
  }

  Template.nav.events({
    'click li.navItem a':function(e) {
      e.preventDefault();
      var url = $(e.target).attr('href');
      if (url != '#') {
        Router.navigate($(e.target).attr('href'), {trigger:true});
      }
    }
  })

  Template.teamsDropdown.owners = function() {
    return Meteor.users.find().fetch();
  }

  Template.loginForm.events({
    'click input[type="button"]':function(e) {
      Meteor.loginWithPassword($(e.target).siblings('input[type="email"]').val(), $(e.target).siblings('input[type="password"]').val(), function(err) {
        Router.navigate('/', {trigger:true});
        Session.set('page', 'home');
      });
    },
    'click #facebookButton':function(e){

    },

    'click #yahooButton':function(e){
      Meteor.call('getRequestToken', function(error, result){
        console.log(result);
        var requestTokenData = deParam(result.content);
        for (var key in requestTokenData) {
          localStorage[key] = requestTokenData[key];
        }
        window.location.href = decodeURIComponent(requestTokenData['xoauth_request_auth_url']);
      });
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
