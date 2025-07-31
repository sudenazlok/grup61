import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/tasks");
    } catch (err) {
      setError("Giriş başarısız! Bilgilerinizi kontrol edin.");
    }
  };

  const handlePasswordReset = async () => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, resetEmail);
    setResetMessage("Şifre sıfırlama e-postası gönderildi!");
    setResetError("");
  } catch (error) {
    setResetMessage("");
    setResetError("Bir hata oluştu: " + error.message);
  }
};


return (
  <div
    className="min-h-screen bg-repeat bg-cover flex flex-col items-center justify-center px-4 py-10"
    style={{
      backgroundImage: `
        url('https://www.transparenttextures.com/patterns/fresh-snow.png'),
        linear-gradient(to right, #dbeafe, #e9d5ff)`
    }}
  >
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-purple-700 drop-shadow-lg">
         AI Görev Planlayıcı 
      </h1>
      <p className="mt-2 text-lg text-gray-700">
        Yapay zeka destekli görev yönetimi ile hedeflerine daha kolay ulaş!
      </p>
    </header>

    <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-purple-100">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        Hoş geldin 👋
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Devam etmek için giriş yap lütfen ✨
      </p>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Giriş Yap
      </button>
      <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-2" onClick={() => setShowReset(true)}>
        Şifremi unuttum
      </p>
      {showReset && (
  <div className="bg-white p-4 rounded shadow mt-4">
    <h2 className="text-lg font-semibold mb-2">Şifre Sıfırlama</h2>
    <input
      type="email"
      placeholder="E-posta adresinizi girin"
      className="border p-2 w-full rounded"
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
    />
    <button
      onClick={handlePasswordReset}
      className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Sıfırlama E-postası Gönder
    </button>
    {resetMessage && <p className="text-green-600 mt-2">{resetMessage}</p>}
    {resetError && <p className="text-red-600 mt-2">{resetError}</p>}
  </div>
)}



      <p className="text-sm text-center mt-4">
        Hesabın yok mu?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Kayıt Ol
        </a>
      </p>
    </div>

    <footer className="mt-10 text-sm text-gray-600 text-center">
      © 2025 GörevPlan | Yapay Zeka ile Plan Yap ✍️
    </footer>
  </div>
);

}
export default Login; 
