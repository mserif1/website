'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRef } from 'react';

const SOCKET_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
  : 'http://localhost:3001';

export default function Home() {
  const [socket, setSocket] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Bağlanılıyor:', SOCKET_URL);
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Bağlantı başarılı!');
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Bağlantı hatası:', error);
      setIsConnected(false);
    });

    newSocket.on('userConnected', (msg: string) => {
      setMessages(prev => [...prev, { type: 'system', content: msg }]);
    });

    newSocket.on('userDisconnected', (msg: string) => {
      setMessages(prev => [...prev, { type: 'system', content: msg }]);
    });

    newSocket.on('newMessage', (data: any) => {
      setMessages(prev => [...prev, {
        type: 'message',
        username: data.username,
        content: data.message,
        timestamp: data.timestamp,
        isCurrentUser: data.username === username
      }]);
    });

    newSocket.on('onlineUsers', (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      newSocket.close();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('setUsername', username);
      setHasSetUsername(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Realtime Chat
            </h1>
            {hasSetUsername && (
              <div className="text-sm text-gray-600">
                Çevrimiçi Kullanıcılar: {onlineCount}
              </div>
            )}
          </div>
          
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-gray-600 text-lg">
                Sunucuya bağlanılıyor...
              </div>
            </div>
          ) : !hasSetUsername ? (
            <div className="flex flex-col items-center justify-center h-64">
              <form onSubmit={handleSetUsername} className="w-full max-w-md space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-700">Sohbete Katıl</h2>
                  <p className="text-gray-500">Kullanıcı adınızı girin</p>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Sohbete Başla
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-[60vh] overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${
                      msg.type === 'system'
                        ? 'flex justify-center'
                        : msg.isCurrentUser
                        ? 'flex justify-end'
                        : 'flex justify-start'
                    }`}
                  >
                    <div
                      className={`${
                        msg.type === 'system'
                          ? 'bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full'
                          : msg.isCurrentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      } ${
                        msg.type !== 'system' ? 'max-w-[70%] break-words p-3 rounded-lg shadow-sm' : ''
                      }`}
                    >
                      {msg.type === 'system' ? (
                        msg.content
                      ) : (
                        <>
                          <div className="font-semibold text-sm">
                            {msg.username}
                          </div>
                          <div className="mt-1">{msg.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2 flex-wrap sm:flex-nowrap">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="w-full sm:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Gönder</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
