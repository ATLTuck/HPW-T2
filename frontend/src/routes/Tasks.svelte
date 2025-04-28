<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Task } from '../lib/db';
  
  let tasks: Task[] = [];
  
  onMount(async () => {
    tasks = await db.tasks.toArray();
  });
</script>

<div class="h-full flex flex-col">
  <h1 class="text-3xl font-bold mb-6">Tasks</h1>
  
  <div class="glass-card p-6">
    {#if tasks.length > 0}
      <div class="space-y-4">
        {#each tasks as task}
          <div class="glass-card p-4">
            <h2 class="text-xl font-semibold">{task.title}</h2>
            <p class="text-macos-text-secondary">{task.description}</p>
            <div class="mt-2">Status: {task.status} | Priority: {task.priority}</div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center py-10 text-macos-text-secondary">
        No tasks yet. Create your first task to get started.
      </p>
    {/if}
  </div>
</div> 