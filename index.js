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

var recentCmd;
var Twitter = new twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_key_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

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

var stream = Twitter.stream('user');

stream.on('direct_message',(dm) => {
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

stream.on('user_event',(stuff) => {
  if(stuff.event == 'favorite'){
    console.log('Favorite!!');
    console.log(Object.keys(stuff));
    console.log('\n\n' + stuff.source.screen_name);
    for(var i = 0; i < geneticTweets.length; i++){
      if(geneticTweets[i].text == stuff.target_object.text){
        if(stuff.source.screen_name == 'Lmao_Ian') geneticTweets[i].fitness+=3;
        else(geneticTweets[i].fitness+=1);
      }
    }
  } else console.log(stuff.event);
});
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
