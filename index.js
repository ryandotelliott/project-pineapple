#!/usr/bin/env node

// Setup
const Twit = require("twit");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

let db = new sqlite3.Database("db.db");

let T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

T.get("followers/ids", { screen_name: "balajis" }, (err, data, response) => {
  console.log(data);
});

T.post("direct_messages/events/new", {
  event: {
    type: "message_create",
    message_create: {
      target: { recipient_id: "1132031758986371077" },
      message_data: {
        text: "Hello World!",
      },
    },
  },
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.info("Closing sqlite db");
  db.close();
});
