const axios = require("axios");
const { Client } = require("twilio");
require("dotenv").config();

const githubUsername = process.env.USERNAME;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const toWhatsapp = process.env.TO_WHATSAPP;
const fromWhatsapp = process.env.FROM_WHATSAPP;

const client = new Client(accountSid, authToken);

async function checkGitHubCommit() {
  const url = `https://api.github.com/users/${githubUsername}/events`;
  try {
    const response = await axios.get(url);
    const events = response.data;

    const today = new Date().toISOString().split("T")[0];
    const commitFound = events.some((event) =>
      event.created_at.startsWith(today)
    );

    if (!commitFound) {
      sendWhatsAppMessage();
    } else {
      console.log("Commit found for today. No message sent.");
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
  }
}

function sendWhatsAppMessage() {
  client.messages
    .create({
      from: fromWhatsapp,
      body: "আজকে আপনি কোনো কোড পুশ করেননি! দয়া করে GitHub-এ কিছু কোড পুশ করুন!",
      to: toWhatsapp,
    })
    .then((message) => {
      console.log("WhatsApp message sent:", message.sid);
    })
    .catch((error) => {
      console.error("Error sending WhatsApp message:", error);
    });
}

// স্ক্রিপ্ট রান
checkGitHubCommit();
