<script lang="ts">
    import { bfs } from '$lib/uninformedAlgorithms';

    const graph: Record<string, string[]> = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E']
    };

    let startNode = 'A';
    let goalNode = 'F';
    let path: string[] | null = null;

    function runSearch() {
        path = bfs(graph, startNode, goalNode);
    }

    const nodePositions = {
        'A': { x: 200, y: 100 },
        'B': { x: 100, y: 200 },
        'C': { x: 300, y: 200 },
        'D': { x: 50, y: 300 },
        'E': { x: 150, y: 300 },
        'F': { x: 250, y: 300 }
    };

    function isInPath(node: string) {
        return path?.includes(node);
    }

    function isEdgeInPath(from: string, to: string) {
        if (!path) return false;
        for (let i = 0; i < path.length - 1; i++) {
            if ((path[i] === from && path[i + 1] === to) ||
                (path[i] === to && path[i + 1] === from)) {
                return true;
            }
        }
        return false;
    }
    function resetSearch() {
        path = null;
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Breadth-First Search (BFS)</h1>
    
    <div class="mb-6">
        <p class="mb-4">
            Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. 
            It explores all the neighbor nodes at the present depth prior to moving on to nodes at the next depth level.
        </p>
        <button on:click={resetSearch} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-500-600">Reset</button>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; height: 400px;" class="mb-6">
        <svg width="400" height="400" class="border rounded">
            <!-- Draw edges first -->
            {#each Object.entries(graph) as [node, neighbors]}
                {#each neighbors as neighbor}
                    <line 
                        x1={nodePositions[node].x}
                        y1={nodePositions[node].y}
                        x2={nodePositions[neighbor].x}
                        y2={nodePositions[neighbor].y}
                        stroke={isEdgeInPath(node, neighbor) ? '#4CAF50' : '#999'}
                        stroke-width={isEdgeInPath(node, neighbor) ? '3' : '1'}
                    />
                {/each}
            {/each}
            
            <!-- Draw nodes -->
            {#each Object.keys(nodePositions) as node}
                <g transform="translate({nodePositions[node].x}, {nodePositions[node].y})">
                    <circle 
                        r="20" 
                        fill={node === startNode ? '#2196F3' : 
                             node === goalNode ? '#F44336' :
                             isInPath(node) ? '#4CAF50' : '#fff'}
                        stroke="#333"
                        stroke-width="2"
                    />
                    <text 
                        text-anchor="middle" 
                        dominant-baseline="middle"
                        fill={isInPath(node) ? '#fff' : '#000'}
                    >{node}</text>
                </g>
            {/each}
        </svg>
    </div>

    <div class="mb-6">
        <label class="block mb-2">
            Start Node:
            <select 
                bind:value={startNode}
                class="ml-2 p-1 border rounded"
            >
                {#each Object.keys(graph) as node}
                    <option value={node}>{node}</option>
                {/each}
            </select>
        </label>

        <label class="block mb-2">
            Goal Node:
            <select 
                bind:value={goalNode}
                class="ml-2 p-1 border rounded"
            >
                {#each Object.keys(graph) as node}
                    <option value={node}>{node}</option>
                {/each}
            </select>
        </label>

        <button 
            on:click={runSearch}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Find Path
        </button>
    </div>

    {#if path}
        <div class="mt-4">
            <h3 class="text-xl font-semibold">Path Found:</h3>
            <p class="font-mono bg-gray-100 p-2 rounded">
                {path.join(' → ')}
            </p>
        </div>
    {:else if path === null}
        <div class="mt-4 text-red-500">
            No path found!
        </div>
    {/if}
</div>

<style>
    svg {
        background: #f9f9f9;
    }
    circle {
        cursor: pointer;
    }
    text {
        user-select: none;
        pointer-events: none;
    }
</style>
