var ctrl = ['$location', 'Game', function ($location, Game) {
  var vm = this.vm = this;
  var self = {};

  console.log('hm...');

  Game.findNotFullGame(function () {
    $location.path('/play');
  });

  vm.goToMainMenu = function () {
    Game.stopLookingForGame();
    $location.path('/');
  };

}];

module.exports = ctrl;