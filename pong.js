var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 500;
    canvas.width = width;
    canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
    player.update();
    computer.update();
    ball.update(player.paddle, computer.paddle);
};

var render = function() {
  context.fillStyle = "purple";
  context.fillRect(0, 0, width, height);
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 5;
}

Paddle.prototype.render = function() {
  context.fillStyle = "yellow";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(775, 225, 10, 50);
}

function Computer() {
  this.paddle = new Paddle(15, 225, 10, 50);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 3;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "white";
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(400, 250);

var render = function() {
  context.fillStyle = "purple";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

//Adding movement to paddles
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
    var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if (diff < 0 && diff < -4) { //max speed up
        diff = -5;
    } else if (diff > 0 && diff > 4) { //max speed down
        diff =5;
    }
    this.paddle.move(diff, 0);
    if(this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > 500) {
        this.paddle.y = 500 - this.paddle.height;
    }
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) { // up arrow
      this.paddle.move(0, -4);
    } else if (value == 40) { // down arrow
      this.paddle.move(0, 4);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way to the top
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 500) { // all the way to the bottom
    this.y = 500 - this.height;
    this.y_speed = 0;
  }
}

//update ball
Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var left_x = this.x - 5;
  var left_y = this.y - 5;
  var right_x = this.x + 5;
  var right_y = this.y + 5;

  if(this.y - 5 < 0) { // hitting the top wall
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 500) { // hitting the bottom wall
    this.y = 495;
    this.y_speed = -this.y_speed;
  }

  if(this.x < 0 || this.x > 800) { // a point was scored
    this.x_speed = 3;
    this.y_speed = 0;
    this.x = 300;
    this.y = 200;
  }
// collision detection
  if(left_x > 200) {
    if(left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x && left_y < (paddle1.y + paddle1.height) && right_y > paddle1.y) {
      // hit the player's paddle
      this.x_speed = -3;
      this.y_speed += (paddle1.x_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x && left_y < (paddle2.y + paddle2.height) && right_y > paddle2.y) {
      // hit the computer's paddle
      this.x_speed = 3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};


