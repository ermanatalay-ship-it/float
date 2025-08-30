
# Realtime Floating Messages

Basit bir Node.js + Express + Socket.IO uygulaması. Ziyaretçiler yazı girer, tüm ziyaretçiler görür. Mesajlar ekranın altından doğar, yukarı doğru yavaşça kayar ve kaybolur.

## Hızlı Başlangıç (Yerelde)

1) Node 18+ kurulu olsun.
2) Depoyu içeri aktarın veya bu klasörü indirin.
3) Kurulum:
```bash
npm install
```
4) Çalıştırın:
```bash
npm start
```
5) Tarayıcı: http://localhost:3000

## Dağıtım (Örnekler)

- **Render**, **Fly.io**, **Railway**, **Heroku** gibi Node barındırıcılarında tek tıkla çalışır. Varsayılan `PORT` ortam değişkenini kullanır, statik `public/` klasörünü sunar ve Socket.IO ile gerçek zamanlı çalışır.

## Proje Yapısı

```
realtime-floating-messages/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  ├─ script.js
│  └─ util.js
├─ server.js
├─ package.json
└─ README.md
```

## Notlar

- Mesajlar **kalıcı değil**, sunucunun hafızasında son 50 mesaj saklanır. İsterseniz bir veri tabanı ekleyebilirsiniz.
- Mesaj metni 200 karakterle sınırlıdır ve basit bir temizleyici ile işlenir.
- CSS animasyonu `floatUp` ile mesajlar yukarı doğru kayar ve silinir.
