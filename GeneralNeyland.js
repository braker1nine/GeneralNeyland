
if (Meteor.isClient) {

  function deParam(string) {
    var obj = {};
    var entries = string.split('&');
    for (var i=0; i < entries.length; i++) {
      entries[i] = entries[i].split('=');
      obj[entries[i][0]] = entries[i][1];
    }

    return obj;
  };

  /*Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
        Meteor.call('getRequestToken', function(error, result){
          console.log(result);
          var requestTokenData = deParam(result);
          for (var key in requestTokenData) {
            localStorage[key] = requestTokenData[key];
          }
          window.location.href = decodeURIComponent(requestTokenData['xoauth_request_auth_url']);
        })
      }
  });*/

  Template.body.pageIs = function(page) {
    return Session.equals("page", page);
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

  Meteor.startup(function () {
    Backbone.history.start({pushState: true}); 
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
