import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/tasks");
    } catch (err) {
      setError("Kayıt başarısız! Lütfen bilgileri kontrol et.");
    }
  };

   return (
    <div
      className="min-h-screen bg-repeat bg-cover flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/fresh-snow.png'), linear-gradient(to right, #d1fae5, #bfdbfe)`
      }}
    >
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-700 drop-shadow-lg">
          Yeni bir başlangıca hazır mısın?
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Yapay zeka ile plan yapmaya başlamak için hemen kaydol!
        </p>
      </header>

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-green-100">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">
          Hesap Oluştur 🌱
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Hedeflerine ulaşmak artık daha kolay!
        </p>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Kayıt Ol
        </button>

        <p className="text-sm text-center mt-4">
          Zaten bir hesabın var mı?{' '}
          <a href="/" className="text-green-600 hover:underline">
            Giriş Yap
          </a>
        </p>
      </div>

      <footer className="mt-10 text-sm text-gray-600 text-center">
        © 2025 GörevPlan | Yapay Zeka ile Plan Yap ✍️
      </footer>
    </div>
  );
}


export default Register;
