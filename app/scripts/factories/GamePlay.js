var factory = [function () {

  var bind = function bind(context, func) {
    return function () {
      func.call(context, arguments);
    }
  };
  function GamePlay () {
    var self = this;
    this.canvas = {
      width: 770,
      height: 400,
      id: 'game-field'
    };
    this.phaser = new Phaser.Game(
      this.canvas.width,
      this.canvas.height,
      Phaser.CANVAS,
      this.canvas.id,
      {
        preload: bind(self, self.preload),
        create: bind(self, self.create),
        update: bind(self, self.update),
        render: bind(self, self.render)
      }
    );
    this.updatesStack = {};

  }

  GamePlay.prototype.getImagesToPreload = function () {
    return {
      'player': 'img/player.png',
      'bullet': 'img/bullet.png',
      'bg': 'img/bg.jpg'
    };
  };


  GamePlay.prototype.getGameInstance = function () {
    return this.phaser;
  };

  GamePlay.prototype.preload = function () {
    var self = this;
    _.each( self.getImagesToPreload() , function (val, key) {
      this.phaser.load.image(key, val);
    }, this);

  };

  GamePlay.prototype.startPhysics = function () {
    this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
  };

  GamePlay.prototype.onCreate = function (callback) {
    this.onCreateCallback = callback;
  };
  GamePlay.prototype.callOnCreateCallback = function () {
    this.onCreateCallback.call();
  };

  GamePlay.prototype.create = function () {

    this.callOnCreateCallback();

    this.startPhysics();
    // hardcode, remove then, add grass

    this.phaser.add.tileSprite(0, 0, 770, 400, 'bg');

    //this.phaser.stage.backgroundColor = '#0072bc';

    this.bullets = this.phaser.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

  };

  GamePlay.prototype.addToUpdatesStack = function () {
    var key, val;
    if( !arguments[0] && !arguments[1] ) {
      return;
    }
    if (arguments[0] && arguments[1]) {
      key = arguments[0];
      val = arguments[1];
      this.updatesStack[key] = val;
      return true;
    } else {
      val = arguments[0];
      key = Math.floor((Math.random() * 100000) + 1);
      this.updatesStack[key] = val;
      return key;
    }
  };
  GamePlay.prototype.removeFromUpdatesStack = function (key) {
    if(key && this.updatesStack[key]) {
      delete this.updatesStack[key];
    }
  };

  GamePlay.prototype.update = function () {
    _.each(this.updatesStack, function (item) {
      item.call(null);
    });
  };

  GamePlay.prototype.render = function () {
    this.phaser.time.advancedTiming = true;
    this.phaser.debug.text(this.phaser.time.fps || '--', 2, 14, "#00ff00");
  };

  return GamePlay;

}];

module.exports = factory;