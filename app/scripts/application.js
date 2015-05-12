'use strict';

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
};

/* global angular */

require('angularjs');
require('angular-ui-router');
require('angular-socket-io');
window._ = require('underscore');

/* modules */

// main initialization

angular.module('Game', [
  // dependencies
  'ui.router',
  'btford.socket-io'
  // modules
])
  .config( require('./core.js') )

  .factory('Me',       require('./factories/Me.js'))
  .factory('Player',   require('./factories/Player.js'))
  .factory('GamePlay', require('./factories/GamePlay.js'))

  .service('Sockets',     require('./services/Sockets'))
  .service('Multiplayer', require('./services/Multiplayer'))
  .service('Game',        require('./services/Game'))

  .controller('IndexController',    require('./controllers/Index'))
  .controller('MainMenuController', require('./controllers/MainMenu'))
  .controller('GameWaitController', require('./controllers/GameWait'))
  .controller('GameJoinController', require('./controllers/GameJoin'))
  .controller('GamePlayController', require('./controllers/GamePlay'));
