// Constants
const STORAGE_KEY = 'notes';

// DOM Elements
const addBtn = document.querySelector('.add-btn');
const notesGrid = document.querySelector('.notes-grid');
const noteTemplate = document.querySelector('#note-template');
const searchInput = document.querySelector('.search-input');

// State Management
let notes = [];

// Initialize the app
function init() {
    loadNotes();
    renderNotes();
    setupEventListeners();
    setupSearch();
}

// Load notes from localStorage with error handling
function loadNotes() {
    try {
        notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error('Error loading notes:', error);
        notes = [];
    }
}

// Set up event listeners
function setupEventListeners() {
    addBtn?.addEventListener('click', addNote);
    
    // Handle errors from the message channel
    window.addEventListener('error', (event) => {
        if (event.message.includes('message channel closed')) {
            console.warn('Message channel closed unexpectedly');
        }
    });
}

// Set up search functionality
function setupSearch() {
    searchInput?.addEventListener('input', debounce(searchNotes, 300));
}

// Search notes
function searchNotes() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const filteredNotes = notes.filter(note => 
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
}

// Generate random color
function getRandomColor() {
    return '#' + Array.from({ length: 6 }, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

// Add new note
function addNote() {
    const note = {
        id: Date.now(),
        content: 'New Note',
        color: getRandomColor(),
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        starred: false
    };

    notes.unshift(note);
    saveNotes();
    renderNotes();
}

// Render notes
function renderNotes(notesToRender = notes) {
    if (!notesGrid) return;
    
    notesGrid.innerHTML = '';
    
    notesToRender.forEach(note => {
        const noteEl = noteTemplate?.content.cloneNode(true);
        if (!noteEl) return;

        const noteCard = noteEl.querySelector('.note-card');
        if (!noteCard) return;

        // Set note properties
        noteCard.style.backgroundColor = note.color;
        noteCard.dataset.id = note.id;
        
        const contentEl = noteCard.querySelector('.note-content');
        if (contentEl) contentEl.textContent = note.content;
        
        const dateEl = noteCard.querySelector('.date');
        if (dateEl) dateEl.textContent = note.date;

        const starBtn = noteCard.querySelector('.star-btn');
        if (starBtn) {
            starBtn.textContent = note.starred ? '★' : '☆';
            if (note.starred) starBtn.classList.add('starred');
        }

        setupNoteEventListeners(noteCard, note);
        notesGrid.appendChild(noteEl);
    });
}

// Set up event listeners for individual notes
function setupNoteEventListeners(noteCard, note) {
    const content = noteCard.querySelector('.note-content');
    const starBtn = noteCard.querySelector('.star-btn');
    const deleteBtn = noteCard.querySelector('.delete-btn');

    content?.addEventListener('input', () => {
        note.content = content.textContent || '';
        saveNotes();
    });

    starBtn?.addEventListener('click', () => {
        note.starred = !note.starred;
        starBtn.textContent = note.starred ? '★' : '☆';
        starBtn.classList.toggle('starred');
        saveNotes();
    });

    deleteBtn?.addEventListener('click', () => {
        notes = notes.filter(n => n.id !== note.id);
        saveNotes();
        renderNotes();
    });
}

// Save notes to localStorage with error handling
function saveNotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error('Error saving notes:', error);
    }
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);