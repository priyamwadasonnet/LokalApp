import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, removeBookmark } from "../db";
import "../styles/BookMark.css";  // Make sure this CSS file is included

const Bookmarks = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const jobs = await getBookmarks();
      setBookmarkedJobs(jobs);
    };

    fetchBookmarks();
  }, []);

  const handleRemove = async (jobId) => {
    await removeBookmark(jobId);
    setBookmarkedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  if (!bookmarkedJobs.length) {
    return <p className="no-bookmarks">No bookmarks yet.</p>;
  }

  return (
    <div className="bookmarks-container">
      <h2>⭐ Bookmarked Jobs</h2>
      <div className="job-list">
        {bookmarkedJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <p><strong>📍 Location:</strong> {job.primary_details?.Place || "N/A"}</p>
            </div>

            <div className="job-buttons">
              <button onClick={() => handleRemove(job.id)} className="bookmark-btn">
                ❌ Remove
              </button>
              <Link to={`/job/${job.id}`} className="details-btn">
                👁 View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
