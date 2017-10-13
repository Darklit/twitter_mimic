const request = require("request");
const config = require("./config.js");
var qs = require("querystring"), oauth = {
  callback: "https://api.twitter.com",
  consumer_key: config.consumer_key,
  consumer_key_secret: config.consumer_key_secret
}, url = 'https://api.twitter.com/oauth/request_token';

function authorize(){
  request.post({
    url: url,
    oauth: oauth
  }, function(err,res,body){
    var req_data = qs.parse(body);
    var uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({
      oauth_token: req_data.oauth_token
    });
    var auth_data = qs.parse(body),
    oauth = {
      consumer_key: config.consumer_key,
      consumer_key_secret: config.consumer_key_secret,
      token: auth_data.oauth_token,
      token_secret: auth_data.oauth_token_secret,
      verifier: auth_data.oauth_verifier
    },
    url = 'https://api.twitter.com/oauth/access_token';
    request.post({
      url:url,
      oauth: oauth
    }, (r,b,bod) =>{
      console.log(b);
      var perm_data = qs.parse(bod),
      oauth = {
        consumer_key: config.consumer_key,
        consumer_key_secret: config.consumer_key_secret,
        token: perm_data.oauth_token,
        token_secret: perm_data.oauth_token
      },
      url = `https://api.twitter.com/1.1/users/search.json`,
      qs = {
        q: "test"
      };
      request.get({
        url:url,
        qs:qs,
        oauth: oauth,
        json: true
      },function(e,re,b2){
        if(e) throw e;
        console.log(b2);
      })
    })
  });
}

function getUsers(searchTerm){
  request.get({
    url: `https://api.twitter.com/1.1/users/search.json?q=${searchTerm}&page=1&count=3`,
    allowAllRedirects: true
  }, function(err,res,body){
    if (err) throw err;
    console.log("Res: " + res);
    console.log("Body: " + body);
  });
}

authorize();
