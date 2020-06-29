<template>
	<div class="message-info">
		<div class="message-limit-bar">
			<div class="message-limit-progress" :style="{ width: messageWidth }"></div>
		</div>
		<p class="message-limit-text">Daily Messages: {{sentMessages}}/1000</p>
	</div>
</template>

<script>
export default {
	name: "ProgressBar",
	props: {
		sentMessages: Number
	},
	computed: {
		messageWidth() {
			return this.sentMessages / 10 + "%";
		}
	}
};
</script>

<style scoped>
.message-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 90%;
}

.message-limit-bar {
	margin-top: 10px;
	background-color: #f1f1f1;
	border-radius: 8px;
	height: 15px;
	width: 100%;
}

.message-limit-progress {
	height: 100%;
	display: block;
	background: linear-gradient(90deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%);
	border-radius: 8px;
}

.message-limit-text {
	color: #cdcecd;
	font-size: 11px;
}
</style>