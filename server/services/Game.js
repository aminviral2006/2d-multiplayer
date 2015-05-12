var Games = require(__base + '/server/services/Games');

function Game(Games) {
  this._super = Games;
  this._super.add(this);
  this.startCounter = 0;

  this._id = this._super.generateNotExistId();
  this._players = [];
  this.maxPlayers = 2;
}

Game.prototype.destroy = function () {
  this._super.destroyGame(this.getId());
};

Game.prototype.getId = function () {
  return this._id;
};

Game.prototype.join = function (player) {
  this._players.push(player);
};

Game.prototype.leave = function (disconnectedPlayer) {
  var player;
  for(var key in this._players) {
    player = this._players[key];
    if( player == disconnectedPlayer) {
      this._players.splice(key, key+1);
      return true;
    }
  }
  return false;
};

Game.prototype.isFull = function () {
  return this._players.length == this.maxPlayers;
};

Game.prototype.getPlayers = function () {
  return this._players;
};


module.exports = Game;
