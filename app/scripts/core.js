'use strict';

module.exports = [
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider) {

    var states;

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $urlRouterProvider.otherwise('/');

    states = {
      'main': {
        templateUrl: 'views/index.html'
      },
      'mainMenu': {
        templateUrl: 'views/main-menu-screen.html',
        controller: 'MainMenuController as mainMenu'
      },
      'gameWait': {
        templateUrl: 'views/game-wait-screen.html',
        controller: 'GameWaitController as wait'
      },
      'gameJoin': {
        templateUrl: 'views/game-join-screen.html',
        controller: 'GameJoinController as join'
      },
      'gamePlay': {
        templateUrl: 'views/game-play-screen.html',
        controller: 'GamePlayController'
      }
    };

    $stateProvider
      .state('index', {
        url: '/',
        views: {
          'main': states.main,
          'content@index': states.mainMenu
        }
      })
      .state('wait', {
        url: '/wait',
        views: {
          'main': states.main,
          'content@wait': states.gameWait
        }
      })
      .state('join', {
        url: '/join',
        views: {
          'main': states.main,
          'content@join': states.gameJoin
        }
      })
      .state('play', {
        url: '/play',
        views: {
          'main': states.main,
          'content@play': states.gamePlay
        }
      });
  }];