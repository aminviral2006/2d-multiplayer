var service = ['Sockets', function (Sockets) {
  var _this = this;

  function bind(context, callback) {
    return function () {
      callback.apply(context, arguments);
    }
  }

  _this.$socket = Sockets.$socket;

  _this.createMeOnGameMap = function () {
    console.log('ask server create me');
    _this.$socket.emit('create-me')
  };
  _this.onReceivedInfoAboutMe = function (callback) {
    console.log('receive info about me');
    _this.$socket.on('receive-my-info', function (data) {
      callback.call(null, data);
    })
  };
  _this.receiveOpponent = function (callback) {
    _this.$socket.on('receive-opponent', bind(null, callback))
  };
  _this.move = function (direct) {
    _this.$socket.emit('move', {
      direction: direct
    })
  };
  _this.onMove = function (callback) {
    _this.$socket.on('move', bind(null, callback));
  };
  _this.updateRotate = function (data) {
    _this.$socket.emit('update-rotate', data);
  };
  _this.onUpdateRotate = function (callback) {
    _this.$socket.on('update-rotate', bind(null, callback));
  };
  _this.updatePosition = function (cords) {
    _this.$socket.emit('update-position', cords);
  };
  _this.onUpdatePosition = function (callback) {
    _this.$socket.on('update-position', bind(null, callback));
  };
  _this.rotate = function (rotate) {
    _this.$socket.emit('rotate', {
      rotate: rotate
    });
  };
  _this.shoot = function (data) {
    _this.$socket.emit('shoot', data);
  };
  _this.onShoot = function (callback) {
    _this.$socket.on('shoot', bind(null, callback));
  };
  _this.onRotate = function (callback) {
    _this.$socket.on('rotate', bind(null, callback));
  };

  var pings = 0;
  var iterations = 0;
  var ping = 0;


  _this.ping = function () {
    console.log('Ping-Pong start');
    setInterval(function () {
      _this.$socket.emit('ping', {
        date: new Date()
      });
    }, 1000);
    _this.$socket.on('pong', function (data) {
      var date = new Date().getTime();
      var date2 = new Date(data.date ).getTime();
      var dt = date - date2;
      pings += dt;
      iterations++;
      ping = Math.ceil(pings / iterations);
      console.log('Ping: ' + dt + ', Average: ' + ping);
    })
  };

}];

module.exports = service;