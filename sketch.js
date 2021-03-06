var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var espacioImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver;
var restart;
var gameOverImage;
var restartImage;

var dieSound;
var checkPointSound;
var jumpSound;
function preload(){
  trex_running = loadAnimation("astro.png","astro.png","astro.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  espacioImage=loadImage("espacio.jpg");
  
  cloudImage = loadImage("estrellas.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("checkPoint.mp3");
  checkPointSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.7;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage("over",gameOverImage);
  restart = createSprite(width/2,heigth/2+20);
  restart.addImage("start",restartImage);
  
  gameOver.visible=false;
  restart.visible=false;
  
  invisibleGround = createSprite(width/2,heigth-10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  gameState=PLAY;
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,30);
  trex.debug = false;
  
  score = 0
}

function draw() {
  background(espacioImage);
  //displaying score
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if (score>0&&score%100==0){
      checkPointSound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length>0||keyDown("space"))&& trex.y >=120) {
        trex.velocityY = -13;
        jumpSound.play();  
        touches=[]; 
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-1);
     gameOver.visible=true;
     restart.visible=true;
   }
  if (touches.length>0||mousePressedOver(restart)){
    reset();
    touches=[]
  }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible=false;
  restart.visible=false;
  gameState=PLAY;
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-95,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
     switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale =1;
    cloud.velocityX = -(3+score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

