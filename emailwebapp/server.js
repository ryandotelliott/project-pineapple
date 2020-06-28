// Setup
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const dotenv = require("dotenv").config();
const port = process.env.PORT;

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const oauth = require("./oauth.js");
app.use("/oauth", oauth.routes);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
