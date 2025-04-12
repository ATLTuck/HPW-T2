<script lang="ts">
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";

  let isMenuOpen = false;
  let isScrolled = false;

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<nav
  class="fixed w-full z-50 transition-all duration-300"
  class:bg-white={isScrolled}
  class:bg-transparent={!isScrolled}
  class:shadow-md={isScrolled}
>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <Link to="/" class="flex items-center">
        <span class="text-2xl font-bold" class:text-white={!isScrolled} class:text-gray-800={isScrolled}>
          HPW Seed
        </span>
      </Link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        <Link
          to="/"
          class="font-medium transition-colors"
          class:text-white={!isScrolled}
          class:text-gray-800={isScrolled}
        >
          Home
        </Link>
        <Link
          to="/demo"
          class="font-medium transition-colors"
          class:text-white={!isScrolled}
          class:text-gray-800={isScrolled}
        >
          Demo
        </Link>
        <Link
          to="/docs"
          class="font-medium transition-colors"
          class:text-white={!isScrolled}
          class:text-gray-800={isScrolled}
        >
          Documentation
        </Link>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-md"
        class:text-white={!isScrolled}
        class:text-gray-800={isScrolled}
        on:click={() => (isMenuOpen = !isMenuOpen)}
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {#if isMenuOpen}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      class="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg transition-all duration-300"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col space-y-4">
          <Link to="/" class="text-gray-800 hover:text-gray-600">Home</Link>
          <Link to="/demo" class="text-gray-800 hover:text-gray-600">Demo</Link>
          <Link to="/docs" class="text-gray-800 hover:text-gray-600">Documentation</Link>
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  nav {
    backdrop-filter: blur(8px);
  }
</style> 