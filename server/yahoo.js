Meteor.methods({
  	makeAPIRequest: function(url, oauth_token, oauth_token_secret) {
          console.log('url: ', url)
          console.log('oauth_token: ', oauth_token);
          console.log('oauth_token_secret: ', oauth_token_secret);
   		var gameKey = 273,
   			leagueId = 232167,
   			consumer_secret = '1b53a8f3243dcb217450a39850ecd5c6559e6d35',
   			baseUrl = 'http://fantasysports.yahooapis.com/fantasy/v2/';

   		var o = {
   			oauth_consumer_key: 'dj0yJmk9eFd3SEFwT00xMUdpJmQ9WVdrOWJVeGhha3MxTkhVbWNHbzlORGN5TURJME1qWXkmcz1jb25zdW1lcnNlY3JldCZ4PTgy',
              oauth_signature_method: 'HMAC-SHA1',
              oauth_token: oauth_token,
              oauth_version:'1.0',
              format:"json"
   		};

   		o.oauth_timestamp = ohauth.timestamp();
          o.oauth_nonce = ohauth.nonce();

          var requestUrl = baseUrl + url + gameKey + '.l.' + leagueId;
          var baseString = ohauth.baseString('GET', requestUrl, o);
          console.log("base string = ", baseString);
          console.log('requestUrl = ', requestUrl);

      	o.oauth_signature = ohauth.signature(consumer_secret, oauth_token_secret, ohauth.baseString('GET', requestUrl, o));
          requestUrl += '?';
          var first = true;
          for (var key in o) {
              if (first) {
                  first = false;
              } else {
                  requestUrl += '&';
              }

              requestUrl += encodeURIComponent(key) + '=' + encodeURIComponent(o[key]);

          }
      	console.log(o);
      	return Meteor.http.get(requestUrl);
      },

      getRequestToken: function() {
        // code to run on server at startup
       // Oauth initialization
       var host = 'https://api.login.yahoo.com/oauth/v2',
          oauth_secret = '1b53a8f3243dcb217450a39850ecd5c6559e6d35';

        var o = {
            oauth_consumer_key: 'dj0yJmk9eFd3SEFwT00xMUdpJmQ9WVdrOWJVeGhha3MxTkhVbWNHbzlORGN5TURJME1qWXkmcz1jb25zdW1lcnNlY3JldCZ4PTgy',
            oauth_signature_method: 'PLAINTEXT'
        };

        o.oauth_timestamp = ohauth.timestamp();
        o.oauth_nonce = ohauth.nonce();

        var url = host + '/get_request_token?';
        o.oauth_signature = oauth_secret;
        

        var first = true;
        for (var key in o) {
          if (first) {
            first = false;
          } else {
            url += '&';
          }

          url += key + '=' + encodeURIComponent(o[key]);
          if (key == "oauth_signature") url += encodeURIComponent('&');
        }

        url += '&oauth_version='+encodeURIComponent('1.0');
        url += '&xoauth_lang_pref='+encodeURIComponent('en-us');
        url += '&oauth_callback='+encodeURIComponent('http://www.generalneylandscup.com');
        
        var data = Meteor.http.get(url, null);
        console.log(data);
        if (data.statusCode == 200) return data.content;
      },

      getAccessToken: function(data, requestTokenData) {
        var host = 'https://api.login.yahoo.com/oauth/v2',
          oauth_secret = '1b53a8f3243dcb217450a39850ecd5c6559e6d35';

        var o = {
            oauth_consumer_key: 'dj0yJmk9eFd3SEFwT00xMUdpJmQ9WVdrOWJVeGhha3MxTkhVbWNHbzlORGN5TURJME1qWXkmcz1jb25zdW1lcnNlY3JldCZ4PTgy',
            oauth_signature_method: 'PLAINTEXT',
            oauth_verifier: data.oauth_verifier,
            oauth_token: data.oauth_token
        };

        o.oauth_timestamp = ohauth.timestamp();
        o.oauth_nonce = ohauth.nonce();

        var url = host + '/get_token?';
        o.oauth_signature = oauth_secret + '&' + requestTokenData.oauth_token_secret;
        

        var first = true;
        for (var key in o) {
          if (first) {
            first = false;
          } else {
            url += '&';
          }

          url += key + '=' + encodeURIComponent(o[key]);
        }

        url += '&oauth_version='+encodeURIComponent('1.0');
        
        var data = Meteor.http.get(url, null);
        console.log(data);
        if (data.statusCode == 200) {
          return data.content;
        } else {
          return data;
        }
      }
   })