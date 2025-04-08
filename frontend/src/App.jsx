import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get(`${API_URL}/tickets`);
    setTickets(res.data);
  };

  const handleNewTicket = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const handleCloseTicket = (id) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: 'closed' } : ticket
      )
    );
  };

  const handleDeleteTicket = (id) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
          🎫 Ticket Assignment System
        </h1>
        <TicketForm onTicketCreated={handleNewTicket} />
        <TicketList
          tickets={tickets}
          onTicketClosed={handleCloseTicket}
          onTicketDeleted={handleDeleteTicket}
        />
      </div>
    </div>
  );
}

export default App;
