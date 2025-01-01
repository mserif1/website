# Real-time Chat Uygulaması

Next.js ve Socket.IO kullanılarak geliştirilmiş gerçek zamanlı sohbet uygulaması.

## Özellikler

- Gerçek zamanlı mesajlaşma
- Kullanıcı durumu bildirimleri (bağlandı/ayrıldı)
- Çevrimiçi kullanıcı sayısı
- Mobil uyumlu tasarım
- Otomatik kaydırma
- Zaman damgalı mesajlar

## Teknolojiler

- Next.js
- Socket.IO
- TypeScript
- Tailwind CSS

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/[KULLANICI_ADI]/websocketuc.git
cd websocketuc
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
# Terminal 1 - Next.js uygulaması
npm run dev

# Terminal 2 - Socket.IO sunucusu
node server.js
```

## AWS EC2 Üzerinde Dağıtım

1. EC2 instance'ınızda gerekli portları açın:
   - 3000 (Next.js)
   - 3001 (Socket.IO)

2. Kurulum betiğini çalıştırın:
```bash
chmod +x setup.sh
./setup.sh
```

3. `.env` dosyasını oluşturun:
```bash
NEXT_PUBLIC_SOCKET_URL=http://[EC2_IP]:3001
```

4. PM2 ile uygulamayı yönetin:
```bash
# Durum kontrolü
pm2 status

# Logları görüntüleme
pm2 logs

# Yeniden başlatma
pm2 restart all
```

## Lisans

MIT
