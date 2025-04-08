# 🦌 Ticketing System – DeerDesigner Technical Challenge

This project is a full-stack **Ticket Management System** developed as part of a technical test for **DeerDesigner**.

It features **image file uploads with versioning**, **version-specific feedback annotations**, and **team member assignment**, all presented through a clean and responsive user interface.

---

## ✅ Features

### 🎫 Ticket Management
- Create new tickets with title, description, deadline, and assignee
- Auto-assign fallback logic based on ticket keywords (e.g., "api" → backend)
- Close or delete tickets with real-time UI updates

### 🖼 File Storage with Versioning
- Secure upload of image files per ticket
- Each upload is versioned (e.g. `v1`, `v2`, ...)
- Designers can download files by version
- Deleting a version removes both the files and associated feedback

### 💬 Feedback System
- Feedback is added **per version** (e.g. "please adjust colors in v2")
- Users select an existing version from a dropdown
- Multiple feedback entries are supported per version
- Feedbacks are timestamped and displayed inline under each version

---

## 📁 Project Structure

```
ticket-system/
├── backend/         ← Node.js (Express) server with file and feedback APIs
├── src/             ← React frontend (Vite)
└── public/uploads/  ← Image file storage per ticket/version
```

---

## 💻 Tech Stack

- **Frontend**: React + Vite + Axios + TailwindCSS
- **Backend**: Node.js + Express + Multer + fs-extra
- **File Storage**: Local with version folder structure
- **Data Persistence**: In-memory for tickets; filesystem for files and feedbacks

---

## 🚀 How to Run Locally

### 1. Backend

```bash
cd backend
npm install
node index.js
```

Runs at: `http://localhost:5000`

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

> Create a `.env` file in `frontend/` with:

```
VITE_API_URL=http://localhost:5000
```

---

## 📦 Submission Notes

This project was created as a simulation of a real-world design review process. I focused on:

- Clear structure and modular React components
- Real file upload versioning logic using folder structure
- Flexible feedback model with proper mapping per version
- Professional design using Tailwind for clean UX

---

## 👨‍💻 Author

**Daniel Neto**  
Master in Computer Sciences  
Specialist in Web Systems  
PHP ZEND Certified Engineer  
MCP 70-480 Certified  

[GitHub Profile](https://github.com/DanielnetoDotCom)
```