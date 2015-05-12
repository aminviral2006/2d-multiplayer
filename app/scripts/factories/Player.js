var factory = [function () {
  function Player (gameplay, phaser, x, y, me) {
    this.Phaser = phaser;
    this.me = me || false;
    this.GamePlay = gameplay;

    this.Phaser.stage.disableVisibilityChange = true;
    this._sprite = this.Phaser.add.sprite(x || 100, y || 100, 'player');
    this._sprite.anchor.setTo(0.5, 0.5);
    this.Phaser.physics.enable(this._sprite, Phaser.Physics.ARCADE);
    //sprite2.body.customSeparateX = true;
    //sprite2.body.customSeparateY = true;

    this._updatesUniqueKey = null;
    this.data = {
      // true if player shoot
      'shoot': false,
      'bulletDirect': {
        'fromX': null,
        'fromY': null,
        'angle': null
      },
      // Values: 'left' or 'right'
      'rotate': false,
      // direct 'A', 'W', 'D', 'S', 'SA', 'AW', 'WD', 'DS'
      'move': false,

      // position to sync player position between another clients
      'posX': false,
      'posY': false,
      'angle': false
    };

    var self = this;

    var moves = {
      'A':  180,
      'W':  270,
      'D':  0,
      'S':  90,
      'WA': 225,
      'WD': 315,
      'SD': 45,
      'AS': 135
    };

    var PLAYER_MOVE_SPEED = 150;

    var lastRotate = '';


    /*
    *
    * BULLETS
    *
    */


    var bullets = gameplay.bullets;

    function resetBullet (bullet) {

      bullet.kill();

    }
    var bulletTime = 0;
    var bullet;
    var self = this;

    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    };

    function fireBullet (x, y, angle, owner) {

      if (self.Phaser.time.now > bulletTime)
      {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
          bullet.reset(x, y);
          bullet.owner = owner;
          bullet.body.velocity.x = 300 * Math.cos(angle.toRad());
          bullet.body.velocity.y = 300 * Math.sin(angle.toRad());
          bulletTime = self.Phaser.time.now + 150;
        }
      }

    }

    for (var i = 0; i < 20; i++)
    {
      var b = bullets.create(0, 0, 'bullet');
      b.name = 'bullet' + i;
      b.exists = false;
      b.visible = false;
      b.checkWorldBounds = true;
      b.events.onOutOfBounds.add(resetBullet, this);
    }

    /*
    *
    *
    * BULLETS END
    *
    */

    this.GamePlay.addToUpdatesStack(function () {

      self.Phaser.physics.arcade.overlap(self.sprite(), bullets, function (player, bullet) {
        if(player != bullet.owner) {
          bullet.kill();
          console.log('someone dead!');
          if( self.me ) {
            alert('You have dead!');
          } else {
            alert('You have killed enemy!');
          }
        }
      });

      if(self.data.fire) {
        self.data.fire = false;
        var data = self.data.bulletDirect;
        fireBullet(data.fromX, data.fromY, data.angle, self.sprite());
      }

      if( self.data.posX !== false && self.data.posY !== false ) {
        self.sprite().body.position.setTo(self.data.posX, self.data.posY);
        self.data.posX = false;
        self.data.posY = false;
      }

      self.sprite().body.velocity.x = 0;
      self.sprite().body.velocity.y = 0;
      self.sprite().body.angularVelocity = 0;

      if( self.data.move !== false && self.data.move !== undefined ) {
        var angle = -1;
        if( moves[self.data.move] !== undefined ) {
          angle = moves[self.data.move];
        }
        if( angle !== -1 ) {
          self.sprite().game.physics.arcade.velocityFromAngle(angle, PLAYER_MOVE_SPEED, self.sprite().body.velocity);
        }
      }

      if( self.data.angle !== undefined && self.data.angle !== false ) {
        self.sprite().body.rotation = self.data.angle;
        self.data.angle = false;
      }

      if( self.data.rotate !== false && self.data.rotate !== undefined ) {
        if( self.data.rotate == 'LEFT' ) {
          self.sprite().body.angularVelocity = -200;
        } else if (self.data.rotate == 'RIGHT') {
          self.sprite().body.angularVelocity = 200;
        }
      }

    });

  }

  Player.prototype.actions = function () {
    var self = this;
    return {
      'move': function (direct) {
        self.data.move = direct;
      },
      'rotate': function (direct) {
        self.data.rotate = direct;
      },
      'shoot': function (data) {
        self.data.fire = true;
        self.data.bulletDirect = {
          fromX: data.x,
          fromY: data.y,
          angle: data.angle,
        };
        console.log('someone shoot');
      },
      setPosition: function (cords) {
        self.data.posX = cords.x;
        self.data.posY = cords.y;
      },
      setRotate: function (angle) {
        self.data.angle = angle;
      }
    }
  };



  Player.prototype.addToUpdates = function () {
    // draw player
  };

  Player.prototype.listenForServerUpdates = function () {
    // listen for any messages from server
  };
  Player.prototype.sprite = function () {
    return this._sprite;
  };
  Player.prototype.setId = function (id) {
    console.log('set id');
    this._id = id;
  };
  Player.prototype.getId = function () {
    return this._id;
  };

  return Player;
}];

module.exports = factory;