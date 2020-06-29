<template>
	<router-link :to="route" class="nav-item">{{ name }}</router-link>
</template>

<script>
export default {
	name: "PageLink",
	props: {
		route: String,
		name: String
	}
};
</script>

<style scoped>
.nav-item {
	margin-top: 30px;
	padding: 10px;
	width: 90%;
	border-radius: 5px;
	font-size: 14px;
	font-weight: 600;
}

.router-link-exact-active {
	background-color: #ffcc4d;
	color: white;
}

.router-link-exact-active:hover {
	background-color: #ffbf1f;
	color: white;
}

.nav-item:hover:not(.router-link-exact-active) {
	background-color: #f1f1f1;
	cursor: pointer;
}

.nav-item:hover:not(.router-link-exact-active) {
	color: #373737;
}
</style>