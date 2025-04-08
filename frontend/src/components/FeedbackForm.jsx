import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackForm = ({ ticketId }) => {
  const [version, setVersion] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch all feedbacks for this ticket
  const fetchFeedbacks = async () => {
    const res = await axios.get(`${API_URL}/tickets/${ticketId}/feedbacks`);
    setFeedbacks(res.data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Send feedback to backend
  const handleSubmit = async () => {
    if (!version || !feedback) return;

    await axios.post(`${API_URL}/tickets/${ticketId}/feedback`, { version, feedback });
    setVersion("");
    setFeedback("");
    fetchFeedbacks();
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-lg text-indigo-700 mb-2">Feedback</h4>

      {/* Form to submit feedback */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="Version (e.g. v1)"
          className="w-full sm:w-40 p-2 border border-gray-300 rounded text-sm"
        />
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback..."
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Submit
        </button>
      </div>

      {/* Feedback list */}
      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-sm">No feedback yet.</p>
      ) : (
        <div className="space-y-2">
          {feedbacks.map((f, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded text-sm">
              <div className="font-semibold text-indigo-700">{f.version}</div>
              <div className="text-gray-800 mt-1">{f.feedback}</div>
              <div className="text-xs text-gray-500 mt-1">Submitted at {new Date(f.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
