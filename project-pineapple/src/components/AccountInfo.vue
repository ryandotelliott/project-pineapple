<template>
	<div class="account-info">
		<img class="account-image" :src="imagePath" />
		<div class="user-info">
			<p class="account-name">{{name}}</p>
			<p class="account-handle">@{{handle}}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "AccountInfo",
	props: {
		imagePath: String,
		name: String,
		handle: String
	}
};
</script>

<style scoped>
.account-info {
	display: flex;
	flex-direction: row;
	height: 50px;
}

.user-info {
	display: flex;
	flex-direction: column;
	margin-left: 10px;
}

.account-image {
	border-radius: 100%;
	width: 48px;
	height: 48px;
}

.account-name {
	font-size: 16px;
	font-weight: bold;
	color: #373737;
}

.account-handle {
	font-size: 12px;
	color: #bfc1c0;
}
</style>