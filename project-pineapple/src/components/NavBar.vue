<template>
    <div class="nav-container">
        <AccountInfo :imagePath="imagePath" name="Ryan E" handle="DeveloperRyanE" />
        <ProgressBar :sentMessages="0" />
        <PageLink route="/" name="Dashboard" />
        <PageLink route="/followers" name="Follower Database" />
        <PageLink route="/campaigns" name="Campaigns" />
    </div>
</template>

<script>
import AccountInfo from "./AccountInfo";
import PageLink from "./PageLink";
import ProgressBar from "./ProgressBar";

export default {
    name: "NavBar",
    components: {
        PageLink,
        AccountInfo,
        ProgressBar,
    },
    props: {
        imagePath: String,
    },
};
</script>

<style scoped>
.nav-container {
    width: 240px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 25px;
    border-right: 1px solid #cdcecd;
    background-color: white;
}
</style>
