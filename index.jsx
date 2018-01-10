import React, { Component } from 'react';
import './style.css'; 

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
    };
    
    this.init = this.init.bind(this);
    this.draw = this.draw.bind(this);
  }
  
  componentDidMount() {   
    this.init();
  }
  
  onLeftKeyPress() {
    if (this.paddleX > 0) {
      this.paddleX -= 30;
    }
  }
  
  onRightKeyPress() {
    if (this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 30;
    } 
  }
  
  onEnterKeyPress() {
    // if (!this.gameStarted) {
    //   this.init();
    // }
    this.init();
  }
  
  init() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.setState({
      gameWon: false,
      gameOver: false,
    });
    
    this.gameEnded = false;
    this.width = 1000;
    this.height = 750;
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ballRadius = 10;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    this.rightPressed = false;
    this.leftPressed = false;
    this.brickRowCount = 5;
    this.brickColumnCount = 3;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.score = 0;
    this.lives = 3;
    
    // game screens
    this.gameWonScreen = document.getElementById('game-won-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.gameWonScreen.style = 'display:none';
    this.gameOverScreen.style = 'display:none';
    this.canvas.style = 'display:block;';
    
    this.bricks = [];
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r += 1) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    
    this.draw();
  }
  
  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      for (let r = 0; r < this.brickRowCount; r += 1) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
            this.dy = -this.dy;
            b.status = 0;
            this.score += 1;
            if (this.score === this.brickRowCount * this.brickColumnCount) {
              this.setState({
                gameWon: true,
                gameOver: false,
              });
            }
          }
        }
      }
    }
  }
  
  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }
  
  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawBricks() {
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      for (let r = 0; r < this.brickRowCount; r += 1) {
        if (this.bricks[c][r].status === 1) {
          const brickX = (r * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
          const brickY = (c * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = "#0095DD";
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }
  drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fillText("Score: " + this.score, 8, 20);
  }
  drawLives() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fillText("Lives: " + this.lives, this.canvas.width - 65, 20);
  }
  
  draw() {
    if (!this.state.gameOver && !this.state.gameWon) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBricks();
      this.drawBall();
      this.drawPaddle();
      this.drawScore();
      this.drawLives();
      this.collisionDetection();
      
      if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
      }
      if (this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
      } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
        if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
          this.dy = -this.dy;
        } else {
          this.lives -= 1;
          if (!this.lives) {
            this.setState({
              gameWon: false,
              gameOver: true,
            });
          } else {
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height - 30;
            this.dx = 3;
            this.dy = -3;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
          }
        }
      }
      
      this.x += this.dx;
      this.y += this.dy;
      this.animationFrame = requestAnimationFrame(this.draw);
    }
  }
  
  render() {
    return (
      <div id="game">
        <canvas id="myCanvas" width="480" height="320" style={{ display: this.state.gameOver || this.state.gameWon ? 'none' : 'block' }} ></canvas>
        <div id="game-over-screen" style={{ display: this.state.gameOver ? 'block' : 'none' }}>
          <p>Game over! Press 'Ok' to restart the game.</p>
        </div>
        <div id="game-won-screen" style={{ display: this.state.gameWon ? 'block' : 'none' }}>
          <p>Good job, you won! Press 'Ok' to restart the game.</p>
        </div>
      </div>
    );
  }
}

export default App;
