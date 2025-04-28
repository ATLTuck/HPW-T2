<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Project } from '../lib/db';
  
  let projects: Project[] = [];
  
  onMount(async () => {
    projects = await db.projects.toArray();
  });
</script>

<div class="h-full flex flex-col">
  <h1 class="text-3xl font-bold mb-6">Projects</h1>
  
  <div class="glass-card p-6">
    {#if projects.length > 0}
      <div class="space-y-4">
        {#each projects as project}
          <div class="glass-card p-4">
            <h2 class="text-xl font-semibold">{project.name}</h2>
            <p class="text-macos-text-secondary">{project.description}</p>
            <div class="mt-2">Status: {project.status}</div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center py-10 text-macos-text-secondary">
        No projects yet. Create your first project to get started.
      </p>
    {/if}
  </div>
</div> 