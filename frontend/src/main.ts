import './app.css';
import App from './App.svelte';
import { populateSampleData } from './lib/sampleData';

// Initialize data and then mount the app
async function initializeApp() {
  try {
    // First load the sample data
    await populateSampleData();
    
    // Then mount the app
    const app = new App({
      target: document.getElementById('app')!,
    });
    
    return app;
  } catch (error) {
    console.error('Error initializing app:', error);
    
    // Show error in the loading container
    const loadingContainer = document.querySelector('.app-loading');
    if (loadingContainer) {
      loadingContainer.innerHTML = '<div>Error loading application. Please refresh the page.</div>';
    }
  }
}

export default initializeApp(); 