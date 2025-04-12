<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./routes/Home.svelte";
  import Demo from "./routes/Demo.svelte";
  import Docs from "./routes/Docs.svelte";

  export let url = "";
</script>

<Router {url}>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <main class="container mx-auto px-4 py-8">
      <Route path="/" component={Home} />
      <Route path="/demo" component={Demo} />
      <Route path="/docs" component={Docs} />
    </main>

    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About</h3>
            <p class="text-gray-300">
              High-Performance Web Application Seed - A production-ready starting point for building
              scalable, real-time applications.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <Link to="/" class="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/demo" class="text-gray-300 hover:text-white">Demo</Link>
              </li>
              <li>
                <Link to="/docs" class="text-gray-300 hover:text-white">Documentation</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Resources</h3>
            <ul class="space-y-2">
              <li>
                <a href="https://github.com/yourusername/hpw-seed" class="text-gray-300 hover:text-white">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="/docs" class="text-gray-300 hover:text-white">API Documentation</a>
              </li>
              <li>
                <a href="/docs/performance" class="text-gray-300 hover:text-white">
                  Performance Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2024 High-Performance Web Application Seed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</Router>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      sans-serif;
  }
</style> 