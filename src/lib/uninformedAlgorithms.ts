// Priority Queue for UCS
class PriorityQueue<T> {
	private items: { item: T; priority: number }[] = [];

	enqueue(item: T, priority: number): void {
		this.items.push({ item, priority });
		this.items.sort((a, b) => a.priority - b.priority);
	}
	dequeue(): T | undefined {
		return this.items.shift()?.item;
	}
	isEmpty(): boolean {
		return this.items.length === 0;
	}
}

// Breadth-First Search (BFS)
function bfs(graph: Record<string, string[]>, start: string, goal: string): string[] | null {
	let queue: [string, string[]][] = [[start, [start]]];
	let visited = new Set<string>();

	while (queue.length > 0) {
		let [node, path] = queue.shift()!;
		if (node === goal) return path;
		if (!visited.has(node)) {
			visited.add(node);
			for (let neighbor of graph[node] || []) {
				queue.push([neighbor, [...path, neighbor]]);
			}
		}
	}
	return null;
}

// Depth-First Search (DFS)
function dfs(graph: Record<string, string[]>, start: string, goal: string, path: string[] = [], visited = new Set<string>()): string[] | null {
	if (visited.has(start)) return null;
	visited.add(start);
	path.push(start);

	if (start === goal) return path;

	for (let neighbor of graph[start] || []) {
		let result = dfs(graph, neighbor, goal, [...path], visited);
		if (result) return result;
	}
	return null;
}

// Uniform Cost Search (UCS)
function ucs(graph: Record<string, [string, number][]>, start: string, goal: string): string[] | null {
	let pq = new PriorityQueue<[string, string[], number]>();
	pq.enqueue([start, [start], 0], 0);
	let visited = new Set<string>();

	while (!pq.isEmpty()) {
		let [node, path, cost] = pq.dequeue()!;
		if (node === goal) return path;

		if (!visited.has(node)) {
			visited.add(node);
			for (let [neighbor, weight] of graph[node] || []) {
				let newCost = cost + weight;
				pq.enqueue([neighbor, [...path, neighbor], newCost], newCost);
			}
		}
	}
	return null;
}

// Depth-Limited Search (DLS)
function dls(graph: Record<string, string[]>, start: string, goal: string, depthLimit: number, depth = 0): string[] | null {
	if (depth > depthLimit) return null;
	if (start === goal) return [start];

	for (let neighbor of graph[start] || []) {
		let result = dls(graph, neighbor, goal, depthLimit, depth + 1);
		if (result) return [start, ...result];
	}
	return null;
}

// Iterative Deepening Depth-First Search (IDDFS)
function iddfs(graph: Record<string, string[]>, start: string, goal: string, maxDepth: number): string[] | null {
	for (let depth = 0; depth <= maxDepth; depth++) {
		let result = dls(graph, start, goal, depth);
		if (result) return result;
	}
	return null;
}

// Bidirectional Search
function bidirectionalSearch(graph: Record<string, string[]>, start: string, goal: string): string[] | null {
	let forwardQueue: [string, string[]][] = [[start, [start]]];
	let backwardQueue: [string, string[]][] = [[goal, [goal]]];
	let forwardVisited = new Set<string>();
	let backwardVisited = new Set<string>();

	while (forwardQueue.length > 0 && backwardQueue.length > 0) {
		let [fNode, fPath] = forwardQueue.shift()!;
		let [bNode, bPath] = backwardQueue.shift()!;

		if (backwardVisited.has(fNode)) return fPath;
		if (forwardVisited.has(bNode)) return bPath.reverse();

		forwardVisited.add(fNode);
		backwardVisited.add(bNode);

		for (let neighbor of graph[fNode] || []) forwardQueue.push([neighbor, [...fPath, neighbor]]);
		for (let neighbor of graph[bNode] || []) backwardQueue.push([neighbor, [...bPath, neighbor]]);
	}
	return null;
}

export { bfs, dfs, dls, ucs, iddfs, bidirectionalSearch };
