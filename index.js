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

var geneticTweets = [];

if(fs.existsSync('./tweets.json')){
  var temp = JSON.parse(fs.readFileSync('./tweets.json'));
  if(temp[0] != undefined) geneticTweets[0] = new GeneticTweet(temp[0]);
  else if(temp[1] != undefined) geneticTweets[1] = new GeneticTweet(temp[1]);
  else if(temp[2] != undefined) geneticTweets[2] = new GeneticTweet(temp[2]);
}else{
  fs.appendFileSync('./tweets.json','');
}

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
      tweetObjects[tweets[Object.keys(tweets)[i]].id] = new GeneticTweet(tempTweet.num1,tempTweet.num2,tempTweet.num3,tempTweet.id,tempTweet.user,tempTweet.text);
      tweetObjects[tweets[Object.keys(tweets)[i]].id].fitness = tempTweet.fitness;
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
/*
function setupClass(user){
  var getNums = function(name,index){
    directedUser({
      screen_name: name
    }).then(data => {
      getTweets({
        screen_name: name,
        include_rts: false
      }).then(dat => {
        var nums = words.generateNums(dat);
        geneticTweets[index] = new GeneticTweet(nums[0],nums[1],nums[2],words.evolvedScramble(dat,nums[0],nums[1],nums[2]));
      });
    });
  }
  if(geneticTweets[0] == undefined){
    getNums(user,0);
  }else if(geneticTweets[1] == undefined){
    getNums(user,1);
  }else if(geneticTweets[2] == undefined){
    getNums(user,2);
  }
}

setupClass('lmao_ian');
var checked = false;

var checkThis = function(){
  if(!checked){
    if(geneticTweets[2] != undefined){
      sendTweet({
        status: geneticTweets[1].text
      }).then(dat => {
        var savedObject = [];
        for(var i = 0; i < geneticTweets.length; i++){
          if(geneticTweets[i] != undefined){
            savedObject[i] = {
              num1: geneticTweets[i].num1,
              num2: geneticTweets[i].num2,
              num3: geneticTweets[i].num3,
              text: geneticTweets[i].text,
              user: geneticTweets[i].user,
              fitness: geneticTweets[i].fitness
            };
          }
        }
        fs.unlink('./tweets.json',(err) => {
          fs.writeFileSync('./tweets.json',JSON.stringify(savedObject));
        });
      }).catch(console.error);
      checked = true;
    }
  }
};


setInterval(checkThis,1000);

if(geneticTweets[0] != undefined){
  console.log(geneticTweets[0]);
}else{
  console.log('not yet made');
}
*/
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
      include_rts: false,
      count: 50
    }).then(dat => {
      var stuff = words.evolvedScramble(dat,tweetObj.num1,tweetObj.num2,tweetObj.num3);
      if(stuff.tweet != undefined){
        sendTweet({
          status: stuff.tweet
        }).then(da => {
          console.log(da.id);
          if(da.id != undefined) {
            var newTweetObj = new GeneticTweet(stuff.num1,stuff.num2,stuff.num3,Object.keys(tweets).length,stuff.from,stuff.tweet);
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
  for(var i = 0; i < Object.keys(tweets).length; i++){
    if(tweet.target_object.text == tweets[Object.keys(tweets)[i]].text){
      console.log(tweets[Object.keys(tweets)[i]]);
      if(tweet.source.screen_name.toLowerCase() != "lmao_ian") tweets[Object.keys(tweets[i])].fitness++;
      else tweets[Object.keys(tweets[i])].fitness+=5;
      saveTweets();
      break;
    }
  }
});

userStream.on('user_event',(obj) => {
  console.log('event');
  if(obj.event == 'favorite'){
    var tweet = obj;
    console.log('here');
    console.log(tweet.target_object.text);
    for(var i = 0; i < Object.keys(tweets).length; i++){
      if(tweet.target_object.text.trim() == tweets[Object.keys(tweets)[i]].text.trim()){
        console.log(tweets[Object.keys(tweets)[i]]);
        if(tweet.source.screen_name.toLowerCase() != "lmao_ian") tweets[Object.keys(tweets)[i]].fitness++;
        else tweets[Object.keys(tweets)[i]].fitness+=5;
        saveTweets();
        break;
      }
    }
  }

});

function askQuestion(question){
  rl.question(question,(ans)=>{
    if(ans.toLowerCase().includes('tweet')){
      directedScramble(config.users[Math.floor((Math.random()*config.users.length))]);
    }else if(ans === 'stop'){
      process.exit();
    }else if(ans.includes('genetic ')){
      var args = ans.split(" ")[1];
      var rTweets = [];
      var keys = Object.keys(tweets);
      for(var i = 0; i < Object.keys(tweets).length; i++){
        if(tweets[keys[i]].user == args && tweets[keys[i]].fitness > 0) rTweets.push(tweets[keys[i]]);
      }
      var lengthh = rTweets.length;
      var num1 = Math.floor(Math.random()*lengthh);
      var num2 = Math.floor(Math.random()*lengthh);
      var tries = 0;
      while(num1 == num2){
        console.log(rTweets.length);
        num1 = Math.floor(Math.random()*lengthh);
        tries++;
        if(tries >= 10000) break;
      }
      console.log(num1);
      console.log(num2);
      if(tweetObjects[rTweets[num1].id] !== undefined && tweetObjects[rTweets[num2].id] !== undefined){
        tweetObjects[rTweets[num1].id].breed(tweetObjects[rTweets[num2].id]);
      }else{
        var obj1 = rTweets[num1];
        var obj2 = rTweets[num2];
        console.log(obj1);
        console.log(obj2);
        tweetObjects[rTweets[num1].id] = new GeneticTweet(obj1.num1,obj1.num2,obj1.num3,obj1.id,obj1.user,obj1.text);
        tweetObjects[rTweets[num1].id].fitness = obj1.fitness;
        tweetObjects[rTweets[num2].id] = new GeneticTweet(obj2.num1,obj2.num2,obj2.num3,obj2.id,obj2.user,obj2.text);
        tweetObjects[rTweets[num2].id].fitness = obj2.fitness;
        tweetObjects[rTweets[num1].id].breed(tweetObjects[rTweets[num2]]);
      }
      geneticScramble(tweetObjects[rTweets[num1].id]);
    }else if(ans.includes('list ')){
      var args = ans.split(' ')[1];
      var rTweets = [];
      var keys = Object.keys(tweets);
      for(var i = 0; i < keys.length; i++){
        if(tweets[keys[i]].user == args) rTweets.push(tweets[keys[i]]);
      }
      console.log(rTweets);
    }else if(ans.includes('fit ')){
      var arg1 = ans.split(' ')[1];
      var arg2 = ans.split(' ')[2];
      var keys = Object.keys(tweets);
      for(var i = 0; i < keys.length; i++){
        if(tweets[keys[i]].id == arg1){
          tweets[keys[i]].fitness = +arg2;
          console.log(tweets[keys[i]]);
          saveTweets();
          break;
        }
      }
    }else if(ans.includes('from ')){
      var args = ans.split(' ')[1];
      directedScramble(args);
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
