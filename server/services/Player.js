function Player(socket) {
  this._socket = socket;
  this._x = false;
  this._y = false;
}
Player.prototype.getSocket = function () {
  return this._socket;
};
Player.prototype.setX = function (x) {
  this._x = x;
};
Player.prototype.setY = function (y) {
  this._y = y;
};
Player.prototype.getCords = function () {
  return {
    x: this._x,
    y: this._y
  }
};
Player.prototype.getId = function () {
  return this.getSocket().id;
};

module.exports = Player;