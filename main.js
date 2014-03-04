var WIDTH = 400;
var HEIGHT = 600;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game_div');

var main_state = {
    START_X : 100,
    START_Y : 245,
    GRAVITY : 1000,
    WALLS_EVERY : 1500,
    PIPE_VELOCITY: -200,
    JUMP_VELOCITY: -400,

    preload: function() {
      this.game.stage.backgroundColor = '#f16b6b'
      this.game.load.image('bird', 'assets/ram.png');
      this.game.load.image('pipe', 'assets/base_pipe.png');
      this.game.load.image('top_pipe', 'assets/top_pipe.png');
      this.game.load.image('bottom_pipe', 'assets/bottom_pipe.png');
    },

    create: function() { 
      this.score = 0;
      var style = { font: "30px Arial", fill: '#ffffff'};
      this.label_score = this.game.add.text(20,20,"0",style);

      this.bird = this.game.add.sprite(this.START_X,this.START_Y,'bird');
      this.bird.body.gravity.y = this.GRAVITY;
      var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(this.jump, this);
      game.input.onTap.add(this.jump, this);
      this.timer = this.game.time.events.loop(this.WALLS_EVERY, this.createPipeRow, this);


      this.pipes = this.game.add.group();
      this.top_pipes = this.game.add.group();
      this.bottom_pipes = this.game.add.group();
      this.pipes.createMultiple(20,'pipe');
      this.top_pipes.createMultiple(6, 'top_pipe');
      this.bottom_pipes.createMultiple(6, 'bottom_pipe');
      this.curr_pipes = [];
    },
    
    update: function() {
      if(this.bird.inWorld == false)
        this.restartGame();
     this.game.physics.overlap(this.bird, this.pipes, this.restartGame, null,this);
     this.game.physics.overlap(this.bird, this.top_pipes, this.restartGame,null,this);
     this.game.physics.overlap(this.bird, this.bottom_pipes, this.restartGame,null,this);
     var that = this;

     //Update the score
     this.curr_pipes.forEach(function(pipe){
      if(pipe.x < that.bird.x){
        that.score += 1;
        that.label_score.content = that.score;
      }
      that.curr_pipes.shift();
     });
    },

    jump: function(){
      this.bird.body.velocity.y = this.JUMP_VELOCITY;
    },

    /*render: function(){
      this.bottom_pipes.forEach(function(bp){
        game.debug.renderSpriteBounds(bp);
      });
    },*/
    restartGame: function(){
      this.game.state.start('main');
      this.game.time.events.remove(this.timer);  
    },

    createPipeRow: function(){
      var hole = Math.floor(Math.random()*6)+1;
      var pipe;
      
      for (var i=0; i<8; i++){
        if(i < hole-1 || i > hole+1){
          if(i == hole - 2){
            pipe = this.bottom_pipes.getFirstDead();
          }
          else if (i == hole + 2){
            pipe = this.top_pipes.getFirstDead();
          }
          else{
            pipe = this.pipes.getFirstDead();
          }
          pipe.reset(WIDTH,i*pipe.height);
          pipe.body.velocity.x = this.PIPE_VELOCITY;
          pipe.outOfBoundsKill = true;
        }
      }
      //use only one pipe of the row to check for score
      this.curr_pipes.push(pipe);
  }
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 
