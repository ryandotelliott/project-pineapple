// Setup
const pjson = require("./package.json");
const fs = require("fs");
const c = require("ansi-colors");
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const Twit = require("twit");
const sqlite3 = require("sqlite3").verbose();
const ProgressBar = require("progress");
const Handlebars = require("handlebars");
const { template } = require("handlebars");

// File Check / Initial Setup
let config;
const path = "./config.json";

let T; // Twit instance
let profile; // Authenticated user profile
let followers;

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

  let db;

  let advancedSetup = [
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
      const answers = await inquirer.prompt(advancedSetup);
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
        console.log(
          c.green("Successfully authenicated: " + profile.screen_name)
        );

        let configData = JSON.stringify({
          CONSUMER_KEY: answers.consumer_key,
          CONSUMER_SECRET: answers.consumer_secret,
          ACCESS_TOKEN: answers.access_token,
          ACCESS_TOKEN_SECRET: answers.access_token_secret,
          last_updated: Date.now(),
        });

        try {
          fs.writeFile("./config.json", configData, (err) => {
            if (err) {
              throw err;
            }
          });
          console.log(c.green("Data saved to config.json successfully."));
        } catch (err) {
          console.error(err);
        }

        try {
          await loadDB();
        } catch (err) {
          console.log(
            c.red(
              "Unable to open SQLite database. Please restart and try again."
            )
          );
          process.exit(1);
        }
        do {
          await menu();
        } while (true);
      } catch (err) {
        console.log(
          c.red("Error: Unable to authenticate. Please restart and try again")
        );
        console.error(err);
        process.exit(1);
      }
    } else {
      let config = require("./config.json");
      T = new Twit({
        consumer_key: process.env.CONSUMER_KEY || config.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET || config.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN || config.ACCESS_TOKEN,
        access_token_secret:
          process.env.ACCESS_TOKEN_SECRET || config.ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true, // optional - requires SSL certificates to be valid.
      });

      try {
        profile = await authenticate(T);
        console.log(
          c.greenBright("Successfully authenticated: " + profile.screen_name)
        );

        try {
          await loadDB();
        } catch (err) {
          console.log(
            c.red(
              "Unable to open SQLite database. Please restart and try again."
            )
          );
          process.exit(1);
        }

        followers = await getDownloadedFollowers();

        console.log(
          c.green(
            followers.length +
              " / " +
              profile.followers_count +
              " total followers downloaded."
          )
        );

        let date = new Date(parseInt(config.last_updated));
        console.log(c.yellow("Last synced: " + date.toString() + "\n"));

        do {
          await menu();
        } while (true);
      } catch (err) {
        // Unable to authenticate
        console.log(
          c.red(
            "Error: Unable to authenticate. Please check config.json and try again."
          )
        );
        console.error(err);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function authenticate(T) {
  return new Promise((resolve, reject) =>
    T.get("account/verify_credentials", (err, data, response) => {
      if (err) reject(err);
      resolve(data);
    })
  );
}

async function loadDB() {
  const dbPath = "followers.db";
  if (fs.existsSync(dbPath)) {
    console.log(c.green("Followers database found. Loading"));
    const db = new sqlite3.Database(dbPath);
    const rows = await new Promise((resolve) =>
      db.all("SELECT * FROM followers", (err, rows) => resolve(rows))
    );
    db.close();
    return db;
  }
  console.log(c.yellow("Followers database not found. Creating..."));
  const db = new sqlite3.Database(dbPath);
  db.run(
    'CREATE TABLE "followers" (' +
      '"PK"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
      '"id"	INTEGER,' +
      '"screen_name"	TEXT,' +
      '"location"	TEXT,' +
      '"bio"	TEXT,' +
      '"followers"	INTEGER,' +
      '"friends"	INTEGER,' +
      '"verified"	TEXT,' +
      '"following"	TEXT,' +
      '"profile_image_url"	TEXT' +
      ")"
  );
  db.close();
  console.log(c.green("Followers database created successfully.\n"));
  return db;
}

async function getDownloadedFollowers() {
  const dbPath = "followers.db";
  const db = new sqlite3.Database(dbPath);
  const rows = await new Promise((resolve) =>
    db.all("SELECT * FROM followers;", (err, rows) => resolve(rows))
  );
  db.close();
  return rows;
}

async function menu() {
  let menuQuestion = [
    {
      type: "list",
      name: "menuSelection",
      message: "What would you like to do?:",
      choices: [
        "Sync / Download Followers Database",
        "Export Followers to .CSV",
        "DM Followers",
        "Reset",
        "Exit",
      ],
    },
  ];
  return new Promise(async (resolve, reject) => {
    const menuAnswer = await inquirer.prompt(menuQuestion);
    if (menuAnswer.menuSelection == "Export Followers to .CSV") {
      await exportToCSV();
      resolve();
    } else if (
      menuAnswer.menuSelection == "Sync / Download Followers Database"
    ) {
      await syncFollowers();
      resolve();
    } else if (menuAnswer.menuSelection == "DM Followers") {
      await DMFollowers();
      resolve();
    } else if (menuAnswer.menuSelection == "Reset") {
      const confirmQuestion = [
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure?: ",
        },
      ];

      const inquirerRes = await inquirer.prompt(confirmQuestion);
      if (inquirerRes.confirm) {
        fs.unlink("./config.json", (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        fs.unlink("./followers.db", (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        console.log(
          c.red("config.json & followers.db successfully deleted.\n")
        );
        console.log("Please restart the application to continue further use.");
        process.exit(0);
      } else {
        console.log(c.yellow("Reset cancelled.\n"));
      }
      resolve();
    } else if (menuAnswer.menuSelection == "Exit") {
      process.exit();
    }
  });
}

async function syncFollowers() {
  const dbPath = "followers.db";
  const db = new sqlite3.Database(dbPath);
  await db.exec("DELETE FROM followers;");

  let bar = new ProgressBar(c.magentaBright("Syncing [:bar] :percent :etas"), {
    total: profile.followers_count,
    complete: "=",
    incomplete: " ",
    width: 50,
  });

  let cursor = -1;
  let response;
  do {
    response = await new Promise((resolve, reject) =>
      T.get("followers/ids", { cursor: cursor }, (err, data, response) => {
        if (err) reject(err);
        resolve(data);
      })
    );

    if (response.next_cursor != "0") {
      cursor = response.next_cursor;
    }

    let counter = 0;
    let idList = "";
    let idLookupResponse;

    for (id of response["ids"]) {
      idList += id + ",";
      counter += 1;
      bar.tick();
      if (counter == 100 || counter >= response["ids"].length) {
        counter = 0;
        idList = idList.substring(0, idList.length - 1);
        idLookupResponse = await new Promise((resolve, reject) => {
          T.post(
            "users/lookup",
            {
              user_id: idList,
            },
            (err, data, response) => {
              if (err) reject(err);
              resolve(data);
            }
          );
        });
        idList = [];

        try {
          db.exec("BEGIN TRANSACTION;");
          for (user of idLookupResponse) {
            try {
              let location = user.location ? user.location : "NULL";
              let description = user.description ? user.description : "NULL";

              db.run(
                "INSERT INTO followers (id, screen_name, location, bio, followers, friends, verified, following, profile_image_url) VALUES (" +
                  user.id +
                  ", " +
                  '"' +
                  user.screen_name +
                  '"' +
                  ", " +
                  '"' +
                  location +
                  '"' +
                  ", " +
                  '"' +
                  description +
                  '"' +
                  ", " +
                  user.followers_count +
                  ", " +
                  user.friends_count +
                  ", " +
                  '"' +
                  user.verified +
                  '"' +
                  ", " +
                  '"' +
                  user.following +
                  '"' +
                  ", " +
                  '"' +
                  user.profile_image_url +
                  '"' +
                  ");"
              );
            } catch (err) {
              console.log(err);
            }
          }
          db.run("COMMIT;");
        } catch (err) {
          console.log(err);
        }
      }
    }
  } while (response.next_cursor != 0);

  let configJson = await new Promise((resolve, reject) => {
    fs.readFile("./config.json", (err, jsonString) => {
      if (err) {
        reject(err);
      }
      let jsonObj = JSON.parse(jsonString);
      resolve(jsonObj);
    });
  });

  configJson["last_updated"] = Date.now();

  try {
    fs.writeFile("./config.json", JSON.stringify(configJson), (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.error(err);
  }
  console.log(c.greenBright("Followers synced successfully"));

  followers = await getDownloadedFollowers();

  console.log(
    c.green(
      followers.length +
        " / " +
        profile.followers_count +
        " total followers downloaded." +
        "\n"
    )
  );
}

async function exportToCSV() {
  let csvOptions = [
    {
      type: "checkbox",
      name: "columns",
      message: "Exported Columns",
      choices: [
        {
          name: "id",
        },
        {
          name: "screen_name",
        },
        {
          name: "location",
        },
        {
          name: "bio",
        },
        {
          name: "followers",
        },
        {
          name: "friends",
        },
        {
          name: "verified",
        },
        {
          name: "following",
        },
      ],
    },
  ];

  return new Promise(async (resolve, reject) => {
    try {
      const columnsToExport = await inquirer.prompt(csvOptions);
      let sqlColumns = "";
      if (columnsToExport.columns.length > 0) {
        for (i in columnsToExport.columns) {
          sqlColumns += columnsToExport.columns[i] + ", ";
        }
        sqlColumns = sqlColumns.substring(0, sqlColumns.length - 2);
      } else {
        console.log(c.yellow("Export cancelled." + "\n"));
        resolve();
        return;
      }

      let writeStream;
      try {
        writeStream = fs.createWriteStream("./followers.csv");
      } catch (err) {
        reject(err);
      }

      const dbPath = "followers.db";
      const db = new sqlite3.Database(dbPath);
      const rows = await new Promise((resolve) =>
        db.all("SELECT " + sqlColumns + " FROM followers;", (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        })
      );
      for (row of rows) {
        let csvLine = "";
        for (key in row) {
          csvLine += row[key] + ",";
        }
        csvLine += "\n";
        writeStream.write(csvLine);
      }
      writeStream.end();
      console.log(
        c.greenBright("Followers exported to .csv successfully" + "\n")
      );
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

async function DMFollowers() {
  // TODO
  // compose message
  // select who to send it to
  // send and add nice little progress bar (only 1000 DMs sent a day)

  let sortingQuestion = [
    {
      type: "list",
      name: "sortingOption",
      message: "Would you like to message all followers or a subset?: ",
      choices: ["All Followers", "Subset", "Cancel"],
    },
  ];

  const sortOption = await inquirer.prompt(sortingQuestion);

  let selectedFollowers;

  if (sortOption.sortingOption == "All Followers") {
    let availableColumns = [
      { name: "id" },
      { name: "screen_name" },
      { name: "location" },
      { name: "bio" },
      { name: "followers" },
      { name: "friends" },
      { name: "verified" },
      { name: "following" },
      { name: "None / Continue" },
    ];

    let rankedColumns = [];

    let sortingSelection = [
      {
        type: "list",
        name: "list",
        message: "Which column would you like to sort by first?: ",
        choices: availableColumns,
      },
    ];
    const firstColumn = await inquirer.prompt(sortingSelection);

    if (firstColumn.list != "None / Continue") {
      availableColumns.splice(
        availableColumns.findIndex((item) => item.name == firstColumn.list),
        1
      );
      rankedColumns.push(firstColumn.list);

      let sortingSelection = [
        {
          type: "list",
          name: "list",
          message: "Which column would you like to sort by next?: ",
          choices: availableColumns,
        },
      ];

      let additionalColumns;
      while (true) {
        additionalColumns = await inquirer.prompt(sortingSelection);
        if (additionalColumns.list == "None / Continue") {
          break;
        }
        availableColumns.splice(
          availableColumns.findIndex(
            (item) => item.name == additionalColumns.list
          ),
          1
        );
        rankedColumns.push(firstColumn.list);
      }

      let SQLColumnsString = "";
      for (i in rankedColumns) {
        if (rankedColumns[i] == "None / Continue") {
          continue;
        }
        SQLColumnsString += rankedColumns[i] + ", ";
      }
      SQLColumnsString = SQLColumnsString.substring(
        0,
        SQLColumnsString.length - 2
      );

      const dbPath = "followers.db";
      const db = new sqlite3.Database(dbPath);
      try {
        const rows = await new Promise((resolve, reject) =>
          db.all(
            SQLColumnsString.length > 0
              ? "SELECT * FROM followers ORDER BY " + SQLColumnsString + ";"
              : "SELECT * FROM followers;",
            (err, rows) => {
              if (err) {
                reject(err);
              }
              resolve(rows);
            }
          )
        );

        selectedFollowers = rows;
      } catch (err) {
        console.log(err);
      }
    }
  } else if (sortOption.sortingOption == "Subset") {
  } else if (sortOption.sortingOption == "Cancel") {
    console.log(c.yellow("DM followers cancelled.\n"));
    resolve();
    return;
  }

  let selectEditor = [
    {
      type: "list",
      name: "prefEditor",
      message: "How would you like to compose your message?:",
      choices: ["Command Line", "JSON import", "Default Text Editor", "Cancel"],
    },
  ];

  const preferedEditor = await inquirer.prompt(selectEditor);

  let message;

  if (preferedEditor.prefEditor == "Command Line") {
    let messageInput = [
      {
        type: "input",
        name: "message",
        message: "Please input your desired message:",
      },
    ];

    const messageAnswer = await inquirer.prompt(messageInput);
    message = messageAnswer.message;
  } else if (preferedEditor.prefEditor == "JSON import") {
    // TODO: Add json import
    message =
      "Hello World! Currently testing an automated twitter DM program. Feel free to ignore.";
  } else if (preferedEditor.prefEditor == "Default Text Editor") {
    let composeMessage = [
      {
        type: "editor",
        name: "editor",
        message: "Compose Message",
      },
    ];

    const messageAnswer = await inquirer.prompt(composeMessage);
    message = messageAnswer.editor;
  } else if ("Cancel") {
    console.log(c.yellow("DM followers cancelled.\n"));
    resolve();
    return;
  }

  // TODO: Add handlebars parsing
  // https://www.npmjs.com/package/handlebars
  // Need to fill in handlebarPreviewData with examples

  let handlebarPreviewTemplate = Handlebars.compile(message);
  let handlebarPreviewData = {};
  message = handlebarPreviewTemplate(handlebarPreviewData);

  console.log("\n");
  console.log(c.magenta("Message: ") + message);
  console.log("\n");

  let messageConfirmation = [
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you would like to send this message?:",
    },
  ];

  const confirmationAnswer = await inquirer.prompt(messageConfirmation);
  if (!confirmationAnswer.confirm) {
    console.log(c.yellow("DM followers cancelled.\n"));
    resolve();
    return;
  }

  let bar = new ProgressBar(c.magentaBright("Sending [:bar] :percent :etas"), {
    total: selectedFollowers.length,
    complete: "=",
    incomplete: " ",
    width: 50,
  });

  let success = 0;
  let failed = 0;

  for (i = 0; i < selectedFollowers.length; i++) {
    try {
      // TODO: fetch data from selectedFollower[i] and add it to handlebar data. This is the example given from"
      // https://www.npmjs.com/package/handlebars
      // var data = { "name": "Alan", "hometown": "Somewhere, TX", "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};

      // Question is: Could you just put the entire twitter profile object into the handlebardata, and support every
      // data field?

      let handlebarTemplate = Handlebars.compile(message);
      let handlebarData = {};
      message = handlebarTemplate(handlebarData);

      await new Promise((resolve, reject) => {
        T.post(
          "direct_messages/events/new",
          {
            event: {
              type: "message_create",
              message_create: {
                target: { recipient_id: selectedFollowers[i].id },
                message_data: {
                  text: message,
                },
              },
            },
          },
          (err, data, response) => {
            if (err) {
              failed += 1;
              reject(err);
            }
            success += 1;
            bar.tick();
            resolve(data);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
  console.log("\n");
}

main();

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.info("Closing sqlite db");
  db.close();
});
