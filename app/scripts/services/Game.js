var service = ['Sockets', function (Sockets) {
  var _this = this;

  _this.gameId = null;
  _this.$socket = Sockets.$socket;

  _this.create = function () {
    console.log('emit to create game');
    _this.$socket.emit('client:game:create');
  };

  _this.onCreated = function (callback, context) {
    console.log('bind game create');

    _this.$socket.on('client:game:created', function (response) {
      console.log('client:game:created fired');

      _this.gameId = response.game_id || false;
      callback.call(context || {}, response);
    });
  };

  _this.isGameCreated = function () {
    return _this.gameId ? true : false;
  };

  _this.onPlayerLeft = function (callback, context) {
    _this.$socket.on('game:player:left', function () {
      callback.call(context || {});
      _this.$socket.removeAllListeners('game:player:left');
    });
  };

  _this.destroyCurrentGame = function () {
    if(_this.isGameCreated()) {
      _this.gameId = null;
      _this.$socket.emit('client:game:destroy');
    }
  };

  _this.onGuestJoined = function (callback, context) {
    _this.$socket.on('guest:joined:game', function () {
      callback.call(context || {});
    })
  };

  _this.findNotFullGame = function (callback, context) {
    _this.$socket.emit('client:join:random');
    _this.$socket.on('client:joined:game', function (response) {
      _this.gameId = response.game_id;
      callback.call(context || {});
    });
  };

  _this.stopLookingForGame = function () {
    console.log('stop');
    _this.$socket.emit('client:joining:stop');
    _this.$socket.removeAllListeners('client:joined:game');
  };

}];

module.exports = service;