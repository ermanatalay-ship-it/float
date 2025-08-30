import { escapeHtml } from './util.js';

const socket = io();

const board = document.getElementById("board");
const form = document.getElementById("composer");
const input = document.getElementById("messageInput");

// Mesajları ekrana yerleştirmek için düşey yığın mantığı.
// Her yeni mesaj için rastgele yatay oynama + süre veriyoruz.
function createBubble({ id, text, ts }) {
  const el = document.createElement("div");
  el.className = "message";
  el.dataset.id = id;
  el.dataset.ts = ts;
  el.style.setProperty("--duration", `${9 + Math.random() * 6}s`);

  const shift = Math.floor(Math.random() * 40) - 20; // -20..20 px
  el.style.marginLeft = `${shift}px`;

  el.innerHTML = escapeHtml(text);
  board.appendChild(el);

  // Yeniden akışa girince sınıf ekleyelim (anim başlasın)
  requestAnimationFrame(() => el.classList.add("show"));

  // Animasyon bitince DOM'dan temizle
  el.addEventListener("animationend", () => {
    el.remove();
  });
}

// Sunucu: son mesajları yolla
socket.on("recent", (list) => {
  // Son giren kişi ekranında da görünmesi için kısa aralıklarla sırayla ekle
  let delay = 0;
  list.forEach((m) => {
    setTimeout(() => createBubble(m), delay);
    delay += 300;
  });
});

// Yeni mesaj yayını
socket.on("broadcast", (msg) => {
  createBubble(msg);
});

// Form kontrolü
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  socket.emit("newMessage", value);
  input.value = "";
});
