<script lang="ts">
	import "../app.css";
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<nav>
	<div class="nav-container">
		<a href="/" class="nav-item" class:active={$page.url.pathname === '/'}>Home</a>
		<a href="/ucs" class="nav-item" class:active={$page.url.pathname === '/ucs'}>UCS Demo</a>
		<a href="/bfs" class="nav-item" class:active={$page.url.pathname === '/bfs'}>BFS Demo</a>
		<a href="/dfs" class="nav-item" class:active={$page.url.pathname === '/dfs'}>DFS Demo</a>
		<a href="/bi-s" class="nav-item" class:active={$page.url.pathname === '/bi-s'}>Bidirectional Demo</a>
		<a href="/dls" class="nav-item" class:active={$page.url.pathname === '/dls'}>DLS Demo</a>
		<a href="/iddfs" class="nav-item" class:active={$page.url.pathname === '/iddfs'}>IDDFS Demo</a>
	</div>
</nav>

{@render children()}

<style>
	nav {
		background-color: #333;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 1rem;
	}

	.nav-item {
		color: #fff;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.nav-item:hover {
		background-color: #444;
	}

	.active {
		background-color: #4CAF50;
	}
</style>
