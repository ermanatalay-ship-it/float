/**
 * Realtime Floating Messages
 * Basit bir Express + Socket.IO uygulaması
 * Tüm ziyaretçiler gönderilen metinleri görür.
 */
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: false },
  maxHttpBufferSize: 1e5 // ~100 KB
});

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"],
      "connect-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Son 50 mesaj hafızada tutulur (kalıcı depolama yok).
const RECENT_LIMIT = 50;
const recentMessages = [];

/** Basit temizleyici: trim + uzunluk sınırı + kontrol karakterleri temizleme */
function sanitizeText(input) {
  if (typeof input !== "string") return "";
  let txt = input.trim();
  // 200 karakter sınırı
  if (txt.length > 200) txt = txt.slice(0, 200);
  // Kontrol karakterlerini temizle (yeni satır haric)
  txt = txt.replace(/[^\P{C}\n\t\r]/gu, "");
  return txt;
}

io.on("connection", (socket) => {
  // Yeni bağlananlara son mesajları gönder
  if (recentMessages.length) {
    socket.emit("recent", recentMessages);
  }

  socket.on("newMessage", (raw) => {
    const text = sanitizeText(raw);
    if (!text) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      ts: Date.now()
    };

    // Hafızaya ekle ve sınırı koru
    recentMessages.push(message);
    if (recentMessages.length > RECENT_LIMIT) {
      recentMessages.splice(0, recentMessages.length - RECENT_LIMIT);
    }

    // Herkese yayınla
    io.emit("broadcast", message);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
