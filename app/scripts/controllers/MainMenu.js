var ctrl = ['$location', 'Game', function ($location, Game) {
  var vm = this.vm = this;
  var self = {};

  vm.createGame = function () {
    Game.onCreated(self.onGameCreated);
    Game.create();
  };

  vm.joinGame = function () {
    $location.path('/join');
  };

  self.onGameCreated = function () {
    $location.path('/wait');
  };

}];

module.exports = ctrl;