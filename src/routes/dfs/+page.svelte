<script lang="ts">
    import { dfs } from '$lib/uninformedAlgorithms';

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
    let searchHistory: string[] = [];
    let isSearching = false;
    let searchStep = 0;

    const nodePositions = {
        'A': { x: 200, y: 100 },
        'B': { x: 100, y: 200 },
        'C': { x: 300, y: 200 },
        'D': { x: 50, y: 300 },
        'E': { x: 150, y: 300 },
        'F': { x: 250, y: 300 }
    };

    async function runSearch() {
        resetSearch();
        isSearching = true;
        
        // Simulate DFS exploration pattern
        const explorationOrder = simulateDFSExploration(startNode);
        
        for (let node of explorationOrder) {
            searchHistory.push(node);
            searchHistory = searchHistory;
            await new Promise(resolve => setTimeout(resolve, 1000));
            searchStep++;
        }

        path = dfs(graph, startNode, goalNode);
        isSearching = false;
    }

    function simulateDFSExploration(start: string, visited = new Set<string>()): string[] {
        const exploration: string[] = [];
        const stack = [start];
        
        while (stack.length > 0) {
            const node = stack.pop()!;
            if (!visited.has(node)) {
                visited.add(node);
                exploration.push(node);
                
                // Add neighbors in reverse order for DFS-like visualization
                for (let neighbor of [...(graph[node] || [])].reverse()) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        return exploration;
    }

    function isInPath(node: string) {
        return path?.includes(node);
    }

    function isExplored(node: string) {
        return searchHistory.includes(node);
    }

    function getNodeColor(node: string) {
        if (node === startNode) return '#2196F3';
        if (node === goalNode) return '#F44336';
        if (isInPath(node)) return '#4CAF50';
        if (isExplored(node)) return '#FFA726';
        return '#fff';
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
        searchHistory = [];
        searchStep = 0;
        isSearching = false;
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Depth-First Search (DFS)</h1>
    
    <div class="mb-6">
        <p class="mb-4">
            Depth-First Search (DFS) explores deeply into a path before backtracking. 
            Watch as it dives deep into one branch before exploring alternatives.
            <br>
            <span class="text-orange-500">Orange nodes</span> show the exploration sequence, 
            and <span class="text-green-500">green nodes</span> show the final path.
        </p>
        <div class="flex gap-4">
            <button 
                on:click={runSearch} 
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isSearching}
            >
                {isSearching ? 'Searching...' : 'Start Search'}
            </button>
            <button 
                on:click={resetSearch} 
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Reset
            </button>
        </div>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; height: 400px;" class="mb-6">
        <svg width="400" height="400" class="border rounded">
            <!-- Draw edges -->
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
                        fill={getNodeColor(node)}
                        stroke="#333"
                        stroke-width="2"
                    />
                    <text 
                        text-anchor="middle" 
                        dominant-baseline="middle"
                        fill={getNodeColor(node) === '#fff' ? '#000' : '#fff'}
                    >{node}</text>
                    {#if isExplored(node)}
                        <text 
                            text-anchor="middle" 
                            dominant-baseline="middle" 
                            y="30" 
                            fill="#666"
                            font-size="12"
                        >
                            {searchHistory.indexOf(node) + 1}
                        </text>
                    {/if}
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
                disabled={isSearching}
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
                disabled={isSearching}
            >
                {#each Object.keys(graph) as node}
                    <option value={node}>{node}</option>
                {/each}
            </select>
        </label>
    </div>

    {#if path}
        <div class="mt-4">
            <h3 class="text-xl font-semibold">Path Found:</h3>
            <p class="font-mono bg-gray-100 p-2 rounded">
                {path.join(' → ')}
            </p>
        </div>
    {:else if path === null && !isSearching}
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
