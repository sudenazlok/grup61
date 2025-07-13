import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskPage from "./components/TaskPage";
import TaskDetails from "./components/TaskDetails";
import TaskCalendar from './components/TaskCalendar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/calendar" element={<TaskCalendar />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
