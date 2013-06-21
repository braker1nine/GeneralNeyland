(function yahooIIFE() {
if (Meteor.isServer) {
  var CONSUMER_SECRET = '1b53a8f3243dcb217450a39850ecd5c6559e6d35',
      CONSUMER_KEY = 'dj0yJmk9eFd3SEFwT00xMUdpJmQ9WVdrOWJVeGhha3MxTkhVbWNHbzlORGN5TURJME1qWXkmcz1jb25zdW1lcnNlY3JldCZ4PTgy',
      LEAGUE_ID = 232167,
      GAME_KEY = 273;


function buildTeamKey(teamId) {
  return GAME_KEY + '.l.' + LEAGUE_ID + '.t.' + teamId; 
}

function buildLeagueKey() {
  return GAME_KEY + '.l.' + LEAGUE_ID;
}

function makeAPIRequest(resource, oauth_token, oauth_token_secret) {
  var baseUrl = 'http://fantasysports.yahooapis.com/fantasy/v2/';

  var o = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_token: decodeURIComponent(oauth_token),
    oauth_version:'1.0',
    realm:'yahooapis.com',
    format:'json'
  };

  o.oauth_timestamp = ohauth.timestamp();
  o.oauth_nonce = ohauth.nonce();

  var requestUrl = baseUrl + resource;

  o.oauth_signature = ohauth.signature(CONSUMER_SECRET, oauth_token_secret, ohauth.baseString('GET', requestUrl, o));
  return ohauth.xhr('GET', requestUrl, o);
}

Meteor.methods({
  	makeAPIRequest: function(resource, oauth_token, oauth_token_secret) {

   		var baseUrl = 'http://fantasysports.yahooapis.com/fantasy/v2/';

      var o = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_token: decodeURIComponent(oauth_token),
        oauth_version:'1.0',
        realm:'yahooapis.com',
        format:'json'
      };

   		o.oauth_timestamp = ohauth.timestamp();
      o.oauth_nonce = ohauth.nonce();

      var requestUrl = baseUrl + 'team/' + buildTeamKey(1);

      o.oauth_signature = ohauth.signature(CONSUMER_SECRET, oauth_token_secret, ohauth.baseString('GET', requestUrl, o));
      return ohauth.xhr('GET', requestUrl, o);
    }, 

      getRequestToken: function() {
        // code to run on server at startup
       // Oauth initialization
       var host = 'https://api.login.yahoo.com/oauth/v2';

        var o = {
            oauth_consumer_key: CONSUMER_KEY,
            oauth_signature_method: 'HMAC-SHA1',
            realm:"yahooapis.com",
            oauth_version:'1.0',
            xoauth_lang_pref:'en-us',
            oauth_callback:'http://www.generalneylandscup.com'
        };

        o.oauth_timestamp = ohauth.timestamp();
        o.oauth_nonce = ohauth.nonce();

        var url = host + '/get_request_token';
        o.oauth_signature = ohauth.signature(CONSUMER_SECRET, '', ohauth.baseString('GET', url, o));

        return ohauth.xhr('GET', url, o);
      },

      getAccessToken: function(data, requestTokenData) {
        var host = 'https://api.login.yahoo.com/oauth/v2';

        var o = {
            oauth_consumer_key: CONSUMER_KEY,
            oauth_signature_method: 'HMAC-SHA1',
            realm:"yahooapis.com",
            oauth_verifier: data.oauth_verifier,
            oauth_token: data.oauth_token,
            oauth_version:'1.0'
        };

        o.oauth_timestamp = ohauth.timestamp();
        o.oauth_nonce = ohauth.nonce();

        var url = host + '/get_token';
        o.oauth_signature = ohauth.signature(CONSUMER_SECRET, requestTokenData.oauth_token_secret, ohauth.baseString('GET', url, o));
        
        var response = ohauth.xhr('GET', url, o);
        var json = deParam(response.content);
        if (this.userId) {
          console.log('Adding auth data to user...');
          json.date_obtained = Date.now();
          json.oauth_accessToken_expires = Date.now() + ((parseInt(json.oauth_expires_in)-60)*1000);
          json.oauth_auth_expires = Date.now() + ((parseInt(json.oauth_authorization_expires_in)-60)*1000);
          Meteor.users.update(this.userId, {$set: {'profile.yahooAuth':json}}, function(err){
            console.log(err);
          });
        }

        return json;
      },

      refreshAccessToken: function(data, requestTokenData) {
        var host = 'https://api.login.yahoo.com/oauth/v2',
          oauth_secret = '1b53a8f3243dcb217450a39850ecd5c6559e6d35';

        var o = {
            oauth_consumer_key: 'dj0yJmk9eFd3SEFwT00xMUdpJmQ9WVdrOWJVeGhha3MxTkhVbWNHbzlORGN5TURJME1qWXkmcz1jb25zdW1lcnNlY3JldCZ4PTgy',
            oauth_signature_method: 'HMAC-SHA1',
            realm:"yahooapis.com",
            oauth_verifier: data.oauth_verifier,
            oauth_token: data.oauth_token,
            oauth_version:'1.0'
        };

        o.oauth_timestamp = ohauth.timestamp();
        o.oauth_nonce = ohauth.nonce();

        var url = host + '/get_token';
        o.oauth_signature = ohauth.signature(oauth_secret, requestTokenData.oauth_token_secret, ohauth.baseString('GET', url, o));
        
        return ohauth.xhr('GET', url, o);
       
      },

      getPlayers: function(params) {
        if (!params.teamId) {
          Meteor.Error(1, 'No team id passed for roster');
          return null;
        }

        if (!this.userId) {
          console.log('No user');
          Meteor.Error(1, 'No user logged in for request');
          return null;
        }

        var user = Meteor.users.findOne(this.userId);
        if (!user.profile.yahooAuth) {
          console.log('User not authenticated with yahoo');
          Meteor.Error(1, 'User not authenticated with yahoo');
          return null;
        } else if (Date.now() > user.profile.yahooAuth.oauth_accessToken_expires) {
          Meteor.call('refreshAccessToken');
        }

        var resource = '/league/' + buildLeagueKey(params.teamId) + '/players';

        var data = makeAPIRequest(resource, user.profile.yahooAuth.oauth_token, user.profile.yahooAuth.oauth_token_secret);
        return data;
      },

      getLeague: function(params) {

        if (!this.userId) {
          console.log('No user');
          Meteor.Error(1, 'No user logged in for request');
          return null;
        }

        var user = Meteor.users.findOne(this.userId);
        if (!user.profile.yahooAuth) {
          console.log('User not authenticated with yahoo');
          Meteor.Error(1, 'User not authenticated with yahoo');
          return null;
        } else if (Date.now() > user.profile.yahooAuth.oauth_accessToken_expires) {
          Meteor.call('refreshAccessToken');
        }

        var resource = '/league/' + buildLeagueKey();

        var data = makeAPIRequest(resource, user.profile.yahooAuth.oauth_token, user.profile.yahooAuth.oauth_token_secret);
        return data;
      },

      getRoster: function(params) {
        if (!params.teamId) {
          Meteor.Error(1, 'No team id passed for roster');
          return null;
        }

        if (!this.userId) {
          console.log('No user');
          Meteor.Error(1, 'No user logged in for request');
          return null;
        }

        var user = Meteor.users.findOne(this.userId);
        if (!user.profile.yahooAuth) {
          console.log('User not authenticated with yahoo');
          Meteor.Error(1, 'User not authenticated with yahoo');
          return null;
        } else if (Date.now() > user.profile.yahooAuth.oauth_accessToken_expires) {
          Meteor.call('refreshAccessToken');
        }

        var resource = '/team/' + buildTeamKey(params.teamId) + '/roster';

        var data = makeAPIRequest(resource, user.profile.yahooAuth.oauth_token, user.profile.yahooAuth.oauth_token_secret);
        return data;


      }


   })
}

} ())