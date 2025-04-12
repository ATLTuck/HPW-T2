<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Line } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from "chart.js";

  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

  let ws: WebSocket;
  let messages: string[] = [];
  let chartData = {
    labels: [],
    datasets: [
      {
        label: "Real-time Data",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  let isConnected = false;
  let messageInput = "";

  function connect() {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      isConnected = true;
      messages = [...messages, "Connected to server"];
    };

    ws.onclose = () => {
      isConnected = false;
      messages = [...messages, "Disconnected from server"];
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "broadcast") {
        messages = [...messages, data.payload];
      } else if (data.type === "data") {
        updateChart(data.payload);
      }
    };
  }

  function sendMessage() {
    if (ws && messageInput) {
      ws.send(
        JSON.stringify({
          type: "broadcast",
          payload: messageInput,
        })
      );
      messageInput = "";
    }
  }

  function updateChart(value: number) {
    const now = new Date();
    const time = now.toLocaleTimeString();
    
    chartData.labels = [...chartData.labels, time].slice(-10);
    chartData.datasets[0].data = [...chartData.datasets[0].data, value].slice(-10);
    chartData = { ...chartData };
  }

  onMount(() => {
    connect();
    // Simulate real-time data
    const interval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const value = Math.random() * 100;
        ws.send(
          JSON.stringify({
            type: "data",
            payload: value,
          })
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (ws) {
        ws.close();
      }
    };
  });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="text-center">
    <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
      Interactive Demo
    </h1>
    <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
      Experience the power of real-time communication and data visualization
    </p>
  </div>

  <div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
    <!-- Real-time Chat -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Real-time Chat</h2>
      <div class="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
        {#each messages as message}
          <p class="text-sm text-gray-600 mb-2">{message}</p>
        {/each}
      </div>
      <div class="flex space-x-4">
        <input
          type="text"
          bind:value={messageInput}
          placeholder="Type a message..."
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          on:click={sendMessage}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Send
        </button>
      </div>
    </div>

    <!-- Real-time Chart -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Real-time Data Visualization</h2>
      <div class="h-64">
        <Line data={chartData} options={{ animation: false }} />
      </div>
    </div>
  </div>

  <!-- Connection Status -->
  <div class="mt-8 text-center">
    <div class="inline-flex items-center">
      <div
        class="w-3 h-3 rounded-full mr-2"
        class:bg-green-500={isConnected}
        class:bg-red-500={!isConnected}
      />
      <span class="text-sm text-gray-600">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  </div>
</div> 