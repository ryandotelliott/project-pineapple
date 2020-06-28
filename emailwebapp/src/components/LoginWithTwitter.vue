<template>
  <div class="LogInWithTwitter">
    <a :href="fullOauthUrl()">Sign in with Twitter</a>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LogInWithTwitter",
  data() {
    return {
      response: "",
      oauthUrl: "https://api.twitter.com/oauth/authorize?oauth_token=",
    };
  },
  async created() {
    this.response = await axios.get("http://192.168.1.2:3000/oauth/token");
    this.response = this.response.data;
  },
  methods: {
    fullOauthUrl() {
      return this.oauthUrl + (this.response ? this.response.oauth_token : "");
    },
  },
};
</script>

<style>
.LogInWithTwitter {
  width: 300px;
  height: 50px;
  background-color: #00acee;
  border-radius: 5px;
}

a {
  width: 100%;
  height: 100%;
}
</style>
