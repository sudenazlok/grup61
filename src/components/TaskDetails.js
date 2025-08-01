import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateStructuredPlan } from "../geminiService";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { getDocs, query, where } from "firebase/firestore";



function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  const [description, setDescription] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [dailyHours, setDailyHours] = useState("");
  const [aiPlan, setAiPlan] = useState([]);
  const [showPlan, setShowPlan] = useState(false);

useEffect(() => {

   console.log("TaskDetails useEffect çalıştı");

  if (!task?.isAi) {
    console.log("task undefined veya isAi değil, return ile çıkıldı!");
    return;
  }


  const fetchAiPlan = async () => {
    // Firestore’dan oku
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", auth.currentUser?.uid),
        where("isAi", "==", true),
        where("taskTitle", "==", task.text), 
        where("completed", "==", false)
      );
    console.log("task.text", task.text);
 


    const snapshot = await getDocs(q);
  
    const plan = snapshot.docs.map(doc => ({
      date: doc.data().deadline, // veya .date
      task: doc.data().text      // veya .task
    }));
    console.log("Firestore'dan gelen plan:", plan);

    if (plan.length > 0) {
      setAiPlan(plan);
      setShowPlan(true);
    } else {
      // Firestore’da yoksa, localStorage’a bak
      const key = `aiPlan-${task.text}-${task.deadline}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.aiPlan)) {
            setAiPlan(parsed.aiPlan);
            setShowPlan(true);
            return;
          }
        } catch (err) {
          console.error("LocalStorage plan verisi bozuk:", err);
        }
      }
      

      setAiPlan([]);
      setShowPlan(false);
      

    }
  };

  fetchAiPlan();
}, [task]);




  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 bg-repeat" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/fresh-snow.png')" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Görev bulunamadı.</h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate("/tasks")}
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const deadlineDate = new Date(task.deadline);
  const diffInTime = deadlineDate.getTime() - today.getTime();
  const deadlineDiff = Math.ceil(diffInTime / (1000 * 3600 * 24));

  const handleDayToggle = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };


const generateAiPlan = async () => {
  if (!description || !dailyHours || availableDays.length === 0) return;

  const planData = {
    description,
    deadline: task.deadline,
    dailyHours,
    availableDays,
    startDate: todayStr
  };

  const result = await generateStructuredPlan(planData);
  console.log("AI'dan gelen yanıt:", result);
  if (!result || !Array.isArray(result)) {
  alert("AI'dan beklenen formatta plan gelmedi. Lütfen tekrar deneyin.");
  return;
}
  result.forEach((item, idx) => {
  console.log(`Item ${idx}: task=${item.task}, date=${item.date}`);
});

  if (result) {
    const uid = auth.currentUser?.uid;

 const q = query(
  collection(db, "tasks"),
  where("userId", "==", auth.currentUser?.uid),
  where("isAi", "==", true),
  where("taskTitle", "==", task.text),
  where("completed", "==", false)
);


    const snapshot = await getDocs(q);
    const existingTasks = snapshot.docs.map(doc => doc.data());

    let duplicateFound = false;

    for (const item of result) {
      const isDuplicate = existingTasks.some(
        (existing) =>
          existing.userId === uid &&
          existing.text === item.task &&
          existing.deadline === item.date &&
          existing.isAi
      );

      if (!isDuplicate) {
        await addDoc(collection(db, "tasks"), {
          userId: auth.currentUser?.uid,
          text: item.task,
          deadline: item.date,
          completed: false,
          isAi: true,
          taskTitle: task.text
        });
      } else {
        duplicateFound = true;
      }
    }

    setAiPlan(result);
    setShowPlan(true);

    const key = `aiPlan-${task.text}-${task.deadline}`;
    localStorage.setItem(key, JSON.stringify({ aiPlan: result }));


    if (duplicateFound) {
      alert("Bu planın bazı görevleri zaten takvimde mevcut.");
    }

  } else {
    alert("AI plan oluşturulamadı. Lütfen tekrar deneyin.");
  }

};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-100 to-teal-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl mt-10">
        <h1 className="text-3xl font-bold text-teal-700 text-center mb-2">Görev Planın 🧩</h1>
        <p className="text-center text-gray-600 mb-6">
          AI destekli detaylı plana hoş geldin! Göreve göre sana özel öneriler burada olacak 🎯
        </p>

        <div className="bg-green-50 p-4 rounded-xl shadow mb-6">
          <h3 className="text-xl font-semibold text-teal-800">Görev: {task?.text}</h3>
          <p className="text-sm text-gray-700 mt-2">
            ⏰ Teslim Tarihi: <strong>{task?.deadline}</strong>
          </p>
        </div>

        {/* Kullanıcıdan AI için bilgi alma formu */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <label className="block mb-2 font-medium">📘 Proje Açıklaması:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
            rows={3}
            placeholder="Projen neyle ilgili, neler yapılmalı?"
          />

          <label className="block mb-2 font-medium">📆 Müsait Günlerin:</label>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full border ${availableDays.includes(day) ? "bg-teal-600 text-white" : "bg-white text-gray-700"}`}
              >
                {day}
              </button>
            ))}
          </div>

          <label className="block mb-2 font-medium">⏳ Günlük Ayırabileceğin Saat:</label>
          <input
            type="number"
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
            placeholder="Örn: 2"
            className="w-20 border border-gray-300 rounded p-2"
          />

          <button
            disabled={!(description && dailyHours && availableDays.length > 0)}
            onClick={generateAiPlan}
            className={`mt-4 px-4 py-2 rounded ${description && dailyHours && availableDays.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
          >
            AI Planı Takvime Uygula
          </button>
        </div>

        {/* AI Plan Görünümü */}
        {showPlan && Array.isArray(aiPlan) && aiPlan.length > 0 && (

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md mt-6">
          <h3 className="text-2xl font-bold text-teal-700 mb-4">AI Planı</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-green-100 p-4 rounded-xl shadow mb-6">
                  <th className="border px-2 py-1">Tarih</th>
                  <th className="border px-2 py-1">Görev</th>
                </tr>
              </thead>
              <tbody>
                {aiPlan.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{item.deadline || item.date}</td>
                    <td className="border px-2 py-1">{item.text || item.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
             <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/tasks")}
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Görevler Listesine Dön
        </button>
      </div>
          </div>
        </div>
        )}


      </div>
    </div>
  );
}

export default TaskDetails;
