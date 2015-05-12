var ctrl = [
  '$location',
  'Game',
  '$scope',
  function ($location, Game, $scope) {
    var vm = this.vm = this;

    var self = {};

    if( !Game.isGameCreated() ) {
      $location.path('/');
    }

    vm.goToMainMenu = function () {
      Game.destroyCurrentGame();
      $location.path('/');
    };

    self.onGuestJoined = function () {
      console.log('some one joined!');
      $location.path('/play');
    };

    Game.onGuestJoined(self.onGuestJoined);

  }
];

module.exports = ctrl;