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

function getUsers(searchTerm,fn,f1){
  var screen_name = '';
  Twitter.get('users/search',{
    q: searchTerm,
    page: Math.floor(Math.random()*10)
  }, (err,data,body) => {
    if(err) throw err;
    if(searchTerm == "lmao_ian"){
      screen_name = "Lmao_Ian";
    }else{
      screen_name = (data[Math.floor(Math.random()*data.length)].screen_name);
    }
    console.log('please');
    fn(screen_name,f1);
  });
}

function followUser(screenname){
  //console.log(screenname + " name");
  Twitter.post('friendships/create',{
    screen_name: screenname
  }, function(err,data,body){
    if(err) throw err;
    console.log(`Followed ${data.screen_name}`);
  });
}

function nothing(body){
  console.log(body);
}

function sendTweet(tweet){
  console.log("sending tweet...");
  Twitter.post('statuses/update',{
    status: tweet
  },(err,data,body) => {
    if(err) return;
    console.log(data.text);
    theTweet = data;
    carderBot.emit('randomTweet');
  });
}

function copyThis(){
  const users = [
    "lmao_ian",
    "Nebuchadneezar",
    "dril",
    "imkellam",
    "BradWray",
    "carder_bot",
    "PapaJohns"
  ];
  getUsers(users[Math.floor(Math.random()*users.length)],getTweet,setStuff);
  console.log("ran");
}


function setStuff(data){
  console.log("setStuff");
  for(var i = 0; i < 3; i++){
    if(tweetMen[i] == undefined){
      var nums = words.scramble(data);
      tweetMen[i] = new GeneticTweet(nums[0],nums[1],nums[2]);
    }
  }
  var tweetMan = tweetMen[Math.floor(Math.random()*tweetMen.length)];
  sendTweet(words.scrambleNew(data,tweetMan.num1,tweetMan.num2,tweetMan.num3));
}

function getTweet(screenname,fn){
  console.log("started");
  Twitter.get('statuses/user_timeline',{
    screen_name: screenname
  },(err,data,body) => {
    if(err) return;
    //console.log(data[0].text);
    if(screenname.toLowerCase() == 'lmao_ian'){
      //console.log('here');
      recentTweet = data[0];
      carderBot.emit('newTweet');
      //console.log(recentTweet);
      //console.log("here bitch");
      if(fn != null) fn(data);
    }else{
      //console.log(data[0]);
      if(fn != null) fn(data);
    }
  });
}

function getLikes(){
  Twitter.
}

function retweet(tweet){
  console.log('ehy');
  Twitter.post('statuses/retweet/:id',{
    id: tweet.id_str
  },(err,data,body) => {
    if(err) return;
    console.log("retweeted");
  });
}


//getUsers("lmao_ian",getTweet,null);

/*carderBot.on('newTweet',function(){
  retweet(recentTweet);
});
carderBot.on('randomTweet',function(){

});
setInterval(function(){
  copyThis();
},5000);
*/
/*
setInterval(function(){
  getTweet("lmao_ian",null);
},1000);

setInterval(function(){
  getUsers(letters[Math.floor(Math.random()*letters.length)],followUser,null);
},10000);
*/
