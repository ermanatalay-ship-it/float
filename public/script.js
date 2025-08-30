const socket = io();
const container = document.getElementById('message-container');
const input = document.getElementById('message-input');

function createMessageElement(text) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.textContent = text;

    // Yatay konumu rastgele ama üst üste binmeyi azaltacak
    const maxWidth = container.clientWidth - 150;
    div.style.left = Math.random() * maxWidth + 'px';
    div.style.bottom = '0px';

    container.appendChild(div);

    // Animasyonu başlat hemen
    requestAnimationFrame(() => {
        div.style.transform = `translateY(-${container.clientHeight}px)`;
    });

    // 40 saniye sonra opacity ile kaybol (match CSS)
    setTimeout(() => {
        div.style.opacity = 0;
    }, 40000);

    // 42 saniye sonra DOM'dan sil
    setTimeout(() => {
        container.removeChild(div);
    }, 42000);
}

// Enter ile mesaj gönderme
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        const text = input.value.trim();
        socket.emit('newMessage', text);
        input.value = '';
    }
});

// Yeni gelen mesajlar
socket.on('broadcast', (message) => {
    createMessageElement(message.text);
});

// Aktif (görünen) mesajlar sayfa açılır açılmaz gösterilsin
socket.on('recent', (messages) => {
    messages.forEach(msg => createMessageElement(msg.text));
});
