var side  = 0;
var jump  = 0;

var game = new Phaser.Game(256, 240, Phaser.CANVAS, 'xxx', {
    preload: preload,
    create: create,
    update: update
  }, false, false);
  
  function preload() {
    game.load.spritesheet('tiles', '/lib/assets/tiles_dctsfk.png', 16, 16);
    game.load.spritesheet('goomba', '/lib/assets/goomba_nmbtds.png', 16, 16);
    game.load.spritesheet('mario', '/lib/assets/mario_wjlfy5.png', 16, 16);
    game.load.spritesheet('coin', '/lib/assets/coin_iormvy.png', 16, 16);
  
    game.load.tilemap('level', '/lib/assets/3kk2g.json', null, Phaser.Tilemap.TILED_JSON); //https://api.myjson.com/bins/3kk2g
  }
  
  function create() {
        Phaser.Canvas.setImageRenderingCrisp(game.canvas)
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);
      
        game.stage.backgroundColor = '#5c94fc';
      
        map = game.add.tilemap('level');
        map.addTilesetImage('tiles', 'tiles');
        map.setCollisionBetween(3, 12, true, 'solid');
      
        map.createLayer('background');
      
        layer = map.createLayer('solid');
        layer.resizeWorld();
      
        coins = game.add.group();
        coins.enableBody = true;
        map.createFromTiles(2, null, 'coin', 'stuff', coins);
        coins.callAll('animations.add', 'animations', 'spin', [0, 0, 1, 2], 3, true);
        coins.callAll('animations.play', 'animations', 'spin');
      
        goombas = game.add.group();
        goombas.enableBody = true;
        map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
        goombas.callAll('animations.add', 'animations', 'walk', [0, 1], 2, true);
        goombas.callAll('animations.play', 'animations', 'walk');
        goombas.setAll('body.bounce.x', 1);
        goombas.setAll('body.velocity.x', -20);
        goombas.setAll('body.gravity.y', 500);
      
        player = game.add.sprite(16, game.world.height - 48, 'mario');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 370;
        player.body.collideWorldBounds = true;
        player.animations.add('walkRight', [1, 2, 3], 10, true);
        player.animations.add('walkLeft', [8, 9, 10], 10, true);
        player.goesRight = true;
      
        game.camera.follow(player);
      
        cursors = game.input.keyboard.createCursorKeys();
  }
  
  function update() {
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(goombas, layer);
        game.physics.arcade.overlap(player, goombas, goombaOverlap);
        game.physics.arcade.overlap(player, coins, coinOverlap);
      
        if (player.body.enable) {
           player.body.velocity.x = 0;
          if (cursors.left.isDown  || side == 1) {
              player.body.velocity.x = -90;
              player.animations.play('walkLeft');
              player.goesRight = false;
          } else if (cursors.right.isDown  || side == 2) {
              player.body.velocity.x = 90;
              player.animations.play('walkRight');
              player.goesRight = true;
          } else {
              player.animations.stop();
              if (player.goesRight) player.frame = 0;
              else{
                 player.frame = 7;                
              }   
          }
      
          if ((cursors.up.isDown && player.body.onFloor()) || (jump == 1 && player.body.onFloor())) {
              player.body.velocity.y = -190;
              player.animations.stop();
          }
      
          if (player.body.velocity.y != 0) {
              if (player.goesRight) player.frame = 5;
              else player.frame = 12;
          }
        }
  }
  
  function coinOverlap(player, coin) {
    coin.kill();
  }
  function restart(player) {
    player.frame = 7;
    player.body.enable = true;
    player.x = 20;
    player.y = 20;
    //player.animations.start();
    game.paused = false;
    game.state.start()
  }  
  function goombaOverlap(player, goomba) {
    if (player.body.touching.down) {
      goomba.animations.stop();
      goomba.frame = 2;
      goomba.body.enable = false;
      player.body.velocity.y = -80;
      game.time.events.add(Phaser.Timer.SECOND, function() {
        goomba.kill();
      });
    } else {
      /*
      player.frame = 6;
      player.body.enable = false;
      player.animations.stop();
      game.time.events.add(Phaser.Timer.SECOND * 3, function() {
        game.paused = true;
      });
      setTimeout(()=>{ restart(player) },10000)
      */
    }
  }