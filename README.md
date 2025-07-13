# AI Destekli Görev Takip Uygulaması

Bu proje, React ve Firebase kullanılarak geliştirilmiş bir görev planlama uygulamasıdır. Kullanıcılar görevlerini ekleyebilir, teslim tarihlerini belirtebilir ve takvim üzerinden takip edebilir. İleride yapay zeka desteğiyle görevlerin haftalık/günlük planları otomatik üretilecektir.

## Başlamak için Gerekenler

### 1. Bu repoyu klonlayın:

```bash
git clone https://github.com/kullanici-adi/ai-todo-list.git
cd ai-todo-list
```

### 2. Gerekli bağımlılıkları yükleyin:

```bash
npm install
```

Bu komut, `package.json` dosyasında listelenmiş olan tüm kütüphaneleri yükler (örneğin `firebase`, `react-router-dom`, `react-calendar`, `tailwindcss` vb.).

---

## Firebase Kurulumu

> Herkesin kendi Firebase projesini oluşturması ve bilgilerini `firebase.js` dosyasına girmesi gerekmektedir.

### Adımlar:

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin.
2. “Yeni Proje Oluştur”a tıklayın ve projeyi oluşturun.
3. Sol menüden ⚙️ Ayarlar > Proje Ayarları kısmına gidin.
4. "Your apps" bölümünden `</>` (Web App) seçeneğiyle bir uygulama oluşturun.
5. Oluşturduktan sonra aşağıdaki gibi bir `firebaseConfig` objesi karşınıza çıkacak:

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "SİZİN-API-KEY",
  authDomain: "SİZİN-PROJENİZ.firebaseapp.com",
  projectId: "SİZİN-PROJE-ID",
  storageBucket: "SİZİN-PROJENİZ.appspot.com",
  messagingSenderId: "SENDER-ID",
  appId: "APP-ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

> `firebase.js` dosyasını `src` klasörü içine yerleştirin.

---

##  Projeyi Çalıştırmak

Aşağıdaki komutla projeyi çalıştırabilirsiniz:

```bash
npm start
```

Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görebilirsiniz.

---

##  Kullanılan Teknolojiler

* React
* Firebase (Auth + Firestore)
* Tailwind CSS
* React Router
* React Calendar

---

##  Özellikler

* ✅ Kayıt Ol / Giriş Yap
* ✅ Görev Ekle / Güncelle / Sil
* ✅ Teslim Tarihi Seçimi
* ✅ Takvim Görünümü
* ✅ Görev Günleri İşaretleme
* ✅ Teslim Tarihi Yaklaşanlar için Son 3 Gün Kala Uyarı
*  AI Destekli Haftalık/Günlük Planlama ve Bu Planlamanın Takvim Kısmına Yansıtılması (eklenecek)

---

