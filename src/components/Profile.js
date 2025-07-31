import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasks(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid) => {
    const q = query(collection(db, "tasks"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    const allTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTasks(allTasks);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
          <p className="text-lg text-gray-700">Kullanıcı bulunamadı. Lütfen giriş yapın.</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Anasayfa</button>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-100 to-teal-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-teal-700 text-center mb-4">Profilim</h1>
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-800 font-semibold">E-posta:</p>
          <p className="text-md text-gray-600">{user.email}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Devam Eden Görevler */}
          <div>
            <h2 className="text-xl font-bold text-blue-700 mb-2 text-center">Devam Eden Görevler</h2>
            {activeTasks.length === 0 ? (
              <p className="text-gray-500 text-center">Devam eden görev yok.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activeTasks.map((t) => (
                  <div key={t.id} className="bg-white/80 border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-teal-700">{t.text}</h3>
                    <p className="text-sm text-gray-600">📅 Teslim Tarihi: <span className="text-black font-medium">{t.deadline}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Tamamlanan Görevler */}
          <div>
            <h2 className="text-xl font-bold text-green-700 mb-2 text-center">Tamamlanan Görevler</h2>
            {completedTasks.length === 0 ? (
              <p className="text-gray-500 text-center">Tamamlanan görev yok.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {completedTasks.map((t) => (
                  <div key={t.id} className="bg-white/80 border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition opacity-60 line-through">
                    <h3 className="text-lg font-semibold text-teal-700 line-through">{t.text}</h3>
                    <p className="text-sm text-gray-600">📅 Teslim Tarihi: <span className="text-black font-medium">{t.deadline}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button onClick={() => navigate("/tasks")} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Görev Listesine Dön</button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 