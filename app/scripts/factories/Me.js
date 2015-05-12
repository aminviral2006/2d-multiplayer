var factory = [function () {
  function Me ( sprite, Game, Phaser, Multiplayer ) {
    if( !Game || typeof Game !== 'object' ) {
      console.error('Me constructor second arg should be the Game instance');
    }
    this.Multiplayer = Multiplayer;
    this.Game = Game;
    this.Phaser = Phaser;
    this.askServerToCreateMeOnMap();
  }
  Me.prototype.askServerToCreateMeOnMap = function () {
    this.Multiplayer.createMeOnGameMap();
  };
  Me.prototype.receiveInfo = function () {

  };
  Me.prototype.setSprite = function (sprite) {
    this._sprite = sprite;
  };
  Me.prototype.sprite = function () {
    return this._sprite;
  };
  Me.prototype.startBindings = function () {
    var self = this;
    var lastMove = '';
    var lastRotate = '';
    var lastShoot = false;
    var shootTime = 500;

    var updateMyPosition = function () {
      self.Multiplayer.updatePosition( {
        x: self.sprite().body.position.x,
        y: self.sprite().body.position.y
      });
    };

    var updateMyRotation = function () {
      self.Multiplayer.updateRotate({
        angle: self.sprite().body.rotation
      })
    };

    this.Game.addToUpdatesStack(
      function () {
        var move = '';
        var rotate = '';

        if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
          rotate = 'LEFT';
        }else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
          rotate = 'RIGHT';
        }

        if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {
          move = 'WD';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A)) {
          move = 'WA';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S)) {
          move = 'AS';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {
          move = 'SD';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W)) {
          move = 'W';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A)) {
          move = 'A';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S)) {
          move = 'S';
        } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {
          move = 'D';
        }

        if( lastMove != move ) {
          updateMyPosition();
          self.Multiplayer.move(move);
          lastMove = move;
        }

        if( lastRotate != rotate ) {
          updateMyRotation();
          self.Multiplayer.rotate(rotate);
          lastRotate = rotate;
        }

        if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
          if( lastShoot <= new Date().getTime() - shootTime || lastShoot == false) {
            var x = self.sprite().body.position.x + 23.5;
            var y = self.sprite().body.position.y + 18.5;
            var angle = self.sprite().body.rotation;
            var velocity = 30;
            var velocity_X = velocity*Math.cos(angle.toRad());
            var velocity_Y = velocity*Math.sin(angle.toRad());

            self.Multiplayer.shoot({
              x: x + velocity_X,
              y: y + velocity_Y,
              angle: angle
            });
            lastShoot = new Date().getTime();
          }
        }
      }
    )
  };

  return Me;
}];

module.exports = factory;