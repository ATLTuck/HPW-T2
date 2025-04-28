<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Contact } from '../lib/db';
  import { Search, Plus, User, Mail, Phone, Briefcase, Tag, Star, Filter } from 'lucide-svelte';
  import { v4 as uuidv4 } from 'uuid';

  // Contacts state
  let contacts: Contact[] = [];
  let filteredContacts: Contact[] = [];
  let selectedContact: Contact | null = null;
  let isCreating = false;
  let isEditing = false;
  
  // Search and filter
  let searchQuery = '';
  let showFilters = false;
  let tagFilter: string[] = [];
  let companyFilter = '';
  let favoriteFilter = false;
  
  // Create/Edit form
  let formContact: Contact = createEmptyContact();
  
  // Tags for select dropdown
  let availableTags: string[] = [];
  
  function createEmptyContact(): Contact {
    return {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      notes: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      favorite: false
    };
  }
  
  onMount(async () => {
    await loadContacts();
  });
  
  async function loadContacts() {
    try {
      contacts = await db.contacts.toArray();
      filteredContacts = [...contacts];
      applyFilters();
      
      // Extract unique tags
      const tags = new Set<string>();
      contacts.forEach(contact => {
        if (contact.tags) {
          contact.tags.forEach(tagValue => tags.add(tagValue));
        }
      });
      availableTags = Array.from(tags);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }
  
  function applyFilters() {
    filteredContacts = contacts.filter(contact => {
      // Search query filter
      const searchString = `${contact.name} ${contact.email || ''} ${contact.phone || ''} ${contact.company || ''} ${contact.title || ''}`.toLowerCase();
      const matchesSearch = !searchQuery || searchString.includes(searchQuery.toLowerCase());
      
      // Tag filter
      const matchesTags = tagFilter.length === 0 || 
        (contact.tags && tagFilter.every(tag => contact.tags!.includes(tag)));
      
      // Company filter
      const matchesCompany = !companyFilter || 
        (contact.company && contact.company.toLowerCase().includes(companyFilter.toLowerCase()));
      
      // Favorite filter
      const matchesFavorite = !favoriteFilter || contact.favorite;
      
      return matchesSearch && matchesTags && matchesCompany && matchesFavorite;
    });
  }
  
  function handleSearch() {
    applyFilters();
  }
  
  function toggleFilters() {
    showFilters = !showFilters;
  }
  
  function resetFilters() {
    tagFilter = [];
    companyFilter = '';
    favoriteFilter = false;
    applyFilters();
  }
  
  function selectContact(contact: Contact) {
    selectedContact = contact;
    isCreating = false;
    isEditing = false;
  }
  
  function startCreateContact() {
    formContact = createEmptyContact();
    isCreating = true;
    isEditing = false;
    selectedContact = null;
  }
  
  function startEditContact() {
    if (!selectedContact) return;
    formContact = { ...selectedContact };
    isEditing = true;
    isCreating = false;
  }
  
  async function saveContact() {
    try {
      formContact.updatedAt = new Date();
      
      if (isCreating) {
        formContact.id = uuidv4();
        formContact.createdAt = new Date();
        await db.contacts.add(formContact);
      } else if (isEditing && selectedContact && selectedContact.id) {
        await db.contacts.update(selectedContact.id, formContact);
      }
      
      await loadContacts();
      isCreating = false;
      isEditing = false;
      
      // Select the contact we just saved
      if (formContact.id) {
        const savedContact = await db.contacts.get(formContact.id);
        if (savedContact) {
          selectedContact = savedContact;
        }
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  }
  
  async function deleteContact() {
    if (!selectedContact || !selectedContact.id || !confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await db.contacts.delete(selectedContact.id);
      await loadContacts();
      selectedContact = null;
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  }
  
  function toggleFavorite(contactItem: Contact) {
    if (!contactItem.id) return;
    
    db.contacts.update(contactItem.id, { favorite: !contactItem.favorite })
      .then(() => loadContacts())
      .catch(error => console.error('Error toggling favorite:', error));
  }
  
  function addTag() {
    if (!formContact.tags) {
      formContact.tags = [];
    }
    formContact.tags = [...formContact.tags, ''];
  }
  
  function removeTag(index: number) {
    if (!formContact.tags) return;
    formContact.tags = formContact.tags.filter((_, i) => i !== index);
  }
</script>

<div class="h-full flex flex-col">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Contacts</h1>
    
    <div class="flex items-center space-x-2">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} class="text-macos-text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          class="pl-10 pr-4 py-2"
          bind:value={searchQuery}
          on:input={handleSearch}
        />
      </div>
      
      <button class="flex items-center" on:click={toggleFilters}>
        <Filter size={16} class="mr-1" />
        Filters
      </button>
      
      <button class="bg-macos-blue text-white flex items-center px-3 py-2 rounded-full" on:click={startCreateContact}>
        <Plus size={16} class="mr-1" />
        New Contact
      </button>
    </div>
  </div>
  
  {#if showFilters}
    <div class="glass-card p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Filters</h3>
        <button class="text-sm text-macos-blue" on:click={resetFilters}>Reset</button>
      </div>
      
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label for="company-filter" class="block text-sm mb-1">Company</label>
          <input id="company-filter" type="text" bind:value={companyFilter} on:input={applyFilters} />
        </div>
        
        <div>
          <label for="tag-filter" class="block text-sm mb-1">Tags</label>
          <select id="tag-filter" multiple bind:value={tagFilter} on:change={applyFilters} class="w-full h-20">
            {#each availableTags as tag}
              <option value={tag}>{tag}</option>
            {/each}
          </select>
        </div>
        
        <div class="flex items-center">
          <input type="checkbox" id="favorite-filter" bind:checked={favoriteFilter} on:change={applyFilters} class="mr-2" />
          <label for="favorite-filter">Favorite contacts only</label>
        </div>
      </div>
    </div>
  {/if}
  
  <div class="flex-1 flex overflow-hidden">
    <!-- Contact List -->
    <div class="w-1/3 pr-4 overflow-y-auto">
      {#if filteredContacts.length > 0}
        <div class="space-y-2">
          {#each filteredContacts as contact (contact.id)}
            <button 
              class="w-full text-left glass-card p-3 flex items-center {selectedContact?.id === contact.id ? 'border-macos-blue' : ''}"
              on:click={() => selectContact(contact)}
              on:keydown={e => e.key === 'Enter' && selectContact(contact)}
              aria-selected={selectedContact?.id === contact.id}
            >
              <div class="bg-macos-sidebar w-10 h-10 rounded-full flex items-center justify-center mr-3">
                {#if contact.avatar}
                  <img src={contact.avatar} alt={contact.name} class="w-10 h-10 rounded-full" />
                {:else}
                  <User size={20} class="text-macos-text-secondary" />
                {/if}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{contact.name}</div>
                {#if contact.company}
                  <div class="text-sm text-macos-text-secondary truncate">{contact.company}</div>
                {/if}
              </div>
              
              {#if contact.favorite}
                <Star size={16} class="text-macos-yellow flex-shrink-0" />
              {/if}
            </button>
          {/each}
        </div>
      {:else}
        <div class="text-center py-10 text-macos-text-secondary">
          {searchQuery || tagFilter.length > 0 || companyFilter || favoriteFilter 
            ? 'No contacts match your filters'
            : 'No contacts yet'}
        </div>
      {/if}
    </div>
    
    <!-- Contact Detail -->
    <div class="flex-1 overflow-y-auto glass-card p-6 flex flex-col">
      {#if selectedContact && !isCreating && !isEditing}
        <div class="flex justify-between mb-4">
          <div class="flex items-center">
            <div class="bg-macos-sidebar w-16 h-16 rounded-full flex items-center justify-center mr-4">
              {#if selectedContact.avatar}
                <img src={selectedContact.avatar} alt={selectedContact.name} class="w-16 h-16 rounded-full" />
              {:else}
                <User size={32} class="text-macos-text-secondary" />
              {/if}
            </div>
            
            <div>
              <h2 class="text-2xl font-bold">{selectedContact.name}</h2>
              {#if selectedContact.title}
                <div class="text-macos-text-secondary">{selectedContact.title}</div>
              {/if}
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              class="text-macos-yellow"
              on:click={() => {
                if (selectedContact) toggleFavorite(selectedContact);
              }}
            >
              <Star size={20} class={selectedContact.favorite ? 'fill-current' : ''} />
            </button>
            
            <button class="bg-macos-blue text-white px-3 py-1 rounded-full" on:click={startEditContact}>
              Edit
            </button>
            
            <button class="bg-macos-red text-white px-3 py-1 rounded-full" on:click={deleteContact}>
              Delete
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6 mb-6">
          {#if selectedContact.email}
            <div class="flex items-center">
              <Mail size={18} class="text-macos-blue mr-2" />
              <a href={`mailto:${selectedContact.email}`} class="text-macos-blue">{selectedContact.email}</a>
            </div>
          {/if}
          
          {#if selectedContact.phone}
            <div class="flex items-center">
              <Phone size={18} class="text-macos-green mr-2" />
              <a href={`tel:${selectedContact.phone}`} class="text-macos-green">{selectedContact.phone}</a>
            </div>
          {/if}
          
          {#if selectedContact.company}
            <div class="flex items-center">
              <Briefcase size={18} class="text-macos-purple mr-2" />
              <span>{selectedContact.company}</span>
            </div>
          {/if}
        </div>
        
        {#if selectedContact.tags && selectedContact.tags.length > 0}
          <div class="mb-6">
            <h3 class="text-sm font-medium mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each selectedContact.tags as tag}
                <div class="bg-macos-control px-2 py-1 rounded-full text-sm flex items-center">
                  <Tag size={12} class="mr-1" />
                  {tag}
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if selectedContact.notes}
          <div>
            <h3 class="text-sm font-medium mb-2">Notes</h3>
            <div class="glass-card p-3 bg-opacity-50">
              {selectedContact.notes}
            </div>
          </div>
        {/if}
      {:else if isCreating || isEditing}
        <!-- Contact Form -->
        <div>
          <h2 class="text-2xl font-bold mb-6">{isCreating ? 'Create New Contact' : 'Edit Contact'}</h2>
          
          <div class="space-y-4 mb-6">
            <div>
              <label for="contact-name" class="block text-sm mb-1">Name</label>
              <input id="contact-name" type="text" bind:value={formContact.name} class="w-full" required />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="contact-email" class="block text-sm mb-1">Email</label>
                <input id="contact-email" type="email" bind:value={formContact.email} class="w-full" />
              </div>
              
              <div>
                <label for="contact-phone" class="block text-sm mb-1">Phone</label>
                <input id="contact-phone" type="tel" bind:value={formContact.phone} class="w-full" />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="contact-company" class="block text-sm mb-1">Company</label>
                <input id="contact-company" type="text" bind:value={formContact.company} class="w-full" />
              </div>
              
              <div>
                <label for="contact-title" class="block text-sm mb-1">Job Title</label>
                <input id="contact-title" type="text" bind:value={formContact.title} class="w-full" />
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm">Tags</label>
                <button class="text-sm text-macos-blue" on:click={addTag}>+ Add Tag</button>
              </div>
              
              {#if formContact.tags && formContact.tags.length > 0}
                <div class="space-y-2">
                  {#each formContact.tags as _, i}
                    <div class="flex items-center">
                      <input 
                        id={`tag-${i}`} 
                        type="text" 
                        bind:value={formContact.tags[i]} 
                        class="w-full mr-2" 
                        aria-label={`Tag ${i+1}`}
                      />
                      <button class="text-macos-red" on:click={() => removeTag(i)}>×</button>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-sm text-macos-text-secondary italic">No tags</div>
              {/if}
            </div>
            
            <div>
              <label for="contact-notes" class="block text-sm mb-1">Notes</label>
              <textarea id="contact-notes" bind:value={formContact.notes} class="w-full h-24 resize-none"></textarea>
            </div>
            
            <div class="flex items-center">
              <input type="checkbox" id="contact-favorite" bind:checked={formContact.favorite} class="mr-2" />
              <label for="contact-favorite" class="flex items-center">
                <Star size={16} class="text-macos-yellow mr-1" />
                Mark as favorite
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              class="bg-macos-control px-4 py-2 rounded-full"
              on:click={() => {
                isCreating = false;
                isEditing = false;
              }}
            >
              Cancel
            </button>
            
            <button 
              class="bg-macos-blue text-white px-4 py-2 rounded-full"
              on:click={saveContact}
            >
              Save
            </button>
          </div>
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center flex-1 text-macos-text-secondary">
          <User size={64} />
          <p class="mt-4 text-xl">Select a contact or create a new one</p>
          <button 
            class="mt-4 bg-macos-blue text-white flex items-center px-3 py-2 rounded-full"
            on:click={startCreateContact}
          >
            <Plus size={16} class="mr-1" />
            New Contact
          </button>
        </div>
      {/if}
    </div>
  </div>
</div> 