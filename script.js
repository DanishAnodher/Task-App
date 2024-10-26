// Global variables
let selectedColor = '#FFD686';
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let isColorPanelVisible = false;

// DOM Elements
const addBtn = document.querySelector('.add-btn');
const notesGrid = document.querySelector('.notes-grid');
const colorDots = document.querySelector('.color-dots');
const noteTemplate = document.querySelector('#note-template');

// Initialize the app
function init() {
    // Load saved notes
    renderNotes();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Toggle color panel on add button click
    addBtn.addEventListener('click', toggleColorPanel);

    // Color selection
    colorDots.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            selectedColor = e.target.dataset.color;
            addNote();
            hideColorPanel();
        }
    });

    // Hide color panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-btn') && 
            !e.target.classList.contains('dot') && 
            isColorPanelVisible) {
            hideColorPanel();
        }
    });
}

// Toggle color panel
function toggleColorPanel(e) {
    e.stopPropagation();
    isColorPanelVisible = !isColorPanelVisible;
    colorDots.style.display = isColorPanelVisible ? 'flex' : 'none';
}

// Hide color panel
function hideColorPanel() {
    isColorPanelVisible = false;
    colorDots.style.display = 'none';
}

// Add new note
function addNote() {
    const note = {
        id: Date.now(),
        content: 'New Note',
        color: selectedColor,
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

// Render all notes
function renderNotes() {
    notesGrid.innerHTML = '';
    
    notes.forEach(note => {
        const noteEl = noteTemplate.content.cloneNode(true);
        const noteCard = noteEl.querySelector('.note-card');
        
        // Set note properties
        noteCard.style.backgroundColor = note.color;
        noteCard.dataset.id = note.id;
        noteCard.querySelector('.note-content').textContent = note.content;
        noteCard.querySelector('.date').textContent = note.date;
        
        if (note.starred) {
            noteCard.querySelector('.star-btn').textContent = '★';
            noteCard.querySelector('.star-btn').classList.add('starred');
        }

        // Add event listeners
        setupNoteEventListeners(noteCard, note);
        
        notesGrid.appendChild(noteEl);
    });
}

// Set up event listeners for individual notes
function setupNoteEventListeners(noteCard, note) {
    const content = noteCard.querySelector('.note-content');
    const starBtn = noteCard.querySelector('.star-btn');
    const deleteBtn = noteCard.querySelector('.delete-btn');

    // Save content on input
    content.addEventListener('input', () => {
        note.content = content.textContent;
        saveNotes();
    });

    // Toggle star
    starBtn.addEventListener('click', () => {
        note.starred = !note.starred;
        starBtn.textContent = note.starred ? '★' : '☆';
        starBtn.classList.toggle('starred');
        saveNotes();
    });

    // Delete note
    deleteBtn.addEventListener('click', () => {
        notes = notes.filter(n => n.id !== note.id);
        saveNotes();
        renderNotes();
    });
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Initialize the app
init();