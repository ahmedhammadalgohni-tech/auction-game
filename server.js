const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {};

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);

    const fn = () => Math.random().toString(36).substring(2, 7).toUpperCase();

    socket.on('create-room', (playerName) => {
        const roomCode = fn();
        rooms[roomCode] = {
            host: socket.id,
            players: [{ id: socket.id, name: playerName, team: [], budget: 25 }],
            status: 'waiting'
        };
        socket.join(roomCode);
        socket.emit('room-created', roomCode);
    });

    socket.on('join-room', ({ roomCode, playerName }) => {
        const room = rooms[roomCode];
        if (!room) return socket.emit('error-msg', 'الغرفة غير موجودة!');
        if (room.players.length >= 4) return socket.emit('error-msg', 'الغرفة ممتلئة (الحد الأقصى 4 لاعبين)!');
        if (room.status !== 'waiting') return socket.emit('error-msg', 'اللعبة قد بدأت بالفعل!');

        room.players.push({ id: socket.id, name: playerName, team: [], budget: 25 });
        socket.join(roomCode);
        
        io.to(roomCode).emit('update-lobby', room.players);
    });

    socket.on('disconnect', () => {
        console.log('انقطع الاتصال:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ ${PORT}`);
});