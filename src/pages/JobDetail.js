import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/JobDetail.css";
import { addBookmark, removeBookmark, isBookmarked } from "../db";

const JobDetail = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch("https://testapi.getlokalapp.com/common/jobs?page=1");
        const data = await res.json();

        if (data.results) {
          const foundJob = data.results.find((j) => j.id == jobId);
          setJob(foundJob || null);

          if (foundJob) {
            const exists = await isBookmarked(foundJob.id);
            setBookmarked(!!exists);
          }
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(job.id);
      setBookmarked(false);
    } else {
      await addBookmark(job);
      setBookmarked(true);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job details not found.</p>;

  return (
    <div className="job-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

      <h2>{job.title}</h2>
      <p><strong>Location:</strong> {job.primary_details?.Place || "N/A"}</p>
      <p><strong>Salary:</strong> {job.primary_details?.Salary || "N/A"}</p>
      <p><strong>Experience:</strong> {job.primary_details?.Experience || "N/A"}</p>
      <p><strong>Job Type:</strong> {job.primary_details?.Job_Type || "N/A"}</p>
      <p><strong>Qualification:</strong> {job.primary_details?.Qualification || "N/A"}</p>

      <button onClick={handleBookmark} className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}>
        {bookmarked ? "⭐ Bookmarked" : "☆ Bookmark"}
      </button>
    </div>
  );
};

export default JobDetail;
