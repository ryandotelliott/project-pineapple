const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const queryString = require("query-string");

const router = express.Router();

const oauth = OAuth({
  consumer: {
    key: process.env.OAUTH_CONSUMER_KEY,
    secret: process.env.OAUTH_CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto
      .createHmac("sha1", key)
      .update(base_string)
      .digest("base64");
  },
});

const instanceSchema = new mongoose.Schema({
  cookie_value: String,
  oauth_token: String,
  oauth_token_secret: String,
});

router.get("/token", async (req, res) => {
  const request_data = {
    url: "https://api.twitter.com/oauth/request_token",
    method: "POST",
    data: {
      oauth_callback: process.env.DOMAIN + "/callback",
    },
  };

  let response;
  try {
    response = await axios({
      method: "POST",
      url: request_data.url,
      data: request_data.data,
      headers: oauth.toHeader(oauth.authorize(request_data)),
    });

    res.send(queryString.parse(response.data));
  } catch (err) {
    console.log(err); // TODO error handling
  }
});

router.get("/callback", async (req, res) => {
  const request_data = {
    url: "https://api.twitter.com/oauth/access_token",
    method: "POST",
    data: {
      oauth_verifier: req.query.oauth_verifier,
    },
  };

  let response;
  try {
    response = await axios({
      method: "POST",
      url: request_data.url,
      data: request_data.data,
      headers: oauth.toHeader(
        oauth.authorize(request_data, req.query.oauth_token)
      ),
    });

    const cookie =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);

    let parsedQuery = queryString.parse(response.data);

    const instance = new instanceSchema({
      cookie_value: cookie,
      oauth_token: parsedQuery.oauth_token,
      oauth_token_secret: parsedQuery.oauth_token_secret,
    });
    await instance.save();

    res
      .cookie("access_token", cookie)
      .redirect(process.env.DOMAIN)
      .send();
  } catch (err) {
    console.log(err); // TODO error handling
  }
});

module.exports = {
  routes: router,
};
