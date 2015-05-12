var ctrl = [
  '$scope',
  '$location',
  'Game',
  '$scope',
  'GamePlay',
  'Me',
  'Player',
  'Multiplayer',
  function ($scope, $location, Game, $scope, GamePlay, Me, Player, Multiplayer) {
    var vm = this.vm = this;

    var self = {};

    if( !Game.isGameCreated() ) {
      $location.path('/');
      return;
    }

    vm.goToMainMenu = function () {
      Game.destroyCurrentGame();
      $location.path('/');
      return;
    };

    Game.onPlayerLeft(function() {
      window.location.href = '/';
      //alert('Your friend has left! ' +
      //  'lease, and find another game'
      //);
      //$location.path('/');
    });

    var game = new GamePlay();

    var me, myPlayer, players = [];

    function getPlayerById(id) {
      var ret;
      _.each(players, function (player) {
        if( player.getId() == id ) {
          ret = player;
        }
      });
      if( typeof ret == 'object' ) {
        return ret;
      } else {
        console.error('Player getPlayerById with id ' + id + ' not found');
      }
    }

    game.onCreate(function () {
      //console.log(game.getGameInstance());
      //var meSprite = new Player( game.getGameInstance(), 100, 150);
      //new Player( game.getGameInstance(), 230, 540);
      me = new Me( {}, game, game.getGameInstance(), Multiplayer );
      //me.startBindings();
    });

    Multiplayer.onReceivedInfoAboutMe(function (data) {
      var myPlayer = new Player(game, game.getGameInstance(), data.cords.x, data.cords.y, me);
      console.log(data);
      myPlayer.setId(data.id);
      me.setSprite(myPlayer.sprite());
      players.push(myPlayer);
    });

    Multiplayer.receiveOpponent(function (data) {
      var Opponent = new Player(game, game.getGameInstance(), data.cords.x, data.cords.y);
      console.log(data);
      Opponent.setId(data.id);
      players.push(Opponent);
      me.startBindings();
    });

    Multiplayer.onMove(function (data) {
      console.log('receive on move');
      var player = getPlayerById(data.id);
      player.actions().move(data.direction);
    });

    Multiplayer.onUpdatePosition(function (data) {
      var player = getPlayerById(data.id);
      player.actions().setPosition(data.cords);
    });

    Multiplayer.onRotate(function (data) {
      var player = getPlayerById(data.id);
      player.actions().rotate(data.rotate);
    });

    Multiplayer.onUpdateRotate(function (data) {
      var player = getPlayerById(data.id);
      player.actions().setRotate(data.rotate);
    });

    Multiplayer.onShoot(function (data) {
      var player = getPlayerById(data.id);
      player.actions().shoot(data.data);
    });

    //Multiplayer.ping();

    $scope.$watch('$destroy', function () {
      console.log('destroy');
    });

  }
];

module.exports = ctrl;