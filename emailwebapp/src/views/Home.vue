<template>
  <div class="home">
    <div class="title">Hello there!</div>
    <LoginWithTwitter />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginWithTwitter from "@/components/LoginWithTwitter.vue";

export default {
  name: "Home",
  components: {
    LoginWithTwitter,
  },
};
</script>
