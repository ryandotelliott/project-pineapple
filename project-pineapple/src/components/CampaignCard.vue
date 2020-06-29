<template>
    <div class="campaign-card">
        <h2 class="title">Card Name</h2>
        <div class="card-items">
            <p class="card-item">
                Messages Sent
                <span class="card-item-result">{{ sentMessages }}</span>
            </p>
            <p class="card-item">
                Run Time
                <span class="card-item-result">{{ runTime }}</span>
            </p>
            <p class="card-item">
                Progress
                <span class="card-item-result">{{ progress }}</span>
            </p>
            <p class="card-item">
                Status
                <span class="card-item-result">{{ status }}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "CampaignCard",
    props: {
        name: String,
        runTime: Number,
        progress: Number,
        status: String,
    },
};
</script>

<style scoped>
.campaign-card {
    width: 230px;
    height: 230px;
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: #ffffff;
    box-shadow: 0px 0px 50px rgba(28, 28, 28, 0.2);
    border-radius: 10px;
    margin-bottom: 30px;
    position: relative;
    top: 0;
    transition: top ease 0.5s;
}

.campaign-card:hover {
    top: -10px;
}

.campaign-card:not(:nth-child(3n + 3)) {
    margin-right: 30px;
}

.card-items {
    margin-top: 15px;
}

.card-item {
    width: 90%;
    margin-top: 8px;
}
.card-item-result {
    font-weight: bold;
    width: 10px;
    float: right;
}

.title {
    width: 100%;
}
</style>
