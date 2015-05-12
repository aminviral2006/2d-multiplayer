global.__base = __dirname;

var Games = require('./server/services/Games');
var Game = require('./server/services/Game');
var Player = require('./server/services/Player');

var config  = require('./server/configs/config');
var logger  = require('./server/services/logger');
var express = require('express');
var app     = express();
var _       = require('underscore');

logger.info('Server starting...');

app.use('/js',    express.static(__dirname + "/dist/js"));
app.use('/css',   express.static(__dirname + "/dist/css"));
app.use('/views', express.static(__dirname + "/dist/views"));
app.use('/img', express.static(__dirname + "/dist/img"));

app.get('/api/games', function (req, res) {
  var ids = [];
  for(var key in games.games) {
    ids.push(games.games[key].getId());
  }
  res.send(JSON.stringify(ids));
});

app.get('*', function (req, res) {
  return res.sendfile(__dirname + "/dist/index.html");
});

var server = app.listen(config.port, '0.0.0.0', function () {
  logger.info('Server started');
});

logger.info('Start listening socket clients');

var io = require('socket.io' ).listen(server);

var games = new Games();

io.on('connection', function (socket) {

  var currentGame;
  var player;
  var opponent;
  var lookingForGame = false;

  player = new Player(socket);

  var u = function () {
    return socket.id;
  };

  var destroyGame = function () {
    if(currentGame) {
      logger.info(u() + ' destroy the game ' + currentGame.getId());
      currentGame.destroy();
      currentGame = false;
    }
  };

  socket.on('disconnect', function(){
    if(currentGame) {
      logger.info(u() + ' leave the game');
      currentGame.leave(player);
      _.each(currentGame.getPlayers(), function (player) {
        player.getSocket().emit('game:player:left');
        logger.info('send message to players about man left');
      });
    }
    destroyGame();
    logger.info('user #'+u()+' disconnected');
  });

  socket.on('client:game:create', function () {
    currentGame = new Game(games);
    currentGame.join(player);
    logger.info( u() + ' has created a game ' + currentGame.getId() );
    socket.emit('client:game:created', { game_id: currentGame.getId() });
  });

  socket.on('client:game:destroy', function () {
    destroyGame();
    lookingForGame = false;
    logger.info( u() + ' has destroyed a game');
  });

  socket.on('client:join:random', function () {
    logger.info('client ' + u() + ' request for a not full game');
    lookingForGame = true;
    var findGame = function () {
      if(!lookingForGame) {
        return;
      }
      var foundedGame = games.findNotFullGame();
      logger.info('client ' + u() + ' looking for a game..');
      if(foundedGame) {
        lookingForGame = false;
        currentGame = foundedGame;
        logger.info('client ' + u() + ' found a game ' + currentGame.getId());
        currentGame.join(player);
        socket.emit('client:joined:game', { game_id: currentGame.getId() });

        _.each(currentGame.getPlayers(), function (player) {
          player.getSocket().emit('guest:joined:game');
        });

      }else{
        logger.info('client ' + u() + ' cannot find a game ');
        if( lookingForGame ) {
          setTimeout(findGame, 1000)
        }
      }
    };

    findGame();
  });

  socket.on('client:joining:stop', function () {
    logger.info('client ' + u() + ' stop looking for the game');
    lookingForGame = false;
  });

  socket.on('move', function (data) {
    // data.x, data.y, direct
  });

  socket.on('create-me', function (data) {
    if( !currentGame ) {
      return;
    }
    logger.info( u() + " ask for create me " + currentGame.startCounter || 'not found');
    var x = Math.floor( Math.random() * (200 + 1) );
    var y = Math.floor( Math.random() * (200 + 1) );
    player.setX(x);
    player.setY(y);
    socket.emit('receive-my-info', {
      id: player.getId(),
      cords: player.getCords()
    });

    currentGame.startCounter++;

    if(currentGame.startCounter == 2) {
      logger.info('two users asked. receive start');
      _.each(currentGame.getPlayers(), function (player) {
        var enemy;
        _.each(currentGame.getPlayers(), function (enemies) {
          if(player.getSocket() != enemies.getSocket()) {
            enemy = opponent = enemies;
          }
        });
        if(typeof enemy == 'object') {
          player.getSocket().emit('receive-opponent', {
             id: enemy.getId(),
             cords: enemy.getCords()
          });
        }
      });
    }

  });

  socket.on('move', function (data) {
    logger.info('someone move');
    _.each(currentGame.getPlayers(), function (player) {
      player.getSocket().emit('move', {
        id: socket.id,
        direction: data.direction
      })
    });
  });

  socket.on('update-position', function (cords) {
    if(!currentGame) {
      return;
    }
    _.each(currentGame.getPlayers(), function (player) {
      if( player.getSocket() != socket ) {
        player.getSocket().emit('update-position', {
          id: socket.id,
          cords: cords
        })
      }
    });
  });

  socket.on('rotate', function (data) {
    if(!currentGame) {
      return;
    }
    logger.info('someone rotate');
    _.each(currentGame.getPlayers(), function (player) {
      logger.info('send rotate to ' + player.getSocket().id);
      player.getSocket().emit('rotate', {
        id: socket.id,
        rotate: data.rotate
      });
    });
  });

  socket.on('update-rotate', function (data) {
    if(!currentGame) {
      return;
    }
    logger.info('update rotate');
    _.each(currentGame.getPlayers(), function (player) {
      if( player.getSocket() != socket ) {
        logger.info('update position for someone');
        player.getSocket().emit('update-rotate', {
          id: socket.id,
          rotate: data.angle
        });
      }
    });
  });

  socket.on('ping', function (data) {
    logger.info('ping');
    socket.emit('pong', data);
  });

  socket.on('shoot', function (data) {
    _.each(currentGame.getPlayers(), function (player) {
      player.getSocket().emit('shoot', {
        id: socket.id,
        data: data
      })
    });
  });

  logger.info('user #'+u()+' connected!');
});
