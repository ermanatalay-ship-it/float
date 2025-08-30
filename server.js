/**
 * Realtime Floating Messages - ACTIVE MESSAGE VERSION
 * Only currently floating messages are sent to new visitors.
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

// ACTIVE MESSAGE LOGIC
const activeMessages = [];
const MESSAGE_LIFETIME = 40000; // 40 saniye (animation duration)

io.on("connection", (socket) => {
  // Yeni bağlananlara sadece aktif (görünen) mesajları gönder
  if (activeMessages.length) {
    socket.emit("recent", activeMessages);
  }

  socket.on("newMessage", (raw) => {
    const text = sanitizeText(raw);
    if (!text) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      ts: Date.now()
    };

    activeMessages.push(message);
    io.emit("broadcast", message);

    // Mesajı X saniye sonra aktif listeden çıkar
    setTimeout(() => {
      const index = activeMessages.findIndex(m => m.id === message.id);
      if (index !== -1) activeMessages.splice(index, 1);
    }, MESSAGE_LIFETIME);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
