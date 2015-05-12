var service = ['socketFactory', function (socketFactory) {

  var _this = this;

  _this.$socket = socketFactory();

  _this.$socket.connect();

  console.log(_this.$socket);

}];

module.exports = service;