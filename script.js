// Global variables
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// DOM Elements
const addBtn = document.querySelector('.add-btn');
const notesGrid = document.querySelector('.notes-grid');
const noteTemplate = document.querySelector('#note-template');

let searchInput = document.querySelector('.search-input'); // Input field for searching notes


// Initialize the app
function init() {
    // Load saved notes
    renderNotes();
    searchNotes(); // Set up search functionality
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addNote);
}

//Function to generate randome colors 
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
