// demoSeeder.js

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const API_URL = "http://localhost:5000";

const demoTickets = [
  {
    title: "Homepage layout bug",
    description: "Some components are overlapping on mobile.",
    deadline: "2025-05-01",
    memberId: 1,
    image: "sample1.jpg",
    feedbacks: ["Please fix the alignment.", "Typography needs improvement."]
  },
  {
    title: "API integration failure",
    description: "The user data is not saving correctly.",
    deadline: "2025-05-02",
    memberId: 2,
    image: "sample2.jpg",
    feedbacks: ["Check the POST payload.", "Verify the 500 error."]
  },
  {
    title: "Color palette update",
    description: "Update to use new brand colors.",
    deadline: "2025-05-03",
    memberId: 3,
    image: "sample3.jpg",
    feedbacks: ["The blue is too dark.", "Use #3366ff instead."]
  },
];

async function seed() {
  console.log("Seeding demo data...\n");

  for (const ticket of demoTickets) {
    // 1. Create ticket
    const ticketRes = await axios.post(`${API_URL}/tickets`, {
      title: ticket.title,
      description: ticket.description,
      deadline: ticket.deadline,
      memberId: ticket.memberId
    });

    const ticketId = ticketRes.data.id;
    console.log(`✅ Created ticket [${ticket.title}] with ID ${ticketId}`);

    // 2. Upload image
    const form = new FormData();
    form.append("file", fs.createReadStream(path.join(__dirname, "assets", ticket.image)));

    await axios.post(`${API_URL}/tickets/${ticketId}/upload`, form, {
      headers: form.getHeaders()
    });

    console.log(`📷 Uploaded image: ${ticket.image}`);

    // 3. Add feedbacks to version v1
    for (const feedback of ticket.feedbacks) {
      await axios.post(`${API_URL}/tickets/${ticketId}/feedback`, {
        version: "v1",
        feedback
      });
      console.log(`💬 Added feedback: "${feedback}"`);
    }

    console.log("─".repeat(40));
  }

  console.log("\n🎉 Done!");
}

seed().catch(console.error);
