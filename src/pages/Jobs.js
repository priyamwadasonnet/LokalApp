import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
} from "../db.js";
import "../styles/Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://testapi.getlokalapp.com/common/jobs?page=1");
        setJobs(res.data.results || []);
      } catch (err) {
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      const bookmarks = await getBookmarks();
      setBookmarkedIds(bookmarks.map((job) => job.id));
    };

    fetchJobs();
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (job) => {
    const already = await isBookmarked(job.id);
    if (already) {
      await removeBookmark(job.id);
    } else {
      await addBookmark(job);
    }

    const updated = await getBookmarks();
    setBookmarkedIds(updated.map((job) => job.id));
  };

  if (loading) return <p className="loading">🔄 Loading jobs...</p>;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="jobs-container">
      <h2 className="job-heading">💼 Job Listings</h2>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <img
                src={job.company_logo || "https://via.placeholder.com/40"}
                alt={job.title}
                className="company-logo"
              />
              <div>
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">
                {job.primary_details?.Place || "N/A"}
                </p>
              </div>
            </div>

            <div className="job-meta">
              <p>📍 <strong>Location:</strong> {job.primary_details?.Place || "N/A"}</p>
              <p>💰 <strong>Salary:</strong> {job.primary_details?.Salary || "Not Disclosed"}</p>
              <p>🛠 <strong>Experience:</strong> {job.primary_details?.Experience || "Not Required"}</p>
            </div>

            <div className="job-footer">
              <div className="job-buttons">
                <button
                  onClick={() => toggleBookmark(job)}
                  className={`bookmark-btn ${bookmarkedIds.includes(job.id) ? "bookmarked" : ""}`}
                >
                  {bookmarkedIds.includes(job.id) ? "⭐ Bookmarked" : "☆ Bookmark"}
                </button>
                <Link to={`/job/${job.id}`} className="details-btn">
                  👁 Details
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
