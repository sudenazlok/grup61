import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  const [description, setDescription] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [dailyHours, setDailyHours] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-100 to-teal-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
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
            disabled
            className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
          >
            🚀 AI Planı Takvime Uygula (Yakında)
          </button>
        </div>

        {/* AI Plan Görünümü */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deadlineDiff <= 6 || deadlineDiff > 0 ? (
            <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-md">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Günlük Plan 📅</h3>
              {description && dailyHours ? (
                <p className="text-gray-600 text-sm">
                  🧠 AI: Her gün {dailyHours} saat çalışarak plan yapılacak.
                </p>
              ) : (
                <p className="text-gray-500 text-sm">Bilgileri doldurduğunda plan burada görünecek.</p>
              )}
            </div>
          ) : null}

          {deadlineDiff >= 7 ? (
            <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-md">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Haftalık Plan 📆</h3>
              {availableDays.length > 0 ? (
                <p className="text-gray-600 text-sm">
                  🧠 AI: {availableDays.join(", ")} günlerinde çalışma yapılacak.
                </p>
              ) : (
                <p className="text-gray-500 text-sm">Müsait günleri seç lütfen.</p>
              )}
            </div>
          ) : null}

          {deadlineDiff >= 21 ? (
            <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-md">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Aylık Plan 🗓️</h3>
              <p className="text-gray-500 text-sm">
                Görev süresi uzun olduğu için AI burada haftalık bölünmüş uzun vadeli bir plan sunacak.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 text-sm text-gray-500 text-center">
          Görevin teslim tarihine göre kişiselleştirilmiş bir planlama çok yakında burada!
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
