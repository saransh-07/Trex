var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudimage;
var cloud;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacleGroup;
var cloudGroup;
var restart, restart_img;
var gameState, PLAY, END;
var gameO, gameO_img;
var score = 0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudimage = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restart_img = loadImage("restart.png");
  gameO_img = loadImage("gameOver.png");
  checkSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  PLAY = 1;
  END = 0;

  trex = createSprite(50, 150, 20, 50);
  trex.scale = 0.5;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  obstacleGroup = createGroup();
  cloudGroup = createGroup();


  gameO = createSprite(300, 100, 10, 10);
  gameO.addImage("game", gameO_img);
  gameO.visible = false;
  gameO.scale = 0.75;

  gameState = "PLAY";

  ground = createSprite(300, 175, 600, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -6;
  
  restart = createSprite(300, 100, 10, 10);  
  restart.addImage("restart", restart_img);
  restart.visible = false;

  invisibleGround = createSprite(200, 180, 400, 10);
  invisibleGround.visible = false;

  score = 0;
}

function draw() {
  background(180);


  trex.collide(invisibleGround);
  text("Score:\t" + score, 399, 19);
  if (gameState === "PLAY") {

    score = score + Math.round(getFrameRate() / 60);

    console.log(trex.y);



    if (keyDown("space") && trex.y > 120) {
      trex.velocityY = -12.5;
      jumpSound.play();
    }

    if (score > 0 && score % 100 === 0) {
      checkSound.play();
    }
    console.log(trex.y);
    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (obstacleGroup.isTouching(trex)) {
      gameState = "END";
      dieSound.play();
    }
    spawncloud();
    spawnobstacle();

  } else if (gameState === "END") {
    trex.velocityY = 0;
    gameO.visible = true;

    trex.changeAnimation("collided", trex_collided);
    restart.scale = 0.5;
    restart.y = 135;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    restart.visible = true;
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawncloud() {
  if (frameCount % 80 === 0) {
    cloud = createSprite(650, 75, 10, 10);
    cloud.addImage(cloudimage);
    cloud.velocityX = -6;
    cloud.lifetime = 150;
    cloudGroup.add(cloud);
    trex.depth = cloud.depth + 1;
    cloud.y = Math.round(random(50, 100));
  }
}

function spawnobstacle() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(650, 160, 10, 10);
    obstacle.velocityX = -6;
    obstacle.lifetime = 150;
    obstacleGroup.add(obstacle);
    obstacle.scale = 0.5;
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;

    }
  }
}

function reset() {
  gameState = "PLAY";
  score = 0;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  gameO.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);
  ground.velocityX = -(6 + 3 * score / 100);
}