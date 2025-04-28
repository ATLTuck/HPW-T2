import { db, type Contact, type Project, type Task, type Event } from './db';
import { v4 as uuidv4 } from 'uuid';

// Sample data generation for the CRM
export async function populateSampleData() {
  // Skip if we already have data
  const contactCount = await db.contacts.count();
  if (contactCount > 0) {
    console.log('Database already contains data. Skipping sample data generation.');
    return;
  }
  
  // Create sample contacts
  const contactIds = await createSampleContacts();
  
  // Create sample projects
  const projectIds = await createSampleProjects(contactIds);
  
  // Create sample tasks
  await createSampleTasks(projectIds, contactIds);
  
  // Create sample events
  await createSampleEvents(projectIds, contactIds);
  
  console.log('Sample data generated successfully!');
}

async function createSampleContacts(): Promise<string[]> {
  const contacts: Contact[] = [
    {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      company: 'Acme Corporation',
      title: 'Marketing Director',
      notes: 'Met at Tech Conference 2023. Interested in our marketing solutions.',
      tags: ['client', 'marketing'],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: true
    },
    {
      id: uuidv4(),
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      company: 'Globex Inc.',
      title: 'CEO',
      notes: 'Key decision maker. Prefers email communication.',
      tags: ['client', 'decision-maker'],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: true
    },
    {
      id: uuidv4(),
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '(555) 789-0123',
      company: 'Tech Innovators',
      title: 'Lead Developer',
      notes: 'Technical contact for the website redesign project.',
      tags: ['vendor', 'technical'],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    },
    {
      id: uuidv4(),
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '(555) 234-5678',
      company: 'Creative Solutions',
      title: 'Graphic Designer',
      notes: 'Works on all our design projects. Very skilled with branding.',
      tags: ['vendor', 'design'],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    },
    {
      id: uuidv4(),
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      phone: '(555) 345-6789',
      company: 'Acme Corporation',
      title: 'CTO',
      notes: 'Technical decision maker at Acme. Interested in our software solutions.',
      tags: ['client', 'technical', 'decision-maker'],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: true
    }
  ];
  
  // Add contacts to the database
  await db.contacts.bulkAdd(contacts);
  
  // Return contact IDs for reference
  return contacts.map(contact => contact.id!) as string[];
}

async function createSampleProjects(contactIds: string[]): Promise<string[]> {
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);
  
  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(today.getMonth() + 1);
  
  const projects: Project[] = [
    {
      id: uuidv4(),
      name: 'Website Redesign',
      description: 'Redesign and rebuild company website with modern technologies.',
      status: 'in-progress',
      startDate: new Date(today.setDate(today.getDate() - 30)),
      dueDate: oneMonthFromNow,
      contactIds: [contactIds[0], contactIds[2]],
      notes: 'Focus on mobile-first design and improved user experience.',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#0A84FF'
    },
    {
      id: uuidv4(),
      name: 'Marketing Campaign',
      description: 'Q3 marketing campaign for new product launch.',
      status: 'planning',
      startDate: today,
      dueDate: oneMonthFromNow,
      contactIds: [contactIds[0], contactIds[1]],
      notes: 'Budget approved. Need to finalize creative assets.',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#FF9F0A'
    },
    {
      id: uuidv4(),
      name: 'Client Onboarding',
      description: 'Onboarding process for new client Globex Inc.',
      status: 'in-progress',
      startDate: new Date(today.setDate(today.getDate() - 5)),
      dueDate: oneWeekFromNow,
      contactIds: [contactIds[1]],
      notes: 'Need to schedule kickoff meeting and gather requirements.',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#30D158'
    }
  ];
  
  // Add projects to the database
  await db.projects.bulkAdd(projects);
  
  // Return project IDs for reference
  return projects.map(project => project.id!) as string[];
}

async function createSampleTasks(projectIds: string[], contactIds: string[]) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const tasks: Task[] = [
    {
      id: uuidv4(),
      title: 'Create wireframes for website redesign',
      description: 'Design initial wireframes for the homepage and product pages.',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(today.setDate(today.getDate() - 5)),
      completedDate: new Date(today.setDate(today.getDate() - 3)),
      projectId: projectIds[0],
      contactIds: [contactIds[3]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Develop homepage prototype',
      description: 'Create working prototype of the new homepage based on approved wireframes.',
      status: 'in-progress',
      priority: 'high',
      dueDate: tomorrow,
      projectId: projectIds[0],
      contactIds: [contactIds[2]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Content audit of existing site',
      description: 'Review all content on current website and identify what needs to be updated.',
      status: 'todo',
      priority: 'medium',
      dueDate: nextWeek,
      projectId: projectIds[0],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Create marketing campaign brief',
      description: 'Draft brief for the Q3 marketing campaign including goals, target audience, and channels.',
      status: 'todo',
      priority: 'high',
      dueDate: tomorrow,
      projectId: projectIds[1],
      contactIds: [contactIds[0]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Kickoff meeting with Globex team',
      description: 'Initial kickoff meeting to discuss project scope, timeline, and deliverables.',
      status: 'todo',
      priority: 'high',
      dueDate: tomorrow,
      projectId: projectIds[2],
      contactIds: [contactIds[1]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Prepare client onboarding documents',
      description: 'Gather and prepare all necessary onboarding documents for Globex Inc.',
      status: 'in-progress',
      priority: 'medium',
      dueDate: dayAfterTomorrow,
      projectId: projectIds[2],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Add tasks to the database
  await db.tasks.bulkAdd(tasks);
}

async function createSampleEvents(projectIds: string[], contactIds: string[]) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(11, 0, 0, 0);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  dayAfterTomorrow.setHours(14, 0, 0, 0);
  
  const dayAfterTomorrowEnd = new Date(dayAfterTomorrow);
  dayAfterTomorrowEnd.setHours(15, 30, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(9, 0, 0, 0);
  
  const events: Event[] = [
    {
      id: uuidv4(),
      title: 'Website Redesign Status Meeting',
      description: 'Weekly status meeting to discuss progress on the website redesign project.',
      startDate: tomorrow,
      endDate: tomorrowEnd,
      allDay: false,
      location: 'Zoom',
      color: '#0A84FF',
      projectId: projectIds[0],
      contactIds: [contactIds[0], contactIds[2]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Marketing Campaign Planning',
      description: 'Initial planning session for the Q3 marketing campaign.',
      startDate: dayAfterTomorrow,
      endDate: dayAfterTomorrowEnd,
      allDay: false,
      location: 'Conference Room A',
      color: '#FF9F0A',
      projectId: projectIds[1],
      contactIds: [contactIds[0]],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Globex Inc. Kickoff Meeting',
      description: 'Initial kickoff meeting with Globex team to discuss project scope and timeline.',
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 60 * 60 * 1000), // 1 hour later
      allDay: false,
      location: 'Client Office',
      color: '#30D158',
      projectId: projectIds[2],
      contactIds: [contactIds[1]],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Add events to the database
  await db.events.bulkAdd(events);
} 