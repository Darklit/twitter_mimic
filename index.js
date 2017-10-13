const twit = require("twit");
const config = require("./config.js");
var recentTweet = {
  text: "nothing"
};

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
    if(err) return;
    screen_name = (data[Math.floor(Math.random()*data.length)].screen_name);
    fn(screen_name,f1);
  });
}

function followUser(screenname){
  //console.log(screenname + " name");
  Twitter.post('friendships/create',{
    screen_name: screenname
  }, function(err,data,body){
    if(err) return;
    console.log(`Followed ${data.screen_name}`);
  });
}

function nothing(body){
  console.log(body);
}

function getTweet(screenname,fn){
  Twitter.get('statuses/user_timeline',{
    screen_name: screenname
  },(err,data,body) => {
    //console.log(data[0].text);
    if(screenname.toLowerCase() == 'lmao_ian'){
      if(recentTweet.text != data[0].text){
        //console.log('here');
        recentTweet = data[0];
        carderBot.emit('newTweet');
        //console.log(recentTweet);
      }
    }else{
      fn(data);
    }
  });
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

carderBot.on('newTweet',function(){
  retweet(recentTweet);
});
setInterval(function(){
  getTweet("lmao_ian",null);
},1000);

setInterval(function(){
  getUsers(letters[Math.floor(Math.random()*letters.length)],followUser,null);
},10000);
