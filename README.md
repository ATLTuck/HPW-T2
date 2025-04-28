# Solopreneur CRM

A personal CRM application for solopreneurs and freelancers, with a beautiful macOS Big Sur-inspired dark mode interface. This application is designed to be used locally, with no authentication required.

## Features

- **Contact Management**: Store contacts with custom fields and tags
- **Project Tracking**: Manage projects with status, deadlines, and linked contacts
- **Task Management**: Create tasks with reminders and links to projects or contacts
- **Calendar View**: View deadlines and appointments with drag-and-drop support
- **Notes and Documents**: Attach rich notes or files to contacts and projects
- **Search**: Fast keyword and filter-based search across all data
- **Analytics**: Simple insights with completion rates and other metrics
- **Invoicing**: Create and track invoices with automatic reminders
- **Time Tracking**: Log and export time spent on projects and tasks
- **Goals and Milestones**: Set and track long-term goals

## Technical Implementation

The application is built using:

- **Frontend**: Svelte with TypeScript for a fast, reactive UI
- **Styling**: TailwindCSS for responsive design with custom macOS Big Sur styling
- **Database**: Dexie.js (IndexedDB wrapper) for fast, local-first storage
- **Charts**: Chart.js for analytics visualizations
- **Icons**: Lucide icons for a clean, consistent UI

## Design Principles

### Performance First

- Local-first data storage for instant access
- Efficient data structures and lazy loading
- Virtual lists for large datasets
- Optimized rendering and caching

### Emotional Design

- Dark mode for a calm, focused environment
- Satisfying micro-interactions and animations
- Professional yet approachable interface
- Visual feedback for completed tasks

### macOS Big Sur Aesthetic

- Deep blues and grays with colorful accents
- Frosted glass effects for sidebars and modals
- Rounded corners on cards and buttons
- Minimalist design with subtle animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   cd frontend
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Browser Support

The application uses modern web technologies and is designed to work best in:

- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+

## Future Enhancements

- Email integration
- Calendar sync with external calendars
- Export/import functionality
- Advanced reporting
- Mobile support

## License

MIT License 