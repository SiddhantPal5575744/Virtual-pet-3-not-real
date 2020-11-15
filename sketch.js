var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var readstate,gameState;
var bedroom,washroom,garden;
var currentTime;

function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage(" dogImg1.png");
bedroom=loadImage("Bed Room.png");
washroom=loadImage("Wash Room.png");
garden=loadImage("Garden.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);



  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  currentTime=hour();
  if(currentTime=(lastFed+1)){
    update("Playing");
    foodObj.garden();

  }
  if(currentTime=(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();

  }

  if(currentTime >( lastFed+2) && currentTime<=(lastFed+2)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

}

function draw() {
  background('blue');
  foodObj.display();

  readstate=database.ref('gameState');
  readstate.on("value",function(data){
    gameState=data.val();
  })

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  currentTime=hour();
  if(currentTime=(lastFed+1)){
    update("Playing");
    foodObj.garden();

  }
  if(currentTime=(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();

  }

  if(currentTime >( lastFed+2) && currentTime<=(lastFed+2)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,15);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,15);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,15);
   }

   if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}