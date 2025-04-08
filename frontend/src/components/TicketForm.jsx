import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const TicketForm = ({ onTicketCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    memberId: "",
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/members`).then((res) => {
      setMembers(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_URL}/tickets`, form);
    onTicketCreated(res.data);
    setForm({ title: "", description: "", deadline: "", memberId: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 mb-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          placeholder="Bug in login..."
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-2.5 border border-gray-300 rounded-md resize-none"
          placeholder="Describe the issue..."
          required
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign to
        </label>
        <select
          name="memberId"
          value={form.memberId}
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select team member...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.skills.join(", ")})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md"
      >
        Create Ticket
      </button>
    </form>
  );
};

export default TicketForm;
