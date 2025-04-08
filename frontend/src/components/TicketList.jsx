import React from "react";
import axios from "axios";
import FileUploader from "./FileUploader";

const API_URL = import.meta.env.VITE_API_URL;

const TicketList = ({ tickets, onTicketClosed, onTicketDeleted }) => {
  const handleClose = async (id) => {
    await axios.patch(`${API_URL}/tickets/${id}/close`);
    onTicketClosed(id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/tickets/${id}`);
    onTicketDeleted(id);
  };

  if (tickets.length === 0) {
    return <p className="text-gray-600 text-center">No tickets yet.</p>;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="bg-white shadow-md rounded p-4 border-l-4 border-indigo-500"
        >
          <h3 className="text-lg font-semibold text-indigo-700">{ticket.title}</h3>
          <p className="text-gray-700">{ticket.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Deadline: {ticket.deadline} <br />
            Assigned to:{" "}
            <span className="font-medium text-black">
              {ticket.assignedTo?.name || "Unassigned"}
            </span>{" "}
            <br />
            Status:{" "}
            <span className="uppercase font-semibold">{ticket.status}</span>
          </div>

          <div className="mt-4 flex gap-2">
            {ticket.status !== "closed" && (
              <button
                onClick={() => handleClose(ticket.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                Close
              </button>
            )}
            <button
              onClick={() => handleDelete(ticket.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>

          <FileUploader ticketId={ticket.id} />
        </div>
      ))}
    </div>
  );
};

export default TicketList;
