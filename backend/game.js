const { GRID_SIZE } = require('./constants');

function createGameState(){
    return {
        players: [{
          pos: {
            x: 3,
            y: 10,
          },
          vel: {
            x: 1,
            y: 0,
          },
          snake: [
            {x: 1, y: 10},
            {x: 2, y: 10},
            {x: 3, y: 10},
          ],
        }, {
          pos: {
            x: 3,
            y: 12,
          },
          vel: {
            x: 1,
            y: 0,
          },
          snake: [
            {x: 1, y: 12},
            {x: 2, y: 12},
            {x: 3, y: 12},
          ],
        }],
        food: {},
        gridsize: GRID_SIZE,
      };
}

function gameLoop(state){

    if(!state){
        return;
    }
    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    

    if(playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE ){
        console.log("playerOne pos",playerOne.pos);
        return 2;
    }

    if(playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE ){
        console.log("playerTwo pos",playerTwo.pos);
        return 1;
    }
    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({ ...playerOne.pos }); 
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;

        randomFood(state);
    }

    if(state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y){

        playerTwo.snake.push({ ...playerTwo.pos }); 
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;

        randomFood(state);
    }

    if(playerOne.vel.x || playerOne.vel.y){
        for(let cell of playerOne.snake){
            if(cell.x=== playerOne.pos.x && cell.y === playerOne.pos.y){

        console.log("playerOne pos velo",playerOne.pos);
                return 2;
            }
        }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();

    if(playerTwo.vel.x || playerTwo.vel.y){
        for(let cell of playerTwo.snake){
            if(cell.x=== playerTwo.pos.x && cell.y === playerTwo.pos.y){

        console.log("playerTwo pos velo",playerTwo.pos);
                return 1;
            }
        }
    }

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();


    return false;
}

function randomFood(state){
    food = {
        x : Math.floor(Math.random() * GRID_SIZE ),
        y : Math.floor(Math.random() * GRID_SIZE )
    }

    for(let cell of state.players[0].snake){
        if(cell.x === food.x && cell.y === food.y){
            return randomFood(state);
        }
    }

    for(let cell of state.players[1].snake){
        if(cell.x === food.x && cell.y === food.y){
            return randomFood(state);   
        }
    }
    state.food = food;
}

//============= updating velocity according to the keypress ===========
function getUpdatedVelocity(keyCode){
    switch(keyCode){
        case 37:
            return { x : -1 , y : 0 }
        case 38:
            return { x : 0 , y : -1 }
        case 39:
            return { x:1 , y:0 }
        case 40:
            return { x:0 , y:1 }
    }
}

function initGame(){
    const state = createGameState();
    randomFood(state);
    return state;
}

module.exports = { createGameState , gameLoop , initGame , getUpdatedVelocity }