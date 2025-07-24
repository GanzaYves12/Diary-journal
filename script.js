// Daily Journal Web App JavaScript

// DOM Elements
const datePicker = document.getElementById('datePicker');
const entryText = document.getElementById('entryText');
const saveBtn = document.getElementById('saveBtn');
const entriesList = document.getElementById('entriesList');
const clearAllBtn = document.getElementById('clearAllBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

let currentDate = getTodayDate();
let isDirty = false; // Track if current entry has unsaved changes

// Initialize app
function init() {
  // Set date picker to today by default
  datePicker.value = currentDate;

  // Load entry for today
  loadEntry(currentDate);

  // Populate entries list
  refreshEntriesList();

  // Load theme preference
  loadTheme();

  // Event listeners
  datePicker.addEventListener('change', onDateChange);
  saveBtn.addEventListener('click', onSave);
  entryText.addEventListener('input', onEntryInput);
  clearAllBtn.addEventListener('click', onClearAll);
  themeToggleBtn.addEventListener('click', onThemeToggle);
  window.addEventListener('beforeunload', onBeforeUnload);
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Load entry from localStorage for given date
function loadEntry(date) {
  const entry = localStorage.getItem(date);
  entryText.value = entry || '';
  isDirty = false;
}

// Save entry to localStorage for given date
function saveEntry(date, text) {
  if (text.trim() === '') {
    // If empty, remove entry
    localStorage.removeItem(date);
  } else {
    localStorage.setItem(date, text);
  }
  isDirty = false;
  refreshEntriesList();
}

// Refresh the list of past entries
function refreshEntriesList() {
  entriesList.innerHTML = '';
  // Get all keys (dates) from localStorage and sort descending
  const dates = Object.keys(localStorage).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
  dates.sort((a, b) => b.localeCompare(a));
  if (dates.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No entries yet.';
    li.tabIndex = -1;
    entriesList.appendChild(li);
    return;
  }
  dates.forEach(date => {
    const li = document.createElement('li');
    li.textContent = date;
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.addEventListener('click', () => onEntrySelect(date));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEntrySelect(date);
      }
    });
    entriesList.appendChild(li);
  });
}

// Handle date picker change
function onDateChange() {
  if (isDirty) {
    const confirmLeave = confirm('You have unsaved changes. Do you want to discard them?');
    if (!confirmLeave) {
      // Revert date picker to currentDate
      datePicker.value = currentDate;
      return;
    }
  }
  currentDate = datePicker.value;
  loadEntry(currentDate);
}

// Handle save button click
function onSave() {
  saveEntry(currentDate, entryText.value);
  alert('Entry saved.');
}

// Handle entry text input
function onEntryInput() {
  isDirty = true;
}

// Handle selecting an entry from the list
function onEntrySelect(date) {
  if (isDirty) {
    const confirmLeave = confirm('You have unsaved changes. Do you want to discard them?');
    if (!confirmLeave) {
      return;
    }
  }
  currentDate = date;
  datePicker.value = currentDate;
  loadEntry(currentDate);
}

// Handle clear all button click
function onClearAll() {
  const confirmClear = confirm('Are you sure you want to clear all entries? This action cannot be undone.');
  if (confirmClear) {
    // Remove all date keys from localStorage
    const keys = Object.keys(localStorage).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
    keys.forEach(key => localStorage.removeItem(key));
    // Reset editor and list
    entryText.value = '';
    isDirty = false;
    currentDate = getTodayDate();
    datePicker.value = currentDate;
    refreshEntriesList();
    alert('All entries cleared.');
  }
}

// Handle theme toggle button click
function onThemeToggle() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

// Set theme and save preference
function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', theme);
}

// Load theme preference from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

// Prompt user if leaving with unsaved changes
function onBeforeUnload(e) {
  if (isDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
}

// Initialize app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);
