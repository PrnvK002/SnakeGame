const BG_COLOUR = "#231f20";
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOUR = "#e66916";

const gameScreen = document.getElementById("gameScreen");

let canvas, context;

const gameState = {
    player : {
        pos : {
            x:3,
            y:10
        },
        vel : {
            x : 1,
            y : 0
        },
        snake : [
            { x:1,y:10 },
            { x:2 , y:10 },
            { x:3 , y:10 }
        ]
    },
    food : {
        x : 7,
        y : 7
    },
    gridsize : 20
};

//================ Initialising canvas ==============
function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
    console.log(context);
  canvas.height = canvas.width = 600; 
  context.fillStyle = BG_COLOUR;
  context.fillRect(0, 0, canvas.width, canvas.height);
    paintGame(gameState);
  document.addEventListener("keydown", keydown);
}

//============== while pressing key down ==========
function keydown(e) {
  console.log(e.keyCode);
}

//================ makes food and snake visible at initial state ==========

function paintGame(state){

    //======== for reseting the screen in each movement =======
    context.fillStyle = BG_COLOUR;
    context.fillRect(0,0,canvas.width, canvas.height)

    //=========== setting food position and color ======
    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width/gridsize;

    context.fillStyle = FOOD_COLOUR;
    context.fillRect(food.x * size , food.y * size , size , size);

    paintPlayer(state.player,size);
}

function paintPlayer(player,size){

    const snake = player.snake;
    context.fillStyle=SNAKE_COLOR;
    for( part of snake ){
        console.log(part);
        context.fillRect(part.x * size , part.y * size , size , size);
    }
}

//============= invoking init =====================
init();


