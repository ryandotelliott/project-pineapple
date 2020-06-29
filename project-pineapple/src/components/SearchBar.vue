<template>
	<div class="campaigns-search">
		<input type="text" class="search-bar" placeholder="Search all campaigns" />
		<button class="campaign-modal-button button _bg-dark">Start a Campaign</button>
	</div>
</template>

<script>
export default {
	name: "SearchBar"
};
</script>

<style scoped>
.campaigns-search {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 15px;
}

.search-bar {
	width: 250px;
	border: none;
	border-bottom: 1px solid #cdcecd;
	font-size: 14px;
}

.search-bar::placeholder {
	text-align: right;
	color: #cdcecd;
}

.search-bar:focus::placeholder {
	color: transparent;
}

.start-campaign-button {
	box-sizing: content-box;
	width: 130px;
	padding: 10px;
	background-color: #373737;
	color: #fff;
	outline: none;
	border: none;
	border-radius: 5px;
	font-weight: 600;
	font-size: 14px;
}

.button {
	padding: 0px 20px;
	min-height: 40px;
	border: none;
	color: white;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	border-radius: 5px;
	-webkit-app-region: no-drag;
}

._bg-dark {
	background-color: #373737;
}

._bg-dark:hover {
	background-color: #1f1f1f;
}
</style>