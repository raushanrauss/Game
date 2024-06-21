// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// Array to store connected players
let players = [];
// Array to store players waiting to join a game
let waitingList = [];
// Array to store leaderboard data
let leaderboard = [];

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle new player joining
    socket.on('joinGame', (playerName) => {
        const player = {
            id: socket.id,
            name: playerName,
            score: 0,
            choice: null,
            opponent: null,
        };

        // Add player to waiting list
        waitingList.push(player);

        // Update waiting list for all clients
        updateWaitingList();

        // Check if there's a match available
        checkMatch();

        // Emit initial data to the newly connected client
        socket.emit('updatePlayers', players);
        socket.emit('updateLeaderboard', leaderboard);
        socket.emit('updateWaitingList', waitingList);
    });

    // Handle player making a move
    socket.on('makeMove', (choice) => {
        const playerIndex = players.findIndex(player => player.id === socket.id);
        if (playerIndex !== -1) {
            players[playerIndex].choice = choice;

            // Check if both players have made their move
            if (players[playerIndex].opponent && players[playerIndex].opponent.choice !== null) {
                const opponentIndex = players.findIndex(player => player.id === players[playerIndex].opponent.id);
                const result = determineWinner(players[playerIndex], players[opponentIndex]);

                // Update scores based on result
                if (result === 'win') {
                    players[playerIndex].score += 1;
                } else if (result === 'lose') {
                    players[opponentIndex].score += 1;
                }

                // Reset choices
                players[playerIndex].choice = null;
                players[opponentIndex].choice = null;

                // Update players and leaderboard
                updatePlayersAndLeaderboard();

                // Check if there's a match available for the players
                checkMatch();
            }
        }
    });

    // Handle disconnecting client
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Remove player from arrays
        players = players.filter(player => player.id !== socket.id);
        waitingList = waitingList.filter(player => player.id !== socket.id);

        // Update waiting list and players for all clients
        updateWaitingList();
        updatePlayersAndLeaderboard();
    });

    // Helper function to update waiting list for all clients
    const updateWaitingList = () => {
        io.emit('updateWaitingList', waitingList);
    };

    // Helper function to update players and leaderboard for all clients
    const updatePlayersAndLeaderboard = () => {
        io.emit('updatePlayers', players);
        io.emit('updateLeaderboard', leaderboard);
    };

    // Helper function to determine winner
    const determineWinner = (player1, player2) => {
        const choices = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper',
        };

        if (player1.choice === player2.choice) {
            return 'draw';
        } else if (choices[player1.choice] === player2.choice) {
            return 'win';
        } else {
            return 'lose';
        }
    };

    // Helper function to check if there's a match available
    const checkMatch = () => {
        if (waitingList.length >= 2) {
            // Take first two players from waiting list
            const player1 = waitingList.shift();
            const player2 = waitingList.shift();

            // Assign opponents to each other
            player1.opponent = player2;
            player2.opponent = player1;

            // Add players to the game
            players.push(player1, player2);

            // Update players and leaderboard for all clients
            updatePlayersAndLeaderboard();

            // Update waiting list for all clients
            updateWaitingList();
        }
    };
});

// Start server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
