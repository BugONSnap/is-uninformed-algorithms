<script lang="ts">
    import { bidirectionalSearch } from '$lib/uninformedAlgorithms';

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
    let forwardHistory: string[] = [];
    let backwardHistory: string[] = [];
    let isSearching = false;

    const nodePositions = {
        'A': { x: 200, y: 100 },
        'B': { x: 100, y: 200 },
        'C': { x: 300, y: 200 },
        'D': { x: 50, y: 300 },
        'E': { x: 150, y: 300 },
        'F': { x: 250, y: 300 }
    } as const;

    async function runSearch() {
        resetSearch();
        isSearching = true;
        
        // Simulate bidirectional exploration
        const [forwardOrder, backwardOrder] = simulateBiSearch(startNode, goalNode);
        
        const maxSteps = Math.max(forwardOrder.length, backwardOrder.length);
        for (let i = 0; i < maxSteps; i++) {
            if (i < forwardOrder.length) {
                forwardHistory.push(forwardOrder[i]);
                forwardHistory = forwardHistory;
            }
            if (i < backwardOrder.length) {
                backwardHistory.push(backwardOrder[i]);
                backwardHistory = backwardHistory;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        path = bidirectionalSearch(graph, startNode, goalNode);
        isSearching = false;
    }

    function simulateBiSearch(start: string, goal: string): [string[], string[]] {
        const forwardExploration: string[] = [];
        const backwardExploration: string[] = [];
        const forwardVisited = new Set<string>();
        const backwardVisited = new Set<string>();
        const forwardQueue = [start];
        const backwardQueue = [goal];

        while (forwardQueue.length > 0 && backwardQueue.length > 0) {
            // Forward exploration
            const fNode = forwardQueue.shift()!;
            if (!forwardVisited.has(fNode)) {
                forwardVisited.add(fNode);
                forwardExploration.push(fNode);
                for (const neighbor of graph[fNode] || []) {
                    if (!forwardVisited.has(neighbor)) {
                        forwardQueue.push(neighbor);
                    }
                }
            }

            // Backward exploration
            const bNode = backwardQueue.shift()!;
            if (!backwardVisited.has(bNode)) {
                backwardVisited.add(bNode);
                backwardExploration.push(bNode);
                for (const neighbor of graph[bNode] || []) {
                    if (!backwardVisited.has(neighbor)) {
                        backwardQueue.push(neighbor);
                    }
                }
            }

            // Check if explorations meet
            if ([...forwardVisited].some(n => backwardVisited.has(n))) {
                break;
            }
        }

        return [forwardExploration, backwardExploration];
    }

    function getNodeColor(node: string) {
        if (node === startNode) return '#2196F3';
        if (node === goalNode) return '#F44336';
        if (path?.includes(node)) return '#4CAF50';
        if (forwardHistory.includes(node)) return '#FFA726';
        if (backwardHistory.includes(node)) return '#9C27B0';
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
        forwardHistory = [];
        backwardHistory = [];
        isSearching = false;
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Bidirectional Search</h1>
    
    <div class="mb-6">
        <p class="mb-4">
            Bidirectional Search explores from both the start and goal nodes simultaneously.
            Watch as the search progresses from both ends until they meet.
            <br>
            <span class="text-orange-500">Orange nodes</span> show forward exploration,
            <span class="text-purple-500">purple nodes</span> show backward exploration,
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
                    {#if forwardHistory.includes(node)}
                        <text 
                            text-anchor="start" 
                            dominant-baseline="middle" 
                            x="25" 
                            fill="#FFA726"
                            font-size="12"
                        >
                            F{forwardHistory.indexOf(node) + 1}
                        </text>
                    {/if}
                    {#if backwardHistory.includes(node)}
                        <text 
                            text-anchor="end" 
                            dominant-baseline="middle" 
                            x="-25" 
                            fill="#9C27B0"
                            font-size="12"
                        >
                            B{backwardHistory.indexOf(node) + 1}
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
