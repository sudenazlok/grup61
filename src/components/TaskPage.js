import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function TaskPage() {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const tasksCollection = collection(db, "tasks");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Çıkış yapılamadı:", error);
    }
  };

  const fetchTasks = async (uid) => {
    const q = query(tasksCollection, where("userId", "==", uid));
    const snapshot = await getDocs(q);
    const fetchedTasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(fetchedTasks);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchTasks(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (task.trim() === "" || !deadline || !currentUser) return;

    if (editId) {
      const taskRef = doc(db, "tasks", editId);
      await updateDoc(taskRef, { text: task, deadline });
      setEditId(null);
    } else {
      await addDoc(tasksCollection, {
        text: task,
        deadline,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
    }

    setTask("");
    setDeadline("");
    fetchTasks(currentUser.uid);
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    if (currentUser) fetchTasks(currentUser.uid);
  };

  const handleEditTask = (task) => {
    setTask(task.text);
    setDeadline(task.deadline);
    setEditId(task.id);
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-100 to-teal-100">
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-2xl">
      
      {/* Sağ üst köşede alt alta 2 buton */}
      <div className="flex flex-col items-end gap-2 mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
        >
          Çıkış Yap
        </button>
        <button
          onClick={() => navigate("/calendar")}
          className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          📅 Takvimi Gör
        </button>
      </div>

      {/* Başlık */}
      <h1 className="text-3xl font-bold text-teal-700 text-center mb-2">
        ✨ Görev Sihirbazın ✨
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Yapılacakları yaz, teslim tarihini ekle, sihirli planlamaya hazır ol!
      </p>

      {/* Görev Ekleme Formu */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="🎯 Ne yapacaksın?"
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleAddTask}
          className="bg-teal-700 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition"
        >
          {editId ? "🛠 Güncelle" : "+ Ekle"}
        </button>
      </div>

      {/* Görev Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white/80 border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h3
              onClick={() => navigate(`/task/${t.id}`, { state: { task: t } })}
              className="text-xl font-semibold text-teal-700 cursor-pointer hover:underline"
            >
              {t.text}
            </h3>
            <p className="text-sm text-gray-600">
              📅 Teslim Tarihi:{" "}
              <span className="text-black font-medium">{t.deadline}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              🤖 AI planı: Tıklayınca detaylı yapay zeka önerisi!
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEditTask(t)}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                ✏️ Güncelle
              </button>
              <button
                onClick={() => handleDeleteTask(t.id)}
                className="text-sm bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
              >
                🗑 Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};


export default TaskPage;
