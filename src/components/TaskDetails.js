import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  const [description, setDescription] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [dailyHours, setDailyHours] = useState("");
  const [aiPlan, setAiPlan] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

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

  // Basit AI plan algoritması
  const generatePlan = () => {
    if (!description || !dailyHours || availableDays.length === 0) return;
    const plan = [];
    const start = new Date();
    const end = new Date(task.deadline);
    let current = new Date(start);
    let totalDays = 0;
    let planDays = [];
    // Haftanın günleri eşlemesi
    const dayMap = {
      'Pzt': 1,
      'Sal': 2,
      'Çar': 3,
      'Per': 4,
      'Cum': 5,
      'Cmt': 6,
      'Paz': 0
    };
    // Tüm günler arasında, seçili günlerde olanları bul
    while (current <= end) {
      if (availableDays.includes(Object.keys(dayMap).find(key => dayMap[key] === current.getDay()))) {
        planDays.push(new Date(current));
        totalDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    // Her güne eşit iş dağıtımı
    const totalHours = totalDays * Number(dailyHours);
    planDays.forEach((date, idx) => {
      plan.push({
        date: date.toLocaleDateString('tr-TR'),
        hours: dailyHours,
        note: idx === 0 ? 'Başlangıç!' : idx === planDays.length - 1 ? 'Teslim öncesi son gün!' : ''
      });
    });
    setAiPlan({
      description,
      totalDays,
      totalHours,
      plan
    });
    setShowPlan(true);
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
            onClick={generatePlan}
            className={`mt-4 px-4 py-2 rounded ${description && dailyHours && availableDays.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
          >
            🚀 AI Planı Takvime Uygula
          </button>
        </div>

        {/* AI Plan Görünümü */}
        {showPlan && aiPlan && (
          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md mt-6">
            <h3 className="text-2xl font-bold text-teal-700 mb-4">AI Planı</h3>
            <p className="mb-2 text-gray-700">Proje Açıklaması: <span className="font-medium">{aiPlan.description}</span></p>
            <p className="mb-2 text-gray-700">Toplam Çalışma Günü: <span className="font-medium">{aiPlan.totalDays}</span></p>
            <p className="mb-4 text-gray-700">Toplam Çalışma Saati: <span className="font-medium">{aiPlan.totalHours}</span></p>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-teal-100">
                    <th className="border px-2 py-1">Tarih</th>
                    <th className="border px-2 py-1">Saat</th>
                    <th className="border px-2 py-1">Not</th>
                  </tr>
                </thead>
                <tbody>
                  {aiPlan.plan.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.date}</td>
                      <td className="border px-2 py-1">{item.hours}</td>
                      <td className="border px-2 py-1">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500 text-center">
          Görevin teslim tarihine göre kişiselleştirilmiş bir planlama çok yakında burada!
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
