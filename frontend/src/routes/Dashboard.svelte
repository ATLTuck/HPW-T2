<script lang="ts">
  import { onMount } from 'svelte';
  import { db, dbHelpers, type Project, type Task, type Event } from '../lib/db';
  import { Bar } from 'svelte-chartjs';
  import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Users, CheckSquare, Briefcase, Clock, AlertCircle, Calendar } from 'lucide-svelte';
  import { format } from 'date-fns';
  
  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  // Dashboard data
  let stats = {
    contacts: 0,
    projects: 0,
    activeTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    overdueTasks: 0,
    timeTracked: 0
  };
  
  let recentProjects: Project[] = [];
  let upcomingTasks: Task[] = [];
  let upcomingEvents: Event[] = [];
  
  // Chart data
  let taskCompletionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#0A84FF',
      }
    ]
  };
  
  let chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  
  onMount(async () => {
    // Fetch dashboard data
    try {
      // Load counts
      stats.contacts = await db.contacts.count();
      stats.projects = await db.projects.count();
      stats.activeTasks = await db.tasks.where('status').noneOf(['completed']).count();
      stats.completedTasks = await db.tasks.where('status').equals('completed').count();
      
      // Get upcoming and overdue tasks
      const today = new Date();
      
      // Overdue tasks
      stats.overdueTasks = await db.tasks
        .where('status').noneOf(['completed'])
        .and(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate) < today;
        })
        .count();
      
      // Upcoming deadlines
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);
      
      stats.upcomingDeadlines = await db.tasks
        .where('status').noneOf(['completed'])
        .and(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= oneWeekFromNow;
        })
        .count();
      
      // Calculate total time tracked
      const allTimeEntries = await db.timeEntries.toArray();
      stats.timeTracked = allTimeEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);
      
      // Load recent items
      recentProjects = await db.projects
        .orderBy('updatedAt')
        .reverse()
        .limit(5)
        .toArray();
      
      // Load upcoming tasks
      upcomingTasks = await dbHelpers.getUpcomingTasks(7);
      
      // Load upcoming events
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7);
      upcomingEvents = await dbHelpers.getEventsInRange(today, endDate);
      
      // Prepare task completion chart data
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const taskCompletions = [0, 0, 0, 0, 0, 0, 0];
      
      // Get completed tasks from the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      
      const recentlyCompletedTasks = await db.tasks
        .where('completedDate')
        .above(oneWeekAgo)
        .toArray();
      
      // Count completed tasks by day of week
      recentlyCompletedTasks.forEach(task => {
        const completedDate = new Date(task.completedDate as Date);
        const dayIndex = completedDate.getDay();
        taskCompletions[dayIndex]++;
      });
      
      // Reorder data to start with Monday
      const mondayIndex = daysOfWeek.indexOf('Mon');
      taskCompletionData.labels = [
        ...daysOfWeek.slice(mondayIndex),
        ...daysOfWeek.slice(0, mondayIndex)
      ];
      
      taskCompletionData.datasets[0].data = [
        ...taskCompletions.slice(mondayIndex),
        ...taskCompletions.slice(0, mondayIndex)
      ];
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  });
  
  // Format time duration from minutes to hours and minutes
  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  
  // Format date for display
  function formatDate(date: Date | undefined): string {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
  }
</script>

<div class="space-y-6">
  <h1 class="text-3xl font-bold">Dashboard</h1>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="glass-card p-4 flex items-center">
      <div class="w-10 h-10 rounded-full bg-macos-blue bg-opacity-20 flex items-center justify-center mr-3">
        <Users size={20} class="text-macos-blue" />
      </div>
      <div>
        <div class="text-sm text-macos-text-secondary">Contacts</div>
        <div class="text-2xl font-semibold">{stats.contacts}</div>
      </div>
    </div>
    
    <div class="glass-card p-4 flex items-center">
      <div class="w-10 h-10 rounded-full bg-macos-purple bg-opacity-20 flex items-center justify-center mr-3">
        <Briefcase size={20} class="text-macos-purple" />
      </div>
      <div>
        <div class="text-sm text-macos-text-secondary">Projects</div>
        <div class="text-2xl font-semibold">{stats.projects}</div>
      </div>
    </div>
    
    <div class="glass-card p-4 flex items-center">
      <div class="w-10 h-10 rounded-full bg-macos-green bg-opacity-20 flex items-center justify-center mr-3">
        <CheckSquare size={20} class="text-macos-green" />
      </div>
      <div>
        <div class="text-sm text-macos-text-secondary">Active Tasks</div>
        <div class="text-2xl font-semibold">{stats.activeTasks}</div>
      </div>
    </div>
    
    <div class="glass-card p-4 flex items-center">
      <div class="w-10 h-10 rounded-full bg-macos-orange bg-opacity-20 flex items-center justify-center mr-3">
        <AlertCircle size={20} class="text-macos-orange" />
      </div>
      <div>
        <div class="text-sm text-macos-text-secondary">Upcoming Deadlines</div>
        <div class="text-2xl font-semibold">{stats.upcomingDeadlines}</div>
      </div>
    </div>
  </div>
  
  <!-- Charts and Lists -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Task Completion Chart -->
    <div class="glass-card p-4">
      <h2 class="text-lg font-semibold mb-4">Task Completion</h2>
      <div class="h-64">
        <Bar data={taskCompletionData} options={chartOptions} />
      </div>
    </div>
    
    <!-- Activity Summary -->
    <div class="glass-card p-4">
      <h2 class="text-lg font-semibold mb-4">Activity Summary</h2>
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <CheckSquare size={16} class="text-macos-green mr-2" />
            <span>Completed Tasks</span>
          </div>
          <span class="font-semibold">{stats.completedTasks}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <AlertCircle size={16} class="text-macos-red mr-2" />
            <span>Overdue Tasks</span>
          </div>
          <span class="font-semibold">{stats.overdueTasks}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Clock size={16} class="text-macos-purple mr-2" />
            <span>Time Tracked</span>
          </div>
          <span class="font-semibold">{formatDuration(stats.timeTracked)}</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Recent Items and Upcoming -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Recent Projects -->
    <div class="glass-card p-4">
      <h2 class="text-lg font-semibold mb-4">Recent Projects</h2>
      {#if recentProjects.length > 0}
        <ul class="space-y-2">
          {#each recentProjects as project}
            <li class="p-2 hover:bg-macos-control rounded-macos">
              <a href={`/projects/${project.id}`} class="flex justify-between">
                <div>
                  <div class="font-medium">{project.name}</div>
                  <div class="text-sm text-macos-text-secondary">{project.status}</div>
                </div>
                {#if project.dueDate}
                  <div class="text-sm text-macos-text-secondary">Due: {formatDate(project.dueDate)}</div>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-macos-text-secondary">No recent projects</p>
      {/if}
    </div>
    
    <!-- Upcoming Tasks -->
    <div class="glass-card p-4">
      <h2 class="text-lg font-semibold mb-4">Upcoming Tasks</h2>
      {#if upcomingTasks.length > 0}
        <ul class="space-y-2">
          {#each upcomingTasks as task}
            <li class="p-2 hover:bg-macos-control rounded-macos">
              <a href={`/tasks/${task.id}`} class="flex justify-between">
                <div>
                  <div class="font-medium">{task.title}</div>
                  <div class="text-sm text-macos-text-secondary">
                    {#if task.priority === 'high'}
                      <span class="text-macos-red">High</span>
                    {:else if task.priority === 'medium'}
                      <span class="text-macos-orange">Medium</span>
                    {:else}
                      <span class="text-macos-blue">Low</span>
                    {/if}
                  </div>
                </div>
                {#if task.dueDate}
                  <div class="text-sm text-macos-text-secondary">Due: {formatDate(task.dueDate)}</div>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-macos-text-secondary">No upcoming tasks</p>
      {/if}
    </div>
  </div>
  
  <!-- Calendar Events -->
  <div class="glass-card p-4">
    <h2 class="text-lg font-semibold mb-4">Upcoming Events</h2>
    {#if upcomingEvents.length > 0}
      <ul class="space-y-2">
        {#each upcomingEvents as event}
          <li class="p-3 hover:bg-macos-control rounded-macos flex items-center">
            <div class="w-10 h-10 rounded-full bg-opacity-20 flex items-center justify-center mr-3" 
                 style="background-color: {event.color || '#0A84FF'}20;">
              <Calendar size={20} style="color: {event.color || '#0A84FF'}" />
            </div>
            <div class="flex-1">
              <div class="font-medium">{event.title}</div>
              <div class="text-sm text-macos-text-secondary">
                {format(new Date(event.startDate), 'MMM d, h:mm a')}
                {#if !event.allDay}
                  - {format(new Date(event.endDate), 'h:mm a')}
                {/if}
              </div>
            </div>
            {#if event.location}
              <div class="text-sm text-macos-text-secondary">{event.location}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-macos-text-secondary">No upcoming events</p>
    {/if}
  </div>
</div> 