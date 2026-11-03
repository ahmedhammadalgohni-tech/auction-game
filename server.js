const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {};

// قائمة اللاعبين النصية (بدون صور)
const allPlayersPool = [
    { n: "M. Locatelli", r: 84 },
    { n: "N. Pépé", r: 80 },
    { n: "L. Hrádecký", r: 81 },
    { n: "N. Pope", r: 81 },
    { n: "Maradona", r: 97 },
    { n: "O. Baumann", r: 83 },
    { n: "H. Vanaken", r: 80 },
    { n: "Yeremy Pino", r: 80 },
    { n: "M. Ginter", r: 82 },
    { n: "F. Dimarco", r: 85 },
    { n: "M. Sels", r: 83 },
    { n: "J. Schouten", r: 80 },
    { n: "M. Guendouzi", r: 82 },
    { n: "R. Andrich", r: 81 },
    { n: "P. Zieliński", r: 80 },
    { n: "Marc Cucurella", r: 84 },
    { n: "F. Wirtz", r: 89 },
    { n: "P. Gulácsi", r: 85 },
    { n: "M. Rashford", r: 80 },
    { n: "Zidane", r: 96 },
    { n: "A. Bastoni", r: 87 },
    { n: "K. Coman", r: 83 },
    { n: "D. Vlahović", r: 83 },
    { n: "T. Hernandez", r: 87 },
    { n: "J. Musiala", r: 88 },
    { n: "M. Maignan", r: 87 },
    { n: "R. Leão", r: 86 },
    { n: "H. Kane", r: 90 },
    { n: "J. Bellingham", r: 90 },
    { n: "K. De Bruyne", r: 90 },
    { n: "V. Júnior", r: 90 },
    { n: "Rodri", r: 91 },
    { n: "K. Mbappé", r: 91 },
    { n: "E. Haaland", r: 91 },
    { n: "Ronaldo", r: 96 },
    { n: "Pelé", r: 98 },
    { n: "Ronaldinho", r: 95 },
    { n: "Maldini", r: 94 },
    { n: "Buffon", r: 93 },
    { n: "Henry", r: 94 },
    { n: "Xavi", r: 92 },
    { n: "Iniesta", r: 93 },
    { n: "Cafu", r: 92 },
    { n: "Roberto Carlos", r: 93 },
    { n: "Puyol", r: 91 },
    { n: "Nesta", r: 92 },
    { n: "Cannavaro", r: 93 },
    { n: "Pirlo", r: 92 },
    { n: "Kaká", r: 94 },
    { n: "Seedorf", r: 90 },
    { n: "Eto'o", r: 91 },
    { n: "Drogba", r: 90 },
    { n: "Van Basten", r: 95 },
    { n: "Gullit", r: 94 },
    { n: "Baggio", r: 93 },
    { n: "Platini", r: 94 },
    { n: "Matthäus", r: 92 },
    { n: "Schweinsteiger", r: 89 },
    { n: "Lahm", r: 91 },
    { n: "Neuer", r: 92 },
    { n: "Messi", r: 94 },
    { n: "Neymar", r: 91 },
    { n: "Suarez", r: 92 },
    { n: "Lewandowski", r: 92 }
];

function getRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * allPlayersPool.length);
    return allPlayersPool[randomIndex];
}

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);
    const fn = () => Math.random().toString(36).substring(2, 7).toUpperCase();

    // 1. إنشاء الغرفة
    socket.on('create-room', (playerName) => {
        const roomCode = fn();
        rooms[roomCode] = {
            host: socket.id,
            players: [{ id: socket.id, name: playerName, team: [], budget: 100 }],
            status: 'waiting',
            currentBid: 5,
            currentLead: null,
            currentCard: null,
            roundTimer: null,
            totalRounds: 5, // عدد الجولات لكل مباراة
            currentRound: 0
        };
        socket.join(roomCode);
        socket.emit('room-created', roomCode);
    });

    // 2. انضمام لاعب للغرفة
    socket.on('join-room', (data) => {
        const roomCode = (data.roomCode || data).trim().toUpperCase();
        const playerName = data.playerName || "لاعب";
        const room = rooms[roomCode];

        if (!room) {
            socket.emit('error-msg', 'الغرفة غير موجودة!');
            return;
        }
        if (room.players.length >= 4) {
            socket.emit('error-msg', 'الغرفة ممتلئة!');
            return;
        }
        if (room.status !== 'waiting') {
            socket.emit('error-msg', 'اللعبة قد بدأت بالفعل!');
            return;
        }

        room.players.push({ id: socket.id, name: playerName, team: [], budget: 100 });
        socket.join(roomCode);

        io.to(roomCode).emit('update-lobby', {
            players: room.players,
            hostId: room.host
        });
    });

    // دالة بدء جولة جديدة للمزاد
    function startNextRound(roomCode) {
        const room = rooms[roomCode];
        if (!room) return;

        room.currentRound++;
        if (room.currentRound > room.totalRounds) {
            room.status = 'ended';
            io.to(roomCode).emit('auction-ended', room.players);
            return;
        }

        room.currentCard = getRandomPlayer();
        room.currentBid = 5;
        room.currentLead = null;

        // إرسال بيانات اللاعب الحالي للجميع
        io.to(roomCode).emit('game-started', {
            card: room.currentCard,
            bid: room.currentBid,
            players: room.players,
            lead: room.currentLead,
            round: room.currentRound
        });

        // ضبط مؤقت لمدة 20 ثانية لتنتهي الجولة تلقائياً من السيرفر
        if (room.roundTimer) clearTimeout(room.roundTimer);
        room.roundTimer = setTimeout(() => {
            // تثبيت البيع لمن مزاود أخيراً
            if (room.currentLead !== null) {
                const winner = room.players[room.currentLead];
                winner.budget -= room.currentBid;
                winner.team.push(room.currentCard);
            }
            // الانتقال للجولة التالية بعد ثوانٍ قليلة من إعلان النتيجة
            startNextRound(roomCode);
        }, 20000);
    }

    // 3. بدء اللعبة من قِبل المنشئ
    socket.on('start-game', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.host !== socket.id) return;

        room.status = 'playing';
        room.currentRound = 0;
        startNextRound(roomCode);
    });

    // 4. حدث المزايدة (+1)
    socket.on('place-bid', ({ roomCode, playerIndex }) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'playing') return;

        const bidder = room.players[playerIndex];
        // التأكد أن لديه ميزانية كافية للمزايدة
        if (bidder.budget >= room.currentBid + 1) {
            room.currentBid += 1;
            room.currentLead = playerIndex;

            io.to(roomCode).emit('update-auction', {
                bid: room.currentBid,
                lead: room.currentLead
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('انقطع الاتصال:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ ${PORT}`);
});
