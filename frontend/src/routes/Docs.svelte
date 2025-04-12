<script lang="ts">
  import { Link } from "svelte-routing";

  const sections = [
    {
      title: "Getting Started",
      items: [
        { title: "Installation", href: "#installation" },
        { title: "Quick Start", href: "#quick-start" },
        { title: "Configuration", href: "#configuration" },
      ],
    },
    {
      title: "Core Features",
      items: [
        { title: "Real-time Communication", href: "#real-time" },
        { title: "Database Integration", href: "#database" },
        { title: "Security", href: "#security" },
      ],
    },
    {
      title: "Advanced Topics",
      items: [
        { title: "Performance Optimization", href: "#performance" },
        { title: "Scaling", href: "#scaling" },
        { title: "Edge Computing", href: "#edge" },
      ],
    },
  ];

  const codeExamples = {
    installation: `# Clone the repository
git clone https://github.com/yourusername/hpw-seed.git
cd hpw-seed

# Install dependencies
cd backend
go mod download

cd ../frontend
npm install`,
    websocket: `// Connect to WebSocket server
const ws = new WebSocket('ws://localhost:8080/ws');

// Send a message
ws.send(JSON.stringify({
  type: 'broadcast',
  payload: 'Hello, World!'
}));

// Handle incoming messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};`,
  };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="lg:grid lg:grid-cols-12 lg:gap-8">
    <!-- Sidebar -->
    <div class="hidden lg:block lg:col-span-3">
      <nav class="space-y-1">
        {#each sections as section}
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <ul class="mt-4 space-y-2">
              {#each section.items as item}
                <li>
                  <a
                    href={item.href}
                    class="text-base text-gray-500 hover:text-gray-900 block py-2"
                  >
                    {item.title}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </nav>
    </div>

    <!-- Main content -->
    <div class="lg:col-span-9">
      <div class="prose prose-indigo max-w-none">
        <h1>Documentation</h1>
        <p class="lead">
          Comprehensive guides and references for building high-performance real-time applications
          with our seed repository.
        </p>

        <h2 id="installation">Installation</h2>
        <p>
          Get started quickly with our seed repository. Follow these steps to set up your
          development environment.
        </p>
        <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <code>{codeExamples.installation}</code>
        </pre>

        <h2 id="real-time">Real-time Communication</h2>
        <p>
          Our WebSocket implementation provides efficient bi-directional communication with
          automatic reconnection and fallback mechanisms.
        </p>
        <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <code>{codeExamples.websocket}</code>
        </pre>

        <h2 id="database">Database Integration</h2>
        <p>
          Choose from multiple database options to suit your needs:
        </p>
        <ul>
          <li>SQLite for transactional data</li>
          <li>RocksDB for high-throughput key-value storage</li>
          <li>DuckDB for analytical queries</li>
        </ul>

        <h2 id="security">Security</h2>
        <p>
          Built-in security features include:
        </p>
        <ul>
          <li>Mutual TLS for encrypted communication</li>
          <li>Rate limiting to prevent abuse</li>
          <li>Circuit breakers for fault tolerance</li>
          <li>Secure defaults and best practices</li>
        </ul>

        <h2 id="performance">Performance Optimization</h2>
        <p>
          Tips for maximizing performance:
        </p>
        <ul>
          <li>Use delta updates to minimize data transfer</li>
          <li>Implement efficient caching strategies</li>
          <li>Optimize database queries</li>
          <li>Leverage edge computing for reduced latency</li>
        </ul>

        <h2 id="scaling">Scaling</h2>
        <p>
          Scale your application horizontally with these strategies:
        </p>
        <ul>
          <li>Implement load balancing</li>
          <li>Use message queues for background processing</li>
          <li>Distribute WebSocket connections</li>
          <li>Cache frequently accessed data</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
  :global(.prose pre) {
    background-color: #1a1a1a;
    color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  :global(.prose code) {
    color: #fff;
  }
</style> 