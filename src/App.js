import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Jobs from "./pages/Jobs";
import Bookmarks from "./pages/Bookmarks";
import JobDetail from "./pages/JobDetail";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Router>
      <div className="app-container">
        {/* 🔄 Fancy Toggle Switch */}
        <div className="theme-switch-wrapper">
          <label className="theme-switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
            <span className="slider round"></span>
          </label>
          <em>{theme === "dark" ? "Dark Mode" : "Light Mode"}</em>
        </div>

        <nav className="bottom-nav">
          <Link to="/">Jobs</Link>
          <Link to="/bookmarks">Bookmarks</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/job/:id" element={<JobDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
