var should = require('should');
var io = require('socket.io-client');

var socketURL = 'https://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var cfhPlayer1 = {'name':'Tom'};
var cfhPlayer2 = {'name':'Sally'};
var cfhPlayer3 = {'name':'Dana'};

describe("Game Server",function(){

  it('Should accept requests to joinGame', function(done) {
    var client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
      setTimeout(disconnect,200);
    });
  });

  it('Should send a game update upon receiving request to joinGame', function(done) {
    var client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
      client1.on('gameUpdate', function(data) {
        data.gameID.should.match(/\d+/);
      });
      setTimeout(disconnect,200);
    });
  });

  it('Should announce new user to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2;
    var disconnect = function() {
      client1.disconnect();
      client2.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data) {
        client2.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
        client1.on('notification', function(data) {
          data.notification.should.match(/ has joined the game\!/);
        });
      });
      setTimeout(disconnect,200);
    });
  });

  it('Should start game when startGame event is sent with 3 players', function(done){
    var client1, client2, client3;
    client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };
    var expectStartGame = function() {
      client1.emit('startGame');
      client1.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      client2.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      client3.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      setTimeout(disconnect,200);
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data) {
        client2.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
        client3 = io.connect(socketURL, options);
        client3.on('connect', function(data) {
          client3.emit('joinGame',{userID:'unauthenticated',room: '', createPrivate: false});
          setTimeout(expectStartGame,100);
        });
      });
    });
  })
});
