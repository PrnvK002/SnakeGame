
const BG_COLOUR = "#231f20";
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOUR = "#e66916";


//=========== Socket initialisation ===================
const socket = io("http://localhost:3000");
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on('gameOver',handleGameOver);
socket.on('gameCode',handleGameCode);
socket.on('unknwonGame',handleUnknownGame);
socket.on('tooManyPlayers',handleTooManyPlayers);


const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click',newGame);
joinGameBtn.addEventListener('click',joinGame);

function newGame(){
    socket.emit('newGame');
    init();
}

function joinGame(){
    const code = gameCodeInput.value;
    socket.emit('joinGame',code);
    init();
}


let canvas, context;
let playerNumber;
let gameActive;

//===================== initialising the player Number ============
function handleInit(number) {
  playerNumber = number;
}

//========== handling gamestate automatically ================
function handleGameState(gameState) {
  if(!gameActive){
    return ;
  }
  gameState = JSON.parse(gameState);
  console.log("gameState---",gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

//=========== handling game over ==============================
function handleGameOver(data){
  if(!gameActive){
    return ;
  }
  data = JSON.parse(data);
  if(data.winner === playerNumber){
    alert('you win!');
  }else{
    alert('You lose');
  }
  gameActive = false;  
}

//============= showing game code ======================
function handleGameCode(code){
  gameCodeDisplay.innerText = code;
}

//================= handling unknown game ===============
function handleUnknownGame(){
  resetEverything();
  alert("unknown game code");
}

//========== handling tooo many players ==============
function handleTooManyPlayers(){
  resetEverything();
  alert('the game is already in progress');
}

//============ Reset ==================
function resetEverything(){
  playerNumber = null ;
  gameCodeInput.value = '';
  gameCodeDisplay.innerText = '';
  initialScreen.style.display = "";
  gameScreen.style.display = 'none';
}

//================ Initialising canvas ==============
function init() {
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.height = canvas.width = 600;
  context.fillStyle = BG_COLOUR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // paintGame(gameState);
  document.addEventListener("keydown", keydown);
  gameActive = true;
}

//============== while pressing key down ==========
function keydown(e) {
  socket.emit("keydown", e.keyCode);
}

//================ makes food and snake visible at initial state ==========

function paintGame(state) {
  console.log("paintgame",state);
  //======== for reseting the screen in each movement =======
  context.fillStyle = BG_COLOUR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  //=========== setting food position and color ======
  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  context.fillStyle = FOOD_COLOUR;
  context.fillRect(food.x * size, food.y * size, size, size);

  console.log("state in paintgame",state);
  paintPlayer(state.players[0], size , SNAKE_COLOR);
  paintPlayer(state.players[1],size , 'red');
}

function paintPlayer(player, size,color) {
  console.log(player);
  const snake = player.snake;
  context.fillStyle = color;
  for (part of snake) {
    console.log(part);
    context.fillRect(part.x * size, part.y * size, size, size);
  }
}

