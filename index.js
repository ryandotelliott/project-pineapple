// Setup
const pjson = require("./package.json");
const fs = require("fs");
const c = require("ansi-colors");
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const Twit = require("twit");
const sqlite3 = require("sqlite3").verbose();

async function main() {
  // CLI Splash
  console.log(
    logo({
      name: "Project Pineapple",
      logoColor: "yellow",
    })
      .emptyLine()
      .right(pjson.version)
      .render()
  );

  // File Check / Initial Setup
  let config;
  const path = "./config.json";

  let T; // Twit instance
  let profile; // Authenticated user profile

  let firstRunQuestions = [
    {
      type: "input",
      name: "consumer_key",
      message: "Please enter your consumer key:",
    },
    {
      type: "input",
      name: "consumer_secret",
      message: "Please enter your consumer secret:",
    },
    {
      type: "input",
      name: "access_token",
      message: "Please enter your access token:",
    },
    {
      type: "input",
      name: "access_token_secret",
      message: "Please enter your access token secret:",
    },
  ];

  try {
    if (!fs.existsSync(path)) {
      const answers = await inquirer.prompt(firstRunQuestions);
      T = new Twit({
        consumer_key: answers.consumer_key,
        consumer_secret: answers.consumer_secret,
        access_token: answers.access_token,
        access_token_secret: answers.access_token_secret,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true, // optional - requires SSL certificates to be valid.
      });

      try {
        profile = await authenticate(T);
        console.log(c.green("Successfully authenicated: " + profile.screen_name));

        let configData = JSON.stringify({
          CONSUMER_KEY: answers.consumer_key,
          CONSUMER_SECRET: answers.consumer_secret,
          ACCESS_TOKEN: answers.access_token,
          ACCESS_TOKEN_SECRET: answers.access_token_secret
        });

        try {
          fs.writeFile('./config.json', configData, (err) => {
            if (err) throw err;
            console.log(c.green('Success! Data saved to config file.'))
          })
        } catch (err) {
          console.error(err);
        }

        menu();

      } catch (err) {
        console.log(c.red('Error: Unable to authenticate. Please restart and try again'));
        console.error(err)
        process.exit(1)
      }
    } else {
      let config = require("./config.json");
      T = new Twit({
        consumer_key: process.env.CONSUMER_KEY || config.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET || config.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN || config.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET || config.ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true, // optional - requires SSL certificates to be valid.
      });

      try {
        profile = await authenticate(T);
        console.log(c.green("Successfully authenicated: " + profile.screen_name));

        menu();
      } catch (err) {
        // Unable to authenticate
        console.log(c.red('Error: Unable to authenticate. Please check config.json and try again.'));
        console.error(err)
        process.exit(1)
      }
    }
  }
  catch (err) {
    console.error(err);
    process.exit(1)
  }

}

function authenticate(T) {
  return new Promise((resolve, reject) => T.get(
    "account/verify_credentials",
    (err, data, response) => {
      if (err) reject(err);
      resolve(data);
    }
  ))
}

async function menu() {
  let menuQuestion = [{
    type: 'list',
    name: 'menuSelection',
    message: 'What would you like to do?:',
    choices: ['Sync / Download Followers Database', 'Export Followers to .CSV', 'DM Followers']
  }]
  const menuAnswer = await inquirer.prompt(menuQuestion)
  console.log(menuAnswer);
}

async function syncFollowers() {
  // TODO
}

async function exportToCSV() {
  // TODO
}

async function DMFollowers() {
  // TODO
}

main()

// let db = new sqlite3.Database("db.db");

// T.get(
//   "followers/ids",
//   { screen_name: process.env.USER_SCREENNAME },
//   (err, data, response) => {
//     console.log(data);
//   }
// );

// T.post("direct_messages/events/new", {
//   event: {
//     type: "message_create",
//     message_create: {
//       target: { recipient_id: "1132031758986371077" },
//       message_data: {
//         text: "Hello World!",
//       },
//     },
//   },
// });

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.info("Closing sqlite db");
  db.close();
});
