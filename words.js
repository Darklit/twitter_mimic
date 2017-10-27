module.exports = {
  scramble: function(data){
    console.log(data);
    if(data[0] == undefined){
      console.log("broke");
      return '';
    }else{
      var tweet1 = data[Math.floor(Math.random()*data.length)].text;
      var tweet2 = data[Math.floor(Math.random()*data.length)].text;
      var tweet3 = data[Math.floor(Math.random()*data.length)].text;
      var tries = 0;
      while(tweet1 == tweet2 || tweet1==tweet3 || tweet2 == tweet3){
        console.log("stuck");
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
        tries++;
        if(tries>10000){
          return '';
        }
      }
      while(tweet1.includes("RT")){
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet2.includes("RT")){
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet3.includes("RT")){
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
      }
      var tweet1Array = tweet1.split(" ");
      var tweet2Array = tweet2.split(" ");
      var tweet3Array = tweet3.split(" ");

      var random1 = Math.floor((Math.random()*tweet1Array.length/3));
      var random2 = (Math.floor((Math.random()*tweet2Array.length)))+random1;
      var random3 = (Math.floor((Math.random()*tweet3Array.length)))+random2;
      console.log("Taken from: " + data[0].user.screen_name);
      console.log('Random 1: ' + random1 + '\n');
      console.log('Random 2: ' + random2 + '\n');
      console.log('Random 3: ' + random3 + '\n');
      console.log('Tweet 1: '+tweet1 + '\n');
      console.log('Tweet 2: '+tweet2 + '\n');
      console.log('Tweet 3: '+tweet3 + '\n');
      var newTweet = "";
      for(var i = 0; i <= random1; i++){
      //  console.log("1+");
      //  console.log(i);
      if(tweet1Array[i] != undefined)  newTweet+=tweet1Array[i] + " ";
      }
      for(var i = random1; i <= random2; i++){
      //  console.log("2+");
      //console.log(i);
      if(tweet2Array[i] != undefined)  newTweet+=tweet2Array[i] + " ";
      }
      for(var i = random2; i <= random3; i++){
      //  console.log("3+");
    //    console.log(i);
      if(tweet3Array[i] != undefined)  newTweet+=tweet3Array[i] + " ";
      }
      while(newTweet.length>120){
        var expandString = newTweet.split(" ");
        newTweet = "";
        for(var i = 0; i < expandString.length-1; i++){
          newTweet+=expandString[i];
        }
      }
      while(newTweet.includes('@')){
        newTweet = newTweet.replace('@','');
      }
      console.log("New tweet: " + newTweet + '\n');
      return {
        tweet: newTweet.replace('@',''),
        from: data[0].user.screen_name
      };
    }
  },
  evolvedScramble: function(data,num1,num2,num3){
    console.log(data);
    if(data[0] == undefined){
      console.log("broke");
      return '';
    }else{
      var tweet1 = data[Math.floor(Math.random()*data.length)].text;
      var tweet2 = data[Math.floor(Math.random()*data.length)].text;
      var tweet3 = data[Math.floor(Math.random()*data.length)].text;
      var tries = 0;
      while(tweet1 == tweet2 || tweet1==tweet3 || tweet2 == tweet3){
        console.log("stuck");
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
        tries++;
        if(tries>10000){
          return '';
        }
      }
      while(tweet1.includes("RT")){
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet2.includes("RT")){
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet3.includes("RT")){
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
      }
      var tweet1Array = tweet1.split(" ");
      var tweet2Array = tweet2.split(" ");
      var tweet3Array = tweet3.split(" ");

      var random1 = num1;
      var random2 = num2;
      var random3 = num3;
      console.log("Taken from: " + data[0].user.screen_name);
      console.log('Random 1: ' + random1 + '\n');
      console.log('Random 2: ' + random2 + '\n');
      console.log('Random 3: ' + random3 + '\n');
      console.log('Tweet 1: '+tweet1 + '\n');
      console.log('Tweet 2: '+tweet2 + '\n');
      console.log('Tweet 3: '+tweet3 + '\n');
      var newTweet = "";
      for(var i = 0; i <= random1; i++){
      //  console.log("1+");
      //  console.log(i);
      if(tweet1Array[i] != undefined)  newTweet+=tweet1Array[i] + " ";
      }
      for(var i = random1; i <= random2; i++){
      //  console.log("2+");
      //console.log(i);
      if(tweet2Array[i] != undefined)  newTweet+=tweet2Array[i] + " ";
      }
      for(var i = random2; i <= random3; i++){
      //  console.log("3+");
    //    console.log(i);
      if(tweet3Array[i] != undefined)  newTweet+=tweet3Array[i] + " ";
      }
      while(newTweet.length>120){
        var expandString = newTweet.split(" ");
        newTweet = "";
        for(var i = 0; i < expandString.length-1; i++){
          newTweet+=expandString[i];
        }
      }
      while(newTweet.includes('@')){
        newTweet = newTweet.replace('@','');
      }
      console.log("New tweet: " + newTweet + '\n');
      return newTweet.replace('@','');
    }
  },
  generateNums: function(data){
    console.log(data);
    if(data[0] == undefined){
      console.log("broke");
      return '';
    }else{
      var tweet1 = data[Math.floor(Math.random()*data.length)].text;
      var tweet2 = data[Math.floor(Math.random()*data.length)].text;
      var tweet3 = data[Math.floor(Math.random()*data.length)].text;
      var tries = 0;
      while(tweet1 == tweet2 || tweet1==tweet3 || tweet2 == tweet3){
        console.log("stuck");
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
        tries++;
        if(tries>10000){
          return '';
        }
      }
      while(tweet1.includes("RT")){
        tweet1 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet2.includes("RT")){
        tweet2 = data[Math.floor(Math.random()*data.length)].text;
      }
      while(tweet3.includes("RT")){
        tweet3 = data[Math.floor(Math.random()*data.length)].text;
      }
      var tweet1Array = tweet1.split(" ");
      var tweet2Array = tweet2.split(" ");
      var tweet3Array = tweet3.split(" ");

      var random1 = Math.floor((Math.random()*tweet1Array.length/3));
      var random2 = (Math.floor((Math.random()*tweet2Array.length)))+random1;
      var random3 = (Math.floor((Math.random()*tweet3Array.length)))+random2;
      return [random1,random2,random3];
    }
  }
};
