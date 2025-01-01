const { Server } = require('socket.io');
const https = require('https');
const fs = require('fs');

// SSL sertifikası ve key dosyalarını okuyoruz
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/chat.mserifozturk.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/chat.mserifozturk.online/fullchain.pem')
};

const httpsServer = https.createServer(options);
const io = new Server(httpsServer, {
    cors: {
        origin: ["https://localhost:3000", "https://chat.mserifozturk.online", "https://chat.mserifozturk.online:3000"],
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

httpsServer.listen(PORT, HOST, () => {
    console.log(`Güvenli Socket.IO sunucusu ${HOST}:${PORT} üzerinde çalışıyor`);
});