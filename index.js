const axios = require("axios");
const twilio = require("twilio");
require("dotenv").config();

const githubUsername = process.env.GITHUBUSERNAME;
const toWhatsapp = process.env.TO_WHATSAPP;
const fromWhatsapp = process.env.FROM_WHATSAPP;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken); // Use the correct way to initialize Twilio client

async function checkGitHubCommit() {
  const url = `https://api.github.com/users/${githubUsername}/events`;
  try {
    const response = await axios.get(url);

        console.log(githubUsername, accountSid);


    const events = response.data;

    const today = new Date();
    const todayUTC = new Date(
      today.getTime() + today.getTimezoneOffset() * 60000
    );
    const todayString = todayUTC.toISOString().split("T")[0];

    const commitFound = events.some((event) => {
      console.log(event.created_at);
      return (
        event.type === "PushEvent" && event.created_at.startsWith(todayString)
      );
    });

    console.log("Commit Found:", commitFound);

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
