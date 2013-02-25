if (Meteor.isClient) {
  Meteor.startup(function() {
    if (window.location.search != "") {
      var str = window.location.search.substr(1);
      var vals = deParam(str);
      console.log(vals);
      var requestTokenData = {
        oauth_callback_confirmed: localStorage.oauth_callback_confirmed,
        oauth_expires_in: localStorage.oauth_expires_in,
        oauth_token: localStorage.oauth_token,
        oauth_token_secret: localStorage.oauth_token_secret,
        xoauth_request_auth_url: localStorage.xoauth_request_auth_url
      }

      Meteor.call('getAccessToken', vals, requestTokenData, function(error, result){
        var vals = deParam(result);
        for (var key in vals) {
          localStorage[key] = vals[key];
        }

        Meteor.call('makeAPIRequest', 'league/', localStorage.oauth_token, localStorage.oauth_token_secret, function(error, response) {
          debugger;
        });
      });
    }
  });
};