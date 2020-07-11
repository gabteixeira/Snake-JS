// Global Variables - Keys
var rightPressed;
var leftPressed;
var upPressed;
var downPressed;
var pausePressed;
var click;

const SPEED  = 5;
const ZERO = 0;


// Default values
function setKeys(){
    rightPressed = false;
    leftPressed = false;
    upPressed =  false ;
    downPressed = false;
    pausePressed = false;
    click = false;
}
function reset(){
    click = true;
}

function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
            leftPressed = false;
            upPressed = false;
            downPressed = false;
            pausePressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
            rightPressed = false;
            upPressed = false;
            downPressed = false;
            pausePressed = false;
        }
        else if(e.key == "Up" || e.key == "ArrowUp"){
            upPressed = true;
            rightPressed = false;
            leftPressed = false;
            downPressed = false;
            pausePressed = false;
        }
        else if(e.key == "Down" || e.key == "ArrowDown"){
            downPressed = true;
            upPressed = false;
            leftPressed = false;
            rightPressed = false;
            pausePressed = false;
        }
        else if(e.key == " "){
            pausePressed = !pausePressed;
        }
    }



class Hamburguer{
    constructor(width,height){
        
        this.hamburguer = new Image();
        this.hamburguer.src = './assets/hamburguer.png';

        this.width = 32;
        this.height = 40;

        this.canvas_h = height;
        this.canvas_w = width;

        // Random Position
        this.newPosition();
    }
    get hamburguerPosition(){
        return [this.x,this.y];
    }
    get getHeight(){
        return this.height;
    }
    get getWidth(){
        return this.width;
    }
    drawHamburguer(ctx){
        ctx.drawImage(this.hamburguer,this.x,this.y);
    }
    newPosition(){
        this.x = Math.floor(Math.random() * (this.canvas_w-3))+3;
        this.y = Math.floor(Math.random() * (this.canvas_h-3))+3;
    } 
}

class Snake{
    constructor(width,height){
        this.height = 10;
        this.width = 10;

        this.canvas_h = height;
        this.canvas_w = width;

        // starts in a random position
        this.x = Math.floor(Math.random() * (this.canvas_w-3))-3;
        this.y = Math.floor(Math.random() * (this.canvas_h-3))-3;

        this.dx = 0;
        this.dy = 0;

        this.weight = 1;
        this.body = [{x:this.x,y:this.y, color:"green"}];
    }
    
    get getHeight(){
        return this.height;
    }
    get getWidth(){
        return this.width;
    }
    get getWeight(){
        return this.weight;
    }
    get snakeBody(){
        return this.body;
    }

    get snakeHead(){
        return [this.body[0].x,this.body[0].y];
    }

    directionSnake(x,y){

        // NO CHANGE THE DIRECTION
        if(x == -this.dx) x = this.dx;
        if(y == -this.dy) y = this.dy;

        this.dx = x;
        this.dy = y;

        // Dealing with extremes.  3 is the border-width
        if(this.dx+this.body[0].x >this.canvas_w){
            for(var i = this.body.length-1; i >=0 ;i--){
                this.body[i].x = -i ;
            }
        }
        else if(this.dx+this.body[0].x < 3){
            for(var i = 0; i < this.body.length ;i++){
                this.body[i].x = this.canvas_w+i ;
            }
        }
        else if(this.dy+this.body[0].y > this.canvas_h){
            for(var i = this.body.length-1; i >=0 ;i--){
                this.body[i].y = -i ;
            }
        }
        else if(this.dy+this.body[0].y < 3){
            for(var i = 0; i < this.body.length;i++){
                this.body[i].y = this.canvas_h + i;
            }
        }
    }
    drawSnake(ctx){
        // Is game over?
        var gameOver = false;

        for(var i = this.body.length-1; i >0;i--){
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }

        // please, don't eat yourself
        if(this.weight!=1 && this.body.find(item => item.x == this.body[0].x+this.dx && item.y == this.body[0].y+this.dy )){   
            gameOver = true;
        }

        // snake head in new position
        this.body.unshift({x:this.body[0].x+this.dx,y:this.body[0].y+this.dy, color:this.body[0].color})
        
        while(this.body.length > this.weight){
            this.body.pop();
        }

        ctx.beginPath();
        for(var i = 0; i < this.body.length; i++ ){
            ctx.fillStyle = this.body[i].color;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.rect(this.body[i].x,this.body[i].y,this.width,this.height);
            ctx.strokeRect(this.body[i].x,this.body[i].y,this.width,this.height);
            ctx.fill();
        }
        ctx.closePath();
        
        return gameOver;
    }

    grow(){

        this.weight +=5;
        for(var i = 0; i < this.height/2; i++){
            this.body.push({x:this.body[0].x,y:this.body[0].y, color:"#B62A3D"});
        }
    }

}



class Game{
    constructor(){
       
        setKeys();
        localStorage.setItem("score",0);
        this.canvas = document.getElementById("snake");
        this.ctx = this.canvas.getContext("2d");
        this.canvas_score = document.getElementById("score");
        this.ctx_score = this.canvas_score.getContext("2d");
        this.newGame();
    }

    newGame(){
        this.gameOver = false;
        this.snake =  new Snake(this.canvas.width,this.canvas.height);
        this.hamburguer = new Hamburguer(this.canvas.width, this.canvas.height);
    }

    draw(){
        this.clear();
        this.drawTitle();

        // true = game Over
        if(this.snake.drawSnake(this.ctx)){
            this.gameOver = true;
        }

        this.hamburguer.drawHamburguer(this.ctx);
        this.drawScore();
        this.move();
        this.collisionDetection();
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx_score.clearRect(0,0,this.canvas_score.width,this.canvas_score.height);
    }

    drawTitle(){
        this.ctx.font = "100px Arial"
        this.ctx.fillStyle = "rgba(182,42,61,0.1)"
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("SNAKE.JS",this.canvas.width/2,this.canvas.height/2);
    }

    drawScore(){
        var score =  (this.snake.getWeight-1)/5;

        this.ctx_score.fillStyle = "#B62A3D";
        this.ctx_score.textBaseline = 'middle';
        this.ctx_score.textAlign = 'center';
        this.ctx_score.font = "30px Arial"
        this.ctx_score.fillText("SCORE",this.canvas_score.width/2,60);

        if(localStorage.getItem("score") < score){
            localStorage.setItem("score",score);
        }

        this.ctx_score.fillText(score,this.canvas_score.width/2,120);
        
        this.ctx_score.font = "20px Arial"
        this.ctx_score.fillStyle = "black";
        this.ctx_score.fillText("Highscore: "+ localStorage.getItem("score"),this.canvas_score.width/2,200)
    }

    collisionDetection(){
        var [x,y] = this.snake.snakeHead;
        var [z,w] = this.hamburguer.hamburguerPosition;
        if(x>z && x < z+this.hamburguer.getWidth && y>w && y <w+this.hamburguer.getHeight){
            this.snake.grow();
            this.hamburguer.newPosition();
        }
    }

    move(){
        if(rightPressed){
            this.snake.directionSnake(SPEED,ZERO);
        }
        else if(leftPressed){
            this.snake.directionSnake(-SPEED,ZERO);
        } 
        else if(upPressed){
            this.snake.directionSnake(ZERO,-SPEED);
        }
        else if(downPressed){
            this.snake.directionSnake(ZERO,SPEED);
        } else{
            this.snake.directionSnake(ZERO,ZERO);
        }
    }

    writeScreen(){
        this.ctx.font = "100px Arial";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = "#B62A3D";
    }

    play(){

        this.interval = setInterval(() => {
            // Reset
            if(click == true){
                setKeys();
                this.newGame();
            }
            // Game Over
            else if(this.gameOver == true){
                this.writeScreen();
                this.ctx.fillText("OUCH!!!!",this.canvas.width/2,this.canvas.height/2-100);
                this.ctx.fillText("GAME OVER",this.canvas.width/2,this.canvas.height/2+100);
            }
            // update
            else if(!pausePressed){
                this.draw();
            } 
            // Paused
            else{
                this.writeScreen();
                this.ctx.fillText("PAUSED",this.canvas.width/2,this.canvas.height/2-100);
            }
            },20);

        document.addEventListener("keydown", keyDownHandler, false); 
    }
}

const game = new Game();
game.play();
