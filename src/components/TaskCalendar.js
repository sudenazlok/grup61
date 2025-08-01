import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const navigate = useNavigate();

  const formattedDate = selectedDate.toLocaleDateString("en-CA");
  const [aiTasks, setAiTasks] = useState([]);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
    const allTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const uid = auth.currentUser?.uid;

    // completed: true OLANLARI DA DAHİL EDİYORSAN GİZLEMEYİ UNUTMA
    const userTasks = allTasks.filter(task =>
      task.userId === uid && !task.isAi && !task.completed
    );
    const userAiTasks = allTasks.filter(task =>
      task.userId === uid && task.isAi && !task.completed
    );

    setTasks(userTasks);
    setAiTasks(userAiTasks);
  });

  return () => unsubscribe();
}, []);

  // Yaklaşan görevler (3 gün içinde)
  useEffect(() => {
    const today = new Date();
    const inThreeDays = new Date();
    inThreeDays.setDate(today.getDate() + 3);

    const filtered = tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate > today && taskDate <= inThreeDays;
    });

    setUpcomingTasks(filtered);
  }, [tasks]);

  
const filteredTasks = tasks.filter(task => !task.completed && task.deadline === formattedDate);
const filteredAiTasks = aiTasks.filter(task => !task.completed && task.deadline === formattedDate);



  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-100 to-teal-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-2xl">
        {/* Çıkış Butonu */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Başlık */}
        <h1 className="text-3xl font-bold text-teal-700 text-center mb-2">
          📅 Takvim Görünümü
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Görevlerini tarih tarih görüntüle. Teslim zamanı yaklaşanları kaçırma!
        </p>

        {/* Yaklaşan görevler uyarısı */}
        {upcomingTasks.filter(task => !task.isAi).length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md shadow mb-6">
          <h3 className="font-semibold mb-2">⚠️ Yaklaşan Görevler (3 gün içinde):</h3>
          <ul className="list-disc list-inside">
            {upcomingTasks
              .filter(task => !task.isAi)
              .map((task, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-700 hover:underline hover:text-blue-900 transition"
                  onClick={() => navigate(`/task/${task.id}`, { state: { task: { ...task, isAi: true } } })}

                >
                  {task.text?.trim()}
                </li>
              ))}
          </ul>
        </div>
        )}

          {/* Takvim + Görevleri yan yana göster */}
          <div className="flex flex-col md:flex-row gap-6 mt-6">

            {/* Takvim */}
            <div className="md:w-1/2 flex justify-center">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const dateStr = date.toLocaleDateString("en-CA");
                   const hasUserTask = tasks.some(task => !task.completed && task.deadline === dateStr);
                   const hasAiTask = aiTasks.some(task => !task.completed && task.deadline === dateStr);


                    return (
                      <div className="flex justify-center gap-1 mt-1">
                        {hasUserTask && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        {hasAiTask && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                      </div>
                    );
                  }       
                }}
              />
            </div>

            {/* Görevler */}
              <div className="md:w-1/2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center md:text-left">
                📌 {formattedDate} tarihli görevler:
              </h3>

              {filteredTasks.length === 0 && filteredAiTasks.length === 0 ? (
                <p className="text-gray-500 text-center md:text-left">Bu gün için görev yok.</p>
              ) : (
                <>
                  {/* Normal görevler (isteğe bağlı sade tutabilirsiniz) */}
                  {filteredTasks.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {filteredTasks.map((task, index) => (
                        <li
                          key={index}
                          className="cursor-pointer bg-blue-100 text-blue-800 p-3 rounded-lg shadow hover:bg-blue-200 transition"
                          onClick={() => navigate(`/task/${task.id}`, { state: { task: { ...task, isAi: true } } })}

                        >
                          📝 {task.text?.trim()}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* AI görevleri kart şeklinde */}
                  {filteredAiTasks.length > 0 && (
                    <div className="space-y-3">
                      {filteredAiTasks.map((task, index) => (
                        <div
                          key={index}
                          className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-xl shadow transition hover:bg-purple-200 cursor-pointer"
                          onClick={() => navigate(`/task/${task.id}`, { state: { task: { ...task, isAi: true } } })}

                        >
                          <div className="text-purple-900 font-semibold mb-1"> Günlük Görevin </div>
                          <div className="text-purple-900 whitespace-pre-line">{task.text?.trim()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>


          </div>

        {/* Sayfaya dönüş butonu */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/tasks")}
            className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
          >
             Görevler Listesine Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
