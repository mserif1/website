const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://ec2-16-171-111-202.eu-north-1.compute.amazonaws.com", "http://ec2-16-171-111-202.eu-north-1.compute.amazonaws.com:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

let onlineUsers = 0;

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');
    onlineUsers++;
    io.emit('onlineUsers', onlineUsers);

    socket.on('setUsername', (username) => {
        socket.data.username = username;
        socket.emit('userConnected', `${username} bağlandı`);
        socket.broadcast.emit('userConnected', `${username} sohbete katıldı`);
    });

    socket.on('sendMessage', (message) => {
        const username = socket.data.username || 'Anonim';
        io.emit('newMessage', {
            message,
            username,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        onlineUsers--;
        io.emit('onlineUsers', onlineUsers);
        if (socket.data.username) {
            socket.broadcast.emit('userDisconnected', `${socket.data.username} ayrıldı`);
        }
    });
});

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
    console.log(`Socket.IO sunucusu ${HOST}:${PORT} üzerinde çalışıyor`);
}); 