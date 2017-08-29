
var defaults = {
  playerOneX: 260,
  playerOneY: 770,
  playerTwoX: 260,
  playerTwoY: 10,
  stdPaddleWidth: 80,
  stdPaddleHeight: 15,
  playerSpeed: 10,
  startBallX: 300,
  startBallY: 400,
  ballRadius: 12,
  startBallSpeed: 10,
}

var playerOne;
var playerTwo;
var ball;

function writeNewGame(playerOnePoints = 0, playerTwoPoints = 0) {

  playerOne = new Player(defaults.playerOneX, defaults.playerOneY, defaults.stdPaddleWidth, defaults.stdPaddleHeight, defaults.playerSpeed, playerOnePoints);
  playerTwo = new Player(defaults.playerTwoX, defaults.playerTwoY, defaults.stdPaddleWidth, defaults.stdPaddleHeight, defaults.playerSpeed, playerTwoPoints);
  ball = new Ball(defaults.startBallX, defaults.startBallY, defaults.ballRadius, defaults.startBallSpeed);

  firebase.database().ref('games/' + 1).set({
    playerOne: playerOne,
    playerTwo: playerTwo,
    ball: ball
  });
}
