function Player (phaser, x, y) {
  this.Phaser = phaser;

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
}

Player.prototype.actions = function () {
  return {
    'move': function (direct) {

    },
    'rotate': function (direct) {

    },
    'shoot': function () {

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