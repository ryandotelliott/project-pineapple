import Vue from "vue";
import VueRouter from "vue-router";
import Followerdb from "../views/Followers.vue";
import Campaigns from "../views/Campaigns.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/followers",
        name: "Followers",
        component: Followerdb,
    },
    {
        path: "/campaigns",
        name: "Campaigns",
        component: Campaigns,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
