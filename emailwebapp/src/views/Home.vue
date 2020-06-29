<template>
  <div class="home">
    <div class="title">Hello there!</div>
    <LoginWithTwitter v-if="!cookie" />
    <div class="placeholder" v-else>
      Hello friend, you have succesfully authenticated and your cookie is:
      {{ cookie }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginWithTwitter from "@/components/LoginWithTwitter.vue";

export default {
  name: "Home",
  data() {
    return {
      cookie,
    };
  },
  components: {
    LoginWithTwitter,
  },
  created() {
    this.cookie = $cookies.get("access_token");
  },
};
</script>
