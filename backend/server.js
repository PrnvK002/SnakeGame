const { createServer } = require('http');
const { Server } = require('socket.io');
const { FRAME_RATE } = require('./constants');
const { createGameState , gameLoop , getUpdatedVelocity , initGame } = require('./game');
const { makeId } = require('./utils');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors : {
        origin : "*"
    }
});

//============ creating global state variables =================

const state = {};
const clientRooms = {};

io.on("connection", (socket) => {
    // socket.emit('init',{ socket_id : socket.id });

    socket.on('keydown',handleKeydown);
    socket.on('newGame',handleNewGame);
    socket.on('joinGame',handleJoinGame);

    //================= Creating new room for game ============

    function handleNewGame(){
        let roomName = makeId(5);
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode',roomName);

        state[roomName] = initGame();
        console.log( "state", state);
        socket.join(roomName);
        socket.number = 1;
        socket.emit('init',1);
    }

    //====================== handling key press =========================
    function handleKeydown(keyCode){
        const roomName = clientRooms[socket.id];
        if(!roomName){
            return ;
        }
        try{
            keyCode = Number(keyCode);
        }catch(err){
            console.log(err);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if(vel){
            state[roomName].players[socket.number -1 ].vel = vel;
        }
    }
    //======================== handling second player join ==============
    function handleJoinGame(gameCode){
        const room = io.sockets.adapter.rooms[gameCode];
        let allUsers;
        if(room){
            allUsers = room.sockets;
        }
        let numClients = 0;
        if(allUsers){
            numClients = Object.keys(allUsers).length;
        }
        if(numClients === 0 ){
            socket.emit('unknownGame');
        }else if(numClients > 1){
            socket.emit('Too many Players');
            return ;
        }
        clientRooms[socket.id] = gameCode;
        socket.join(gameCode);
        socket.number = 2;
        socket.emit('init',2);
    
        startGameInterval(gameCode);
    }
});


//================ refreshing frames and moving the snake accordingly ========

function startGameInterval(roomName){

    const intervalId = setInterval(()=>{

        const winner = gameLoop(state[roomName]);

        console.log(winner);
        if(!winner){
            emitGameState(roomName,state[roomName]);
            // socket.emit('gameState',JSON.stringify(state));
        }else{
            emitGameOver(roomName,winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }

    },1000/FRAME_RATE)

}

function emitGameState(roomName ,state){
    // console.log(state);
    io.sockets.in(roomName).emit('gameState',JSON.stringify(state));
}

function emitGameOver(roomName,winner){
    io.sockets.in(roomName).emit('gameOver',JSON.stringify({ winner }));
}


httpServer.listen(3000);