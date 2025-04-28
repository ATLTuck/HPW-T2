import Dexie from 'dexie';
import type { Table } from 'dexie';

// Define interfaces for our data models
export interface Contact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  favorite?: boolean;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  contactIds?: string[];
  taskIds?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDate?: Date;
  completedDate?: Date;
  projectId?: string;
  contactIds?: string[];
  relatedEntityType?: 'project' | 'contact' | 'invoice';
  relatedEntityId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  color?: string;
  projectId?: string;
  contactIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  relatedEntityType?: 'project' | 'contact' | 'task';
  relatedEntityId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id?: string;
  name: string;
  description?: string;
  fileData?: ArrayBuffer;
  fileType: string;
  fileSize: number;
  relatedEntityType?: 'project' | 'contact' | 'task';
  relatedEntityId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id?: string;
  number: string;
  contactId: string;
  projectId?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  tax?: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TimeEntry {
  id?: string;
  description: string;
  projectId?: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  billable: boolean;
  invoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id?: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'abandoned';
  startDate: Date;
  targetDate?: Date;
  completedDate?: Date;
  metrics?: GoalMetric[];
  relatedProjectIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalMetric {
  name: string;
  target: number;
  current: number;
  unit?: string;
}

// Dexie database class
export class CRMDatabase extends Dexie {
  contacts!: Table<Contact>;
  projects!: Table<Project>;
  tasks!: Table<Task>;
  events!: Table<Event>;
  notes!: Table<Note>;
  documents!: Table<Document>;
  invoices!: Table<Invoice>;
  timeEntries!: Table<TimeEntry>;
  goals!: Table<Goal>;

  constructor() {
    super('SolopreneurCRM');
    
    // Define tables and indexes
    this.version(1).stores({
      contacts: '++id, name, email, company, *tags, createdAt, updatedAt, favorite',
      projects: '++id, name, status, startDate, dueDate, completedDate, *contactIds, createdAt, updatedAt',
      tasks: '++id, title, status, priority, dueDate, projectId, *contactIds, relatedEntityType, relatedEntityId, createdAt, updatedAt',
      events: '++id, title, startDate, endDate, projectId, *contactIds, createdAt, updatedAt',
      notes: '++id, title, relatedEntityType, relatedEntityId, *tags, createdAt, updatedAt',
      documents: '++id, name, fileType, relatedEntityType, relatedEntityId, *tags, createdAt, updatedAt',
      invoices: '++id, number, contactId, projectId, status, issueDate, dueDate, paidDate, total, createdAt, updatedAt',
      timeEntries: '++id, projectId, taskId, startTime, endTime, duration, billable, invoiceId, createdAt, updatedAt',
      goals: '++id, title, status, startDate, targetDate, completedDate, *relatedProjectIds, createdAt, updatedAt'
    });
  }
}

// Create and export a singleton instance of the database
export const db = new CRMDatabase();

// Helper functions for common database operations
export const dbHelpers = {
  async getContactsByIds(ids: string[]): Promise<Contact[]> {
    return await db.contacts.where('id').anyOf(ids).toArray();
  },
  
  async getProjectsByIds(ids: string[]): Promise<Project[]> {
    return await db.projects.where('id').anyOf(ids).toArray();
  },
  
  async getTasksByProjectId(projectId: string): Promise<Task[]> {
    return await db.tasks.where('projectId').equals(projectId).toArray();
  },
  
  async getTasksByContactId(contactId: string): Promise<Task[]> {
    return await db.tasks.where('contactIds').equals([contactId]).or('contactIds').startsWith([contactId]).toArray();
  },
  
  async getNotesByEntity(entityType: 'project' | 'contact' | 'task', entityId: string): Promise<Note[]> {
    return await db.notes
      .where('relatedEntityType').equals(entityType)
      .and(note => note.relatedEntityId === entityId)
      .toArray();
  },
  
  async getDocumentsByEntity(entityType: 'project' | 'contact' | 'task', entityId: string): Promise<Document[]> {
    return await db.documents
      .where('relatedEntityType').equals(entityType)
      .and(doc => doc.relatedEntityId === entityId)
      .toArray();
  },
  
  async getTimeEntriesByProject(projectId: string): Promise<TimeEntry[]> {
    return await db.timeEntries.where('projectId').equals(projectId).toArray();
  },
  
  async getInvoicesByContact(contactId: string): Promise<Invoice[]> {
    return await db.invoices.where('contactId').equals(contactId).toArray();
  },
  
  async getInvoicesByProject(projectId: string): Promise<Invoice[]> {
    return await db.invoices.where('projectId').equals(projectId).toArray();
  },
  
  async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);
    
    return await db.tasks
      .where('status').noneOf(['completed'])
      .and(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= future;
      })
      .toArray();
  },
  
  async getEventsInRange(start: Date, end: Date): Promise<Event[]> {
    return await db.events
      .where('startDate').between(start, end, true, true)
      .or('endDate').between(start, end, true, true)
      .toArray();
  }
}; 