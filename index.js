import axios from "axios";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const githubUsername = process.env.gitHubUSERNAME;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const toWhatsapp = process.env.TO_WHATSAPP;
const fromWhatsapp = process.env.FROM_WHATSAPP;

const client = twilio(accountSid, authToken); // Use the correct way to initialize Twilio client

async function checkGitHubCommit() {
  const url = `https://api.github.com/users/${githubUsername}/events`;
  try {
    const response = await axios.get(url);

    const events = response.data;

    const today = new Date().toISOString().split("T")[0];
    const commitFound = events.some(
      (event) =>
        event.type === "PushEvent" && event.created_at.startsWith(today)
    );

    if (commitFound) {
      sendWhatsAppMessage("✅ You have pushed code today! Keep it up!");
    } else {
      sendWhatsAppMessage(
        "⚠️ You haven't pushed any code today! Please push some code to GitHub!"
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
