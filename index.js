const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var recentCmd;
var Twitter = new twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_key_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

var tweets = {};
var tweetObjects = [];

const fs = require('fs');

if(fs.existsSync('./recentCmd.txt')){
  recentCmd = fs.readFileSync('./recentCmd.txt');
}else{
  fs.appendFile('./recentCmd.txt','',(err) => {
    if (err) throw err;
    recentCmd = "";
  });
}

if(fs.existsSync('./tweets.json')){
  if(fs.readFileSync('./tweets.json') != ""){
    tweets = JSON.parse(fs.readFileSync('./tweets.json'));
    for(var i = 0; i < Object.keys(tweets).length; i++){
      var tempTweet = tweets[Object.keys(tweets)[i]];
      tweetObjects[tweets[Object.keys(tweets)[i]].id] = new GeneticTweet(tempTweet.num1,tempTweet.num2,tempTweet.num3,tempTweet.fitness,tempTweet.id,tempTweet.user,tempTweet.text);
    }
  }
}else{
  fs.appendFile('./tweets.json','',(err) => {
    if(err) throw err;
    tweets = {};
  });
}

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
            var newTweetObj = new GeneticTweet(stuff.num1,stuff.num2,stuff.num3,Object.keys(tweets).length,stuff.from,stuff.tweet);
            tweets[`${newTweetObj.id}`] = newTweetObj.toJSON();
            saveTweets();
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
function getDMs(){
  return new Promise((resolve,reject)=> {
    Twitter.get('direct_messages',{
      count: 1
    },(err,data,body) => {
    	if(err) reject(Error(err));
			else resolve(data);
    });
  });
}

var checkCommands = function(){
  getDMs().then(data => {

  }).catch(console.error);
}

carderBot.on('command',(cmd) => {
  if(cmd == 'sendTweet') directedScramble(config.users[Math.floor((Math.random()*config.users.length))]);
  else if(cmd == 'stop') process.exit();
});


var geneticScramble = function(tweetObj){
  directedUser({
    screen_name: tweetObj.user
  }).then(data => {
    getTweets({
      screen_name: data[Math.floor(Math.random()*data.length)].screen_name,
      include_rts: false
    }).then(dat => {
      var stuff = words.evolvedScramble(dat,tweetObj.num1,tweetObj.num2,tweetObj.num3);
      if(stuff.tweet != undefined){
        sendTweet({
          status: stuff.tweet
        }).then(da => {
          console.log(da.id);
          if(da.id != undefined) {
            var newTweetObj = new GeneticTweet(stuff.num1,stuff.num2,stuff.num3,tweetObj.id,stuff.from,stuff.tweet);
            tweets[`${newTweetObj.id}`] = newTweetObj.toJSON();
            tweetObjects[newTweetObj.id] = newTweetObj;
            saveTweets();
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
};

//directedScramble(config.users[Math.floor((Math.random()*config.users.length))]);
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

const userStream = Twitter.stream('user');
console.log(userStream !== undefined);

Twitter.stream('site').on('connected',(res) => {
  console.log("Connected!");
  console.log(Object.keys(res));
});

userStream.on('direct_message',(dm) => {
  console.log('dmed');
  var data = dm.direct_message;
  if(data.text == 'sendTweet' && data.id != recentCmd && recentCmd != undefined){
    recentCmd = data.id;
    fs.unlink('./recentCmd.txt',(err) => {
      if(err) throw err;
      fs.writeFileSync('./recentCmd.txt',data.id);
    });
     carderBot.emit('command','sendTweet');
   }else if(data.text == 'stop' && data.sender.screen_name == "Lmao_Ian" && data.id != recentCmd && recentCmd != undefined){
     console.log("here");
     recentCmd = data.id;
     fs.unlink('./recentCmd.txt',(err) => {
       if(err) throw err;
       fs.writeFile('./recentCmd.txt',data.id,(err) => {
         if (err) throw err;
         carderBot.emit('command','stop');
       })
     });
   }
});

userStream.on('favorite',(tweet) => {
  console.log("Favorited!");
  console.log(tweet.target_object.text);
  for(var i = 0; i < Object.keys(tweets).length; i++){
    console.log(tweets[Object.keys(tweets)[i]]);
    console.log("ouch");
    if(tweet.target_object.text == tweets[Object.keys(tweets)[i]].text){
      tweets[Object.keys(tweets[i])].fitness++;
      saveTweets();
      break;
    }
  }
});

userStream.on('user_event',(obj) => {
  console.log("Event!");
});

function askQuestion(question){
  rl.question(question,(ans)=>{
    if(ans.toLowerCase().includes('tweet')){
      directedScramble(config.users[Math.floor((Math.random()*config.users.length))]);
    }else if(ans === 'stop'){
      process.exit();
    }else if(ans === 'genetic'){

    }else{
      console.log("invalid command");
    }
    askQuestion(question);
  });
}

function patternBreed(user){
  for(var i = 0; i < Object.keys(tweets).length; i++){
    for(var g = 0; g < Object.keys(tweets).length; g++){
      if(tweets[Object.keys(tweets)[i]].user == tweets[Object.keys(tweets)[g]].user){
        tweets[Object.keys(tweets[i])].breed(tweets[Object.keys(tweets)[g]],0);
        break;
      }
    }
  }
  var stringTweets = JSON.stringify(tweets);
  fs.unlink('./tweets.json',(err)=>{
    if(err) throw err;
    fs.writeFile('./tweets.json',stringTweets,(err)=>{
      if(err) throw err;
    });
  });
}

var saveTweets = function(){
  var stringTweets = JSON.stringify(tweets);
  fs.unlink('./tweets.json',(err)=>{
    if(err) throw err;
    fs.writeFile('./tweets.json',stringTweets,(err)=>{
      if(err) throw err;
    });
  });
};

askQuestion('Enter a command... \n');
//automaticScramble();
//setInterval(checkCommands,1000);
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
//setInterval(automaticScramble,1000*5);
