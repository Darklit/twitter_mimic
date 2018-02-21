const readline = require('readline');
const config = require('./config.js');
const GeneticTweet = require('./genetic.js');
const fs = require('fs');
const events = require('events');
const words = require('./words.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var files = false;

var bot = new events.EventEmitter();
fs.readFile('./tweets.json',(err, data) => {
  if(err) throw err;
  try {
    cleanData(JSON.parse(data));
  } catch (e) {
    console.log(e);
  } finally {
    console.log('finished');
  }
});

function cleanData(dataObj){
  var keys = Object.keys(dataObj);
  var newData = [];
  for(var i = 0; i < keys.length; i++){
    //console.log(dataObj[keys[i]]); console.log(dataObj[keys[i]][dataKeys[g]]);
    var dataKeys = Object.keys(dataObj[keys[i]]);
    var done = 0;
    for(var g = 0; g < dataKeys.length; g++){
      if(dataObj[keys[i]][dataKeys[g]] === undefined || dataObj[keys[i]][dataKeys[g]] === NaN) break;
      else done++;
    }
    if(done == dataKeys.length) newData[newData.length] = dataObj[keys[i]];
  }
  bot.emit('get',newData);
}

function askQuestion(data){
  rl.question('\nCommand\n',(ans) => {
    if(ans == 'add'){
      data[`${Object.keys(data).length}`] = {
        num1: 0,
        num2: 3,
        num3: 6,
        fitness: undefined,
        id: Object.keys(data).length,
        user: "Test user",
        text: 'y god'
      };
      cleanData(data);
    }else if(ans.includes('fit ')){
      var param1 = ans.split(' ')[1];
      var param2 = ans.split(' ')[2];
      var ids = Object.keys(data);
      for(var i = 0; i < ids.length; i++){
        if(ids[i] == param1){
          data[ids[i]].fitness = data[ids[i]].fitness + +param2;
          console.log(data[ids[i]]);
          break;
        }
      }
      cleanData(data);
    }else if(ans.includes('breed ')){
      var param1 = ans.split(' ')[1];
      var param2 = ans.split(' ')[2];
      var obj1 = {};
      var obj2 = {};
      var keys = Object.keys(data);
      for(var i = 0; i < keys.length; i++){
        if(keys[i] == param1) obj1 = data[keys[i]];
        else if(keys[i] == param2) obj2 = data[keys[i]];
      }
      if(obj1.fitness !== undefined && obj2.fitness !== undefined){
        var geneticTweet1 = new GeneticTweet(obj1.num1,obj1.num2,obj1.num3,obj1.id,obj1.user,obj1.text);
        var geneticTweet2 = new GeneticTweet(obj2.num1,obj2.num2,obj2.num3,obj2.id,obj2.user,obj2.text);
        var text = [];
        for(var i = 0; i < keys.length; i++){
          if(data[keys[i]].user == obj2.user){
            console.log(obj2.user);
            text.push({
              text: data[keys[i]].text,
              user: {
                screen_name: obj2.user
              }
            });
          }
        }
        geneticTweet1.fitness = obj1.fitness;
        geneticTweet2.fitness = obj2.fitness;
        console.log(geneticTweet2.toJSON());
        geneticTweet1.breed(geneticTweet2,0);
        console.log(geneticTweet2.toJSON());
        console.log(text);
      //console.log(words.evolvedScramble(text,geneticTweet2.num1,geneticTweet2.num2,geneticTweet2.num3));
      }
    }else{
      askQuestion(data);
    }
  })
}

bot.on('get',(data) => {
  files = true;
  console.log(files);
  console.log(data);
  askQuestion(data);
});
