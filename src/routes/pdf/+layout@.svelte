<script lang="ts">
	import '../../print.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		max-width: 720px;
		height: 100%;
		background-color: white;
		margin-inline: auto;
		padding: 0.5rem;
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
</style>
