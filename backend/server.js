const { createServer } = require('http');
const { Server } = require('socket.io');
const { FRAME_RATE } = require('./constants');
const { createGameState , gameLoop , getUpdatedVelocity } = require('./game');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors : {
        origin : "*"
    }
});

io.on("connection", (socket) => {
    // socket.emit('init',{ socket_id : socket.id });
    const state = createGameState();

    socket.on('keydown',handleKeydown);
    //====================== handling key press =========================
    function handleKeydown(keyCode){
        try{
            keyCode = Number(keyCode);
        }catch(err){
            console.log(err);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if(vel){
            state.player.vel = vel;
        }
    }
    startGameInterval(socket,state);
});

//================ refreshing frames and moving the snake accordingly ========

function startGameInterval(socket,state){

    const intervalId = setInterval(()=>{

        const winner = gameLoop(state);
        if(!winner){
            socket.emit('gameState',JSON.stringify(state));
        }else{
            socket.emit('gameOver');
            clearInterval(intervalId);
        }

    },1000/FRAME_RATE)

}



httpServer.listen(3000);