<template>
    <div class="main-container">
        <SearchBar />

        <h1 class="header-text">Campaigns</h1>
        <div class="campaigns-container">
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
            <CampaignCard />
        </div>
    </div>
</template>

<script>
import SearchBar from "../components/SearchBar";
import CampaignCard from "../components/CampaignCard";

export default {
    name: "Campaigns",
    components: {
        SearchBar,
        CampaignCard,
    },
};
</script>

<style scoped>
.main-container {
    height: 100%;
    width: 960px;
    padding: 25px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
}

.main-container::-webkit-scrollbar {
    display: none;
}

.campaigns-container {
    justify-content: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    height: 80%;
    color: #373737;
}

.header-text {
    color: #373737;
    margin-bottom: 20px;
}
</style>
