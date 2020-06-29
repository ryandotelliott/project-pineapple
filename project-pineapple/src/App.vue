<template>
    <div id="app">
        <NavBar
            imagePath="https://pbs.twimg.com/profile_images/74188698/NeilTysonOriginsA-Crop_400x400.jpg"
        />
        <router-view />
    </div>
</template>

<script>
import NavBar from "./components/NavBar";
export default {
    name: "app",
    components: {
        NavBar,
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap");

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
}

a,
a:visited {
    text-decoration: none;
    color: #cdcecd;
}

body {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    line-height: 1.4;
    overflow: hidden;
}

#app {
    width: 1200px;
    height: 750px;
    display: flex;
    flex-direction: row;
    background-color: #fff;
}

button,
a {
    cursor: pointer;
}

input {
    cursor: text;
}

input,
button,
textarea,
:focus {
    outline: none;
    -webkit-app-region: no-drag;
}
</style>
