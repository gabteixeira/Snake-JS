var rightPressed;
var leftPressed;
var upPressed;
var downPressed;
var pausePressed;
var click;

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
    constructor(xposition,yposition){
        this.hamburguer = new Image();
        this.hamburguer.src = './assets/hamburguer.png';
        this.width = 32;
        this.height = 40;
        this.x = xposition;
        this.y=  yposition;
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
    newPosition(xposition,yposition){
        this.x = xposition;
        this.y= yposition;
    } 
}
class Snake{
    constructor(width,height){
        this.height = 10;
        this.width = 10;
        this.x = Math.floor(Math.random() * width);
        this.y = Math.floor(Math.random() * height);
        this.dx = 0;
        this.dy = 0;
        this.body = [{x:this.x,y:this.y, color:"#9A872D"}];
        this.weight = 1;
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
    directionSnake(x,y,xlim,ylim){
        this.dx = x;
        this.dy = y;

        if(this.dx+this.body[0].x >xlim){
            for(var i = this.body.length-1; i >=0 ;i--){
                this.body[i].x = -i ;
            }
        }
        else if(this.dx+this.body[0].x < 3){
            for(var i = 0; i < this.body.length ;i++){
                this.body[i].x = xlim+i ;
            }
        }
        else if(this.dy+this.body[0].y > ylim ){
            for(var i = this.body.length-1; i >=0 ;i--){
                this.body[i].y = -i ;
            }
        }
        else if(this.dy+this.body[0].y < 3){
            for(var i = 0; i < this.body.length;i++){
                this.body[i].y = ylim + i;
            }
        }
        return true;

    }
    drawSnake(ctx){
        var check = true;
        for(var i = this.body.length-1; i >0;i--){
            this.body[i].x = this.body[i-1].x
            this.body[i].y = this.body[i-1].y
        }
        if(this.weight!=1 && this.body.find(item => item.x == this.body[0].x+this.dx && item.y == this.body[0].y+this.dy )) this.body = this.body.reverse();

        this.body.unshift({x:this.body[0].x+this.dx,y:this.body[0].y+this.dy, color:this.body[0].color})
        while(this.body.length > this.weight)
            this.body.pop()
        ctx.beginPath()
        for(var i = 0; i < this.body.length; i++ ){
            ctx.fillStyle = this.body[i].color;
            ctx.rect(this.body[i].x,this.body[i].y,this.width,this.height)
            if(i!=0 && this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) check = false;
            ctx.fill();
        }
        ctx.closePath()
        
        return check;
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
        setKeys()
        this.gameOver = false;
        this.canvas = document.getElementById("snake");
        this.ctx = this.canvas.getContext("2d");
        this.canvas_score = document.getElementById("score");
        this.ctx_score = this.canvas_score.getContext("2d");
        this.snake =  new Snake(this.canvas.width,this.canvas.height);
        this.hamburguer = new Hamburguer(Math.floor(Math.random() * this.canvas.width-20), Math.floor(Math.random() * this.canvas.height-20));
    }
    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx_score.clearRect(0,0,this.canvas_score.width,this.canvas_score.height)
        if(!this.snake.drawSnake(this.ctx)) this.gameOver = true;
        this.hamburguer.drawHamburguer(this.ctx);
        this.drawScore();
        this.move();
        this.collisionDetection();
    }
    drawScore(){
        this.ctx_score.font = "30px Arial"
        this.ctx_score.fillStyle = "#B62A3D";
        this.ctx_score.fillText("SCORE",40,50);
        this.ctx_score.font = "50px Arial"
        this.ctx_score.fillText((this.snake.getWeight-1)/5,80,120)
    }
    collisionDetection(){
        var [x,y] = this.snake.snakeHead;
        var [z,w] = this.hamburguer.hamburguerPosition;
        if(x>z && x < z+this.hamburguer.getWidth && y>w && y <w+this.hamburguer.getHeight){
            this.snake.grow();
            this.hamburguer.newPosition(Math.floor(Math.random() * this.canvas.width-20), Math.floor(Math.random() * this.canvas.height-20));
        }

    }
    move(){
        var check = true;
        

        if(rightPressed){
            check = this.snake.directionSnake(5,0,this.canvas.width,this.canvas.height);
        }
        else if(leftPressed){
            check = this.snake.directionSnake(-5,0,this.canvas.width,this.canvas.height);
        } 
        else if(upPressed){
            check = this.snake.directionSnake(0,-5,this.canvas.width,this.canvas.height);
        }
        else if(downPressed){
            check = this.snake.directionSnake(0,5,this.canvas.width,this.canvas.height);
        } else{
            check = this.snake.directionSnake(0,0,this.canvas.width,this.canvas.height);
        }

        if(!check) this.gameOver = true;
    }
    play(){
        this.interval = setInterval(() => {
            if(click == true){
                setKeys();
                this.gameOver = false;
                this.snake =  new Snake(this.canvas.width,this.canvas.height);
                this.hamburguer = new Hamburguer(Math.floor(Math.random() * this.canvas.width-5), Math.floor(Math.random() * this.canvas.height-5));
            }
            else if(this.gameOver == true){
                this.ctx.font = "60px Arial"
                this.ctx.fillStyle = "#B62A3D";
                this.ctx.fillText("OUCH!!!!",40,50);
                this.ctx.fillText("GAME OVER",40,120)
            }
            else if(!pausePressed){
                this.draw();
            } else{
                this.ctx.font = "60px Arial"
                this.ctx.fillStyle = "#B62A3D";
                this.ctx.fillText("PAUSED",40,50);
            }
            },20);

        document.addEventListener("keydown", keyDownHandler, false); 
  

    }
}

const game = new Game();
game.play()
