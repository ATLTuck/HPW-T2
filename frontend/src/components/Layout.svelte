<script lang="ts">
  // Icons imports
  import { Home, Users, Briefcase, CheckSquare, Calendar, FileText, 
           CreditCard, Clock, Target, Search } from 'lucide-svelte';
  
  export let segment: string = '';
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: Home },
    { id: 'contacts', label: 'Contacts', path: '/contacts', icon: Users },
    { id: 'projects', label: 'Projects', path: '/projects', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', path: '/calendar', icon: Calendar },
    { id: 'notes', label: 'Notes', path: '/notes', icon: FileText },
    { id: 'invoices', label: 'Invoices', path: '/invoices', icon: CreditCard },
    { id: 'time', label: 'Time Tracking', path: '/time', icon: Clock },
    { id: 'goals', label: 'Goals', path: '/goals', icon: Target }
  ];
  
  // Quick add dropdown
  let showQuickAdd = false;
  
  // Search state
  let searchQuery = '';
  
  function toggleQuickAdd() {
    showQuickAdd = !showQuickAdd;
  }
  
  function handleSearchFocus() {
    // Implement search focus behavior
  }
  
  function handleSearchBlur() {
    if (!searchQuery) {
      // Handle search blur
    }
  }
  
  function clearSearch() {
    searchQuery = '';
  }
</script>

<div class="h-full flex flex-col dark">
  <!-- Top Navbar -->
  <div class="h-14 bg-macos-sidebar backdrop-blur-glass border-b border-macos-divider flex items-center px-4 justify-between">
    <div class="flex items-center space-x-2">
      <div class="flex space-x-1.5">
        <div class="w-3 h-3 rounded-full bg-macos-red"></div>
        <div class="w-3 h-3 rounded-full bg-macos-yellow"></div>
        <div class="w-3 h-3 rounded-full bg-macos-green"></div>
      </div>
      <h1 class="text-xl font-semibold ml-4 text-macos-text">Solopreneur CRM</h1>
    </div>
    
    <!-- Search Bar -->
    <div class="relative w-1/3 max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} class="text-macos-text-secondary" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        class="w-full bg-macos-control rounded-full pl-10 pr-4 py-1.5 text-sm"
        bind:value={searchQuery}
        on:focus={handleSearchFocus}
        on:blur={handleSearchBlur}
      />
      {#if searchQuery}
        <button
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
          on:click={clearSearch}
        >
          <span class="text-macos-text-secondary text-lg leading-none">&times;</span>
        </button>
      {/if}
    </div>
    
    <!-- Quick Add Button -->
    <div class="relative">
      <button 
        class="bg-macos-blue hover:bg-opacity-90 text-white rounded-full px-4 py-1.5 text-sm flex items-center"
        on:click={toggleQuickAdd}
      >
        <span class="mr-1 text-lg leading-none">+</span> Quick Add
      </button>
      
      {#if showQuickAdd}
        <div class="absolute right-0 mt-2 w-48 glass-card py-1 z-50">
          <a href="/contacts/new" class="px-4 py-2 flex items-center hover:bg-macos-control">
            <Users size={16} class="mr-2" /> New Contact
          </a>
          <a href="/projects/new" class="px-4 py-2 flex items-center hover:bg-macos-control">
            <Briefcase size={16} class="mr-2" /> New Project
          </a>
          <a href="/tasks/new" class="px-4 py-2 flex items-center hover:bg-macos-control">
            <CheckSquare size={16} class="mr-2" /> New Task
          </a>
          <a href="/notes/new" class="px-4 py-2 flex items-center hover:bg-macos-control">
            <FileText size={16} class="mr-2" /> New Note
          </a>
          <a href="/invoices/new" class="px-4 py-2 flex items-center hover:bg-macos-control">
            <CreditCard size={16} class="mr-2" /> New Invoice
          </a>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Main Content Area -->
  <div class="flex-1 flex overflow-hidden">
    <!-- Sidebar -->
    <div class="w-60 bg-macos-sidebar backdrop-blur-glass border-r border-macos-divider flex flex-col">
      <nav class="flex-1 pt-4 px-2">
        <ul class="space-y-1">
          {#each navItems as item}
            <li>
              <a 
                href={item.path}
                class="flex items-center px-3 py-2 rounded-macos text-macos-text {segment === item.id ? 'bg-macos-blue' : 'hover:bg-macos-control'}"
              >
                <svelte:component this={item.icon} size={18} class="mr-3" />
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
    
    <!-- Content -->
    <div class="flex-1 overflow-auto bg-macos-bg p-6">
      <slot />
    </div>
  </div>
</div>

<style>
  :global(a) {
    text-decoration: none;
    color: inherit;
  }
  
  :global(.backdrop-blur-glass) {
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }
</style> 