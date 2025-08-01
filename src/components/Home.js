import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase auth import

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">AI Görev Planlayıcı</h1>
        <p className="text-lg text-gray-700 mb-6">
          Yapay zeka destekli görev yönetimi ile hedeflerine daha kolay ulaş!<br/>
          Görevlerini ekle, teslim tarihini belirle, kişiselleştirilmiş plan önerileri al ve ilerlemeni takip et.
        </p>
        <ul className="text-left text-gray-600 mb-8 list-disc list-inside mx-auto max-w-md">
          <li>Kolay görev ekleme ve takvimde görüntüleme</li>
          <li>AI destekli kişisel planlama</li>
          <li>Görev tamamlama ve durum takibi</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <button
                onClick={() => navigate("/tasks")}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
              >
                Görevler
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Profilim
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
