const axios = require("axios");
const twilio = require("twilio");
require("dotenv").config();

const githubUsername = process.env.GITHUB_USERNAME;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const toWhatsapp = process.env.TO_WHATSAPP;
const fromWhatsapp = process.env.FROM_WHATSAPP;

const client = twilio(accountSid, authToken); // Use the correct way to initialize Twilio client

async function checkGitHubCommit() {
  const url = `https://api.github.com/users/${githubUsername}/events`;
  try {
    const response = await axios.get(url);
    console.log("GitHub API Response:", response.data); // Debugging the GitHub response
    const events = response.data;

    const today = new Date().toISOString().split("T")[0];
    const commitFound = events.some(
      (event) =>
        event.type === "PushEvent" && event.created_at.startsWith(today)
    );

    console.log("Commit Found:", commitFound); // Debugging if commit is found

    if (commitFound) {
      sendWhatsAppMessage("✅ আজ আপনি কোড পুশ করেছেন! চালিয়ে যান!");
    } else {
      sendWhatsAppMessage(
        "⚠️ আজ আপনি কোনো কোড পুশ করেননি! দয়া করে GitHub-এ কিছু কোড পুশ করুন!"
      );
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
  }
}

function sendWhatsAppMessage(message) {
  console.log("Sending WhatsApp message:", message); // Debugging the message being sent
  client.messages
    .create({
      from: fromWhatsapp,
      body: message,
      to: toWhatsapp,
    })
    .then((message) => {
      console.log("WhatsApp message sent:", message.sid);
    })
    .catch((error) => {
      console.error("Error sending WhatsApp message:", error);
    });
}

// Run script
checkGitHubCommit();
