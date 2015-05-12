
function Games () {
  this.games = [];
}

Games.prototype.game = function (id) {
  if(!id) {
    return false;
  }
  var game;
  for(var key in this.games) {
    game = this.games[key];
    if(game.getId() == id) {
      return game;
    }
  }
};

Games.prototype.destroyGame = function (id) {
  if(!id) {
    return false;
  }
  if(this.game(id)) {
    var game;
    for(var key in this.games) {
      game = this.games[key];
      if(game.getId() == id) {
        this.games.splice(key, key+1);
        return true;
      }
    }
  }
  return false;
};

Games.prototype.findNotFullGame = function () {
  var game;
  for(var key in this.games) {
    game = this.games[key];
    if( !game.isFull() ) {
      return game;
    }
  }
  return false;
};

Games.prototype.generateNotExistId = function () {
  var id, exist;

  exist = true;
  while(exist) {
    id = Math.random() * 4294967296;
    if(!this.game(id)) {
      exist = false;
    }
  }

  return id;
};

Games.prototype.add = function (game) {
  this.games.push(game);
};

module.exports = Games;