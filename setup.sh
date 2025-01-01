#!/bin/bash

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulumu
sudo npm install -g pm2

# Proje bağımlılıklarını yükleme
npm install

# Next.js uygulamasını build etme
npm run build

# PM2 ile uygulamayı başlatma
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcında otomatik başlatma
pm2 startup
pm2 save 