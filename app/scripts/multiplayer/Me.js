function Me ( sprite, Game, Phaser ) {
  if( !Game || typeof Game !== 'object' ) {
    console.error('Me constructor second arg should be the Game instance');
  }
  this.Game = Game;
  this.Phaser = Phaser;
}
Me.prototype.startBindings = function () {
  var self = this;
  this.Game.addToUpdatesStack(
    function () {
      if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

      }else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){

      }

      if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S) && self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.W)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.A)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.S)) {

      } else if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.D)) {

      }
      if (self.Phaser.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {

      }
    }
  )
};