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

    // 20 saniye sonra opacity ile kaybol
    setTimeout(() => {
        div.style.opacity = 0;
    }, 20000);

    // 22 saniye sonra DOM'dan sil
    setTimeout(() => {
        container.removeChild(div);
    }, 22000);
}

// Enter ile mesaj gönderme
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        const text = input.value.trim();
        socket.emit('newMessage', text);
        input.value = '';
    }
});

// Socket.io’dan gelen mesajları göster
socket.on('newMessage', (text) => {
    createMessageElement(text);
});
