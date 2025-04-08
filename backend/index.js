const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const uploadDir = path.join(__dirname, "uploads");
fs.ensureDirSync(uploadDir);

const feedbackDir = path.join(__dirname, "feedbacks");
fs.ensureDirSync(feedbackDir);

// ========== CONFIGURAÇÃO MULTER COM VERSIONAMENTO ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ticketId = req.params.id;
    const ticketFolder = path.join(uploadDir, ticketId);
    fs.ensureDirSync(ticketFolder);

    const versions = fs.readdirSync(ticketFolder).length + 1;
    const versionFolder = path.join(ticketFolder, `v${versions}`);
    fs.ensureDirSync(versionFolder);

    cb(null, versionFolder);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// ========== DADOS ==========
const members = [
  { id: 1, name: "Alice", skills: ["frontend", "ui"] },
  { id: 2, name: "Bob", skills: ["backend", "api"] },
  { id: 3, name: "Charlie", skills: ["database", "backend"] },
];

let tickets = [];

function assignMember(skill) {
  const filtered = members.filter((m) => m.skills.includes(skill));
  return filtered[Math.floor(Math.random() * filtered.length)] || null;
}

// ========== ROTAS PRINCIPAIS ==========
app.post("/tickets", (req, res) => {
  const { title, description, deadline, memberId } = req.body;

  let assignedTo = null;
  if (memberId) {
    assignedTo = members.find((m) => m.id === parseInt(memberId));
  } else {
    const skill = title.toLowerCase().includes("api") ? "backend" : "frontend";
    assignedTo = assignMember(skill);
  }

  const newTicket = {
    id: tickets.length + 1,
    title,
    description,
    deadline,
    assignedTo,
    status: "open",
  };

  tickets.push(newTicket);
  res.json(newTicket);
});

app.get("/tickets", (req, res) => {
  res.json(tickets);
});

app.get("/members", (req, res) => {
  res.json(members);
});

app.patch("/tickets/:id/close", (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  ticket.status = "closed";
  res.json(ticket);
});

app.delete("/tickets/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  // Delete ticket files (if any)
  const ticketFolder = path.join(__dirname, "uploads", String(id));
  if (fs.existsSync(ticketFolder)) {
    fs.removeSync(ticketFolder); // Recursively delete ticket upload folder
  }

  const deleted = tickets.splice(index, 1);
  res.json(deleted[0]);
});

app.post("/tickets/:id/upload", upload.single("file"), (req, res) => {
  res.json({ message: "Upload successful", file: req.file });
});

app.get("/tickets/:id/files", (req, res) => {
  const ticketFolder = path.join(uploadDir, req.params.id);
  if (!fs.existsSync(ticketFolder)) return res.json([]);

  const versions = fs.readdirSync(ticketFolder).map((v) => ({
    version: v,
    files: fs.readdirSync(path.join(ticketFolder, v)),
  }));

  res.json(versions);
});

// Save feedback for a specific ticket and version
app.post("/tickets/:id/feedback", (req, res) => {
  const ticketId = req.params.id;
  const { version, feedback } = req.body;

  if (!version || !feedback) {
    return res.status(400).json({ error: "Version and feedback are required." });
  }

  const filePath = path.join(__dirname, "feedbacks", `${ticketId}_${version}.json`);

  let existingFeedbacks = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readJsonSync(filePath);
    existingFeedbacks = content.feedbacks || [];
  }

  existingFeedbacks.push({
    text: feedback,
    createdAt: new Date().toISOString(),
  });

  fs.writeJsonSync(filePath, {
    ticketId,
    version,
    feedbacks: existingFeedbacks,
  });

  res.json({ message: "Feedback added successfully." });
});


// List all feedbacks for a specific ticket
app.get("/tickets/:id/feedbacks", (req, res) => {
  const ticketId = req.params.id;
  const files = fs.readdirSync(path.join(__dirname, "feedbacks")).filter((f) =>
    f.startsWith(`${ticketId}_`)
  );

  const feedbacks = files.map((file) => {
    const content = fs.readJsonSync(path.join(__dirname, "feedbacks", file));
    return {
      version: content.version,
      feedbacks: content.feedbacks || [],
    };
  });

  res.json(feedbacks);
});


// Delete a specific version and its feedback
app.delete("/tickets/:id/version/:version", (req, res) => {
  const { id, version } = req.params;

  const versionFolder = path.join(__dirname, "uploads", id, version);
  const feedbackFile = path.join(__dirname, "feedbacks", `${id}_${version}.json`);

  // Delete version folder
  if (fs.existsSync(versionFolder)) {
    fs.removeSync(versionFolder);
  }

  // Delete feedback file
  if (fs.existsSync(feedbackFile)) {
    fs.removeSync(feedbackFile);
  }

  res.json({ message: "Version and feedback deleted." });
});


app.use("/uploads", express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
