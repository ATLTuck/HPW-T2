<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from './components/Layout.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Contacts from './routes/Contacts.svelte';
  import Projects from './routes/Projects.svelte';
  import Tasks from './routes/Tasks.svelte';
  
  type RouteComponent = new (...args: any[]) => any;
  
  // Define routes
  const routes: Record<string, RouteComponent> = {
    '/': Dashboard,
    '/contacts': Contacts,
    '/projects': Projects,
    '/tasks': Tasks,
  };
  
  let currentPath = window.location.pathname;
  let component = routes[currentPath] || routes['/'];
  
  // Set up navigation
  window.addEventListener('popstate', () => {
    currentPath = window.location.pathname;
    component = routes[currentPath] || routes['/'];
  });
  
  // Export navigate function for use in other components
  export function navigate(path: string): void {
    window.history.pushState({}, '', path);
    currentPath = path;
    component = routes[path] || routes['/'];
  }
  
  onMount(() => {
    // Add dark mode class to document
    document.documentElement.classList.add('dark');
    
    // Remove the loading indicator if it exists
    const loadingElement = document.querySelector('.app-loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  });
</script>

<Layout segment={currentPath === '/' ? 'dashboard' : currentPath.substring(1)}>
  <svelte:component this={component} />
</Layout>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #1e1e1e;
    color: #ffffff;
  }
</style> 