import java.util.*;

/**
 * Dijkstra's Shortest Path Algorithm implementation in Java.
 */
public class abc {

    // Class to represent an edge in the graph
    public static class Edge {
        int target;
        int weight;

        public Edge(int target, int weight) {
            this.target = target;
            this.weight = weight;
        }
    }

    // Class to represent a node in the priority queue
    public static class Node implements Comparable<Node> {
        int id;
        int distance;

        public Node(int id, int distance) {
            this.id = id;
            this.distance = distance;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    /**
     * Finds the shortest path from the source node to all other nodes in a graph.
     * 
     * @param graph  The adjacency list representation of the graph.
     * @param source The starting node index.
     * @return An array of shortest distances from the source to each node.
     */
    public static int[] dijkstra(List<List<Edge>> graph, int source) {
        int n = graph.size();
        int[] distances = new int[n];
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(source, 0));

        boolean[] visited = new boolean[n];

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;

            if (visited[u]) continue;
            visited[u] = true;

            for (Edge edge : graph.get(u)) {
                int v = edge.target;
                int weight = edge.weight;

                if (!visited[v] && distances[u] != Integer.MAX_VALUE && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    pq.add(new Node(v, distances[v]));
                }
            }
        }

        return distances;
    }

    public static void main(String[] args) {
        int numVertices = 5;
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < numVertices; i++) {
            graph.add(new ArrayList<>());
        }

        // Define graph edges (source -> target with weight)
        graph.get(0).add(new Edge(1, 9));
        graph.get(0).add(new Edge(2, 6));
        graph.get(0).add(new Edge(3, 5));
        graph.get(0).add(new Edge(4, 3));

        graph.get(2).add(new Edge(1, 2));
        graph.get(2).add(new Edge(3, 4));

        int source = 0;
        int[] distances = dijkstra(graph, source);

        System.out.println("Shortest distances from source node " + source + ":");
        for (int i = 0; i < distances.length; i++) {
            System.out.println("To node " + i + " is " + (distances[i] == Integer.MAX_VALUE ? "Infinity" : distances[i]));
        }
    }
}
