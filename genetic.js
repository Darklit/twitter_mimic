class GeneticTweet{
  constructor(num1,num2,num3,tweet){
    if(num2 == undefined){
      this.num1 = num1.num1;
      this.num2 = num1.num2;
      this.num3 = num1.num3;
      this.text = num1.text;
      this.user = num1.user;
      this.fitness = num1.fitness;
    }else{
      this.num1 = num1;
      this.num2 = num2;
      this.num3 = num3;
      this.text = tweet.tweet;
      this.user = tweet.from;
      this.fitness = 0;
    }
  }
  breed(parent,hey){
    var pool = [];
    var pool2 = [];
    var pool3 = [];
    var t = hey;
    for(var i = 0; i <= this.fitness; i++){
      //console.log("running " + i);
      pool[pool.length] = this.num1;
      pool2[pool2.length] = this.num2;
      pool3[pool3.length] = this.num3;
    }
    for(var i = 0; i <= parent.fitness; i++){
      //console.log("running " + i);
      pool[pool.length] = parent.num1;
      pool2[pool2.length] = parent.num2;
      pool3[pool3.length] = parent.num3;
    }
    if(t == 0){
      parent.breed(this,1);
    }
    var num1 = pool[Math.floor(Math.random()*pool.length-1)];
    var num2 = pool2[Math.floor(Math.random()*pool2.length-1)];
    var num3 = pool3[Math.floor(Math.random()*pool3.length-1)];
    this.num1 = num1;
    this.num2 = num2;
    this.num3 = num3;
    this.mutate();
  }
  mutate(){
    for(var i = 0; i < 3; i++){
      if(Math.random()<0.01){
        this.num1 = Math.floor(Math.random()*10);
      }
    }
    for(var i = 0; i < 3; i++){
      if(Math.random()<0.01){
        this.num2 = Math.floor(Math.random()*10);
      }
    }
    for(var i = 0; i < 3; i++){
      if(Math.random()<0.01){
        this.num3 = Math.floor(Math.random()*10);
      }
    }
  }
}

module.exports = GeneticTweet;
