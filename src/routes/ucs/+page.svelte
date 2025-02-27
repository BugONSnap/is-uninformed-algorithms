<script lang="ts">
    import { ucs } from '$lib/uninformedAlgorithms';

    // Sample weighted graph
    let graph: Record<string, [string, number][]> = {
        'A': [['B', 4], ['C', 2]],
        'B': [['D', 3], ['E', 1]],
        'C': [['F', 5], ['G', 4]],
        'D': [['H', 2]],
        'E': [['H', 6]],
        'F': [['H', 3]],
        'G': [['H', 4]],
        'H': []
    };

    let startNode = 'A';
    let goalNode = 'H';
    let path: string[] | null = null;
    let error = '';

    function findPath() {
        try {
            path = ucs(graph, startNode, goalNode);
            error = path ? '' : 'No path found!';
        } catch (e) {
            error = 'Error finding path';
            console.error(e);
        }
    }
    function resetSearch() {
        path = null;
    }
</script>

<div class="container">
    <button on:click={resetSearch} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-500-600">Reset</button>
    <h1>Uniform Cost Search (UCS)</h1>
    
    <div class="description">
        <p>
            UCS is a graph search algorithm that finds the shortest path between nodes in a weighted graph.
            It expands the node with the lowest path cost first.
        </p>
    </div>

    <div class="controls">
        <div class="input-group">
            <label for="start">Start Node:</label>
            <input id="start" type="text" bind:value={startNode}>
        </div>
        
        <div class="input-group">
            <label for="goal">Goal Node:</label>
            <input id="goal" type="text" bind:value={goalNode}>
        </div>

        <button on:click={findPath}>Find Path</button>
    </div>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    {#if path}
        <div class="result">
            <h3>Path found:</h3>
            <p class="path">{path.join(' → ')}</p>
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .description {
        margin: 20px 0;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 5px;
    }

    .controls {
        display: flex;
        gap: 20px;
        margin: 20px 0;
        align-items: flex-end;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    input {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    .error {
        color: red;
        margin: 10px 0;
    }

    .result {
        margin-top: 20px;
        padding: 15px;
        background-color: #e8f5e9;
        border-radius: 5px;
    }

    .path {
        font-size: 1.2em;
        color: #2e7d32;
    }
</style>
