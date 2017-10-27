const twit = require("twit");
const config = require("./config.js");
const words = require("./words.js");
const GeneticTweet = require('./genetic.js');
var recentTweet = {
  text: "nothing"
};
var sendTweets = [];
var theTweet;
var tweetMen = [];
const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var events = require('events');
var carderBot = new events.EventEmitter();

var Twitter = new twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_key_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

function getTweets(search){
  return new Promise((resolve,reject) => {
    Twitter.get('statuses/user_timeline',search,(err,data,body)=>{
      if(err) reject(Error(err));
      else resolve(data);
    });
  });
}

function getUser(search){
  return new Promise((resolve,reject) => {
    Twitter.get('users/search',search,(err,data,body)=>{
      if(err) reject(Error(err));
      else resolve(data);
    });
  });
}

function sendTweet(tweet){
  return new Promise((resolve,reject) => {
    Twitter.post('statuses/update',tweet,(err,data,body)=>{
      if(err) reject(Error(err));
      else resolve(data);
    });
  });
}

function directedUser(search){
  return new Promise((resolve,reject) => {
    Twitter.get('users/lookup',search,(err,data,body)=>{
      if(err) reject(Error(err));
      else resolve(data);
    });
  });
}

function automaticScramble(){
  getUser({
    q: letters[Math.floor(Math.random()*letters.length)],
    page: Math.floor(Math.random()*10)
  }).then(data => {
    getTweets({
      screen_name: data[Math.floor(Math.random()*data.length)].screen_name,
      include_rts: false
    }).then(dat => {
      sendTweet({
        status: words.scramble(dat).tweet
      }).then(da => {
        console.log(da[0]);
      })
      .catch(console.error);
    }).catch(console.error);
  }).catch(console.error);
}

function directedScramble(name){
  directedUser({
    screen_name: name
  }).then(data => {
    getTweets({
      screen_name: data[Math.floor(Math.random()*data.length)].screen_name,
      include_rts: false
    }).then(dat => {
      var stuff = words.scramble(dat);
      if(stuff.tweet != undefined){
        sendTweet({
          status: stuff.tweet
        }).then(da => {
          console.log(da.id);
          if(da.id != undefined) {
            sendTweet({
              status: `@carder_bot Tweets scrambled from ${stuff.from}`,
              in_reply_to_status_id: da.id_str,
            }).then(d => {
              console.log('finished');
            }).catch(console.error);
          }
        }).catch(console.error);
      }
    }).catch(console.error);
  }).catch(console.error);
}
directedScramble(config.users[Math.floor((Math.random()*config.users.length))]);
var automaticScramble = function(){
  getUser({
    q: letters[Math.floor(Math.random()*letters.length)],
    page: Math.floor(Math.random()*10)
  }).then(data => {
    getTweets({
      screen_name: data[Math.floor(Math.random()*data.length)].screen_name,
      include_rts: false
    }).then(dat => {
      var stuff = words.scramble(dat);
      if(stuff.tweet != undefined){
        sendTweet({
          status: stuff.tweet
        }).then(da => {
          console.log(da.id);
          if(da.id != undefined) {
            sendTweet({
              status: `@carder_bot Tweets scrambled from ${stuff.from}`,
              in_reply_to_status_id: da.id_str,
            }).then(d => {
              console.log('finished');
            }).catch(console.error);
          }
        }).catch(console.error);
      }
    }).catch(console.error);
  }).catch(console.error);
}
var user1;
var works = false;
/*directedUser({
  screen_name: config.users[0]
}).then(data => {
  getTweets({
    screen_name: data[0].screen_name,
    include_rts: false
  }).then(dat => {
    var randomNums = words.generateNums(dat);
    users1 = new GeneticTweet(randomNums[0],randomNums[1],randomNums[2]);
  }).catch(console.error);
}).catch(console.error);
*/
//setInterval(automaticScramble,1000*120);
