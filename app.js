// --- ICONS ---
const icons = {
  brain: `<svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-3.38 19.54" /><path d="M12 2a10 10 0 0 1 8.54 5.9" /><path d="M22 12a10 10 0 0 1-5.9 8.54" /><path d="M2.46 12a10 10 0 0 1 8.8-9.94" /><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /><path d="M12 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" /><path d="m14.5 4.5 4-2" /><path d="m14.5 19.5 4 2" /><path d="m9.5 4.5-4-2" /><path d="m9.5 19.5-4 2" /></svg>`,
  plus: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>`,
  cog: `<svg class="cog-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>`,
  bell: `<svg class="icon" style="width: 3rem; height: 3rem; margin: 0 auto 1rem; color: #64748b;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`,
  calendarClock: `<svg class="list-header-icon overdue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75v6l4.5 2.25" /></svg>`,
  checkCircle: `<svg class="list-header-icon due-today" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  calendarDays: `<svg class="list-header-icon upcoming" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75zM8.25 8.25h.008v.008H8.25V8.25zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25V8.25zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25V8.25zm0 3h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008z" /></svg>`,
  badgeCheck: `<svg class="list-header-icon mastered" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  archiveBox: `<svg class="list-header-icon archived" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`,
  trash: `<svg class="clear-button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`,
  // Card icons
  levelUp: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18" /><path d="M5 16h2" /><path d="M9 12h2" /><path d="M13 8h2" /><path d="M17 4h2" /></svg>`,
  calendar: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75z" /></svg>`,
  list: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`,
  pencil: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
  check: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`,
  restore: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>`,
};

// --- CONSTANTS ---
const REVISION_INTERVALS = [1, 2, 4, 7, 14, 30, 60, 120];
const AUTO_DELETE_DAYS = 7;

// --- DATE UTILS ---
const getDaysUntil = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// --- DOM ELEMENTS ---
const dom = {
    // Add form
    addItemForm: document.getElementById('add-item-form'),
    titleInput: document.getElementById('item-title'),
    intervalsInput: document.getElementById('intervals'),
    addItemBtn: document.getElementById('add-item-btn'),
    toggleAdvancedBtn: document.getElementById('toggle-advanced-btn'),
    advancedOptions: document.getElementById('advanced-options'),
    // Lists
    revisionListsContainer: document.getElementById('revision-lists'),
    noItemsMessage: document.getElementById('no-items-message'),
    overdueList: document.getElementById('overdue-list'),
    dueTodayList: document.getElementById('due-today-list'),
    upcomingList: document.getElementById('upcoming-list'),
    completedList: document.getElementById('completed-list'),
    archivedList: document.getElementById('archived-list'),
    // List Sections
    overdueSection: document.getElementById('overdue-section'),
    dueTodaySection: document.getElementById('due-today-section'),
    upcomingSection: document.getElementById('upcoming-section'),
    completedSection: document.getElementById('completed-section'),
    archivedSection: document.getElementById('archived-section'),
    // Toggle buttons
    completedToggleContainer: document.getElementById('completed-toggle-container'),
    toggleCompletedBtn: document.getElementById('toggle-completed-btn'),
    archivedToggleContainer: document.getElementById('archived-toggle-container'),
    toggleArchivedBtn: document.getElementById('toggle-archived-btn'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
};

// --- STATE ---
let items = [];
let showArchived = false;
let showCompleted = false;

const loadState = () => {
  const storedItems = localStorage.getItem('revisionItems');
  if (storedItems) {
    items = JSON.parse(storedItems);
  }
  // Auto-delete old archived items on load
  const now = new Date();
  const itemsToKeep = items.filter(item => {
    if (!item.archivedAt) return true;
    const deletionDate = addDays(new Date(item.archivedAt), AUTO_DELETE_DAYS);
    return now < deletionDate;
  });
  if (itemsToKeep.length < items.length) {
    items = itemsToKeep;
    saveState();
  }
};

const saveState = () => {
  localStorage.setItem('revisionItems', JSON.stringify(items));
};


// --- RENDER ---
const createItemCardHTML = (item) => {
    if (item.isEditing) {
        return `
            <div class="editing-card" data-id="${item.id}">
              <div class="editing-card-content">
                <input type="text" class="form-input" value="${item.title}" data-action="update-title-input">
                <div class="editing-card-actions">
                    <button class="cancel-button" data-action="cancel-edit">Cancel</button>
                    <button class="button primary-button" data-action="save-edit">Save</button>
                </div>
              </div>
            </div>`;
    }

    if (item.archivedAt) {
        const daysUntilDeletion = getDaysUntil(addDays(new Date(item.archivedAt), AUTO_DELETE_DAYS).toISOString());
        return `
            <div class="revision-item-card archived-card" data-id="${item.id}">
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-metadata">Archived on ${formatDate(item.archivedAt)}. Auto-deletes ${daysUntilDeletion < 1 ? 'today' : `in ${daysUntilDeletion} days`}.</p>
                </div>
                <div class="card-actions">
                    <button class="restore-button" data-action="restore">
                        ${icons.restore}
                        <span>Restore</span>
                    </button>
                    <button class="icon-button delete" data-action="delete" aria-label="Delete permanently">${icons.trash}</button>
                </div>
            </div>`;
    }

    if (item.completedAt) {
        return `
            <div class="revision-item-card completed-card" data-id="${item.id}">
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-metadata">
                        <div class="metadata-item">
                           ${icons.badgeCheck.replace('list-header-icon mastered', 'icon')}
                           <span>Mastered on ${formatDate(item.completedAt)}.</span>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="icon-button delete" data-action="delete" aria-label="Delete permanently">${icons.trash}</button>
                </div>
            </div>`;
    }

    const daysUntil = getDaysUntil(item.nextRevisionDate);
    let statusClass = 'status-upcoming';
    let statusText = `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
    if (daysUntil < 0) {
        statusClass = 'status-overdue';
        statusText = `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'}`;
    } else if (daysUntil === 0) {
        statusClass = 'status-due-today';
        statusText = 'Due today';
    }

    return `
        <div class="revision-item-card ${statusClass}" data-id="${item.id}">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-metadata">
                    <div class="metadata-item" title="Current Level">${icons.levelUp}<span>Level ${item.level}</span></div>
                    <div class="metadata-item" title="Next Revision Date">${icons.calendar}<span>${formatDate(item.nextRevisionDate)} (${statusText})</span></div>
                    <div class="metadata-item" title="Revision Pattern">${icons.list}<span>${item.revisionIntervals.join(', ')}</span></div>
                </div>
            </div>
            <div class="card-actions">
                <button class="icon-button edit" data-action="edit" aria-label="Edit title">${icons.pencil}</button>
                <button class="icon-button archive" data-action="archive" aria-label="Archive item">${icons.archiveBox.replace('list-header-icon archived', 'icon')}</button>
                <button class="icon-button delete" data-action="delete" aria-label="Delete permanently">${icons.trash}</button>
                <button class="button" data-action="complete">${icons.check}<span>Complete</span></button>
            </div>
        </div>`;
};


const render = () => {
    const activeItems = items.filter(item => !item.completedAt && !item.archivedAt);
    const completedItems = items.filter(item => item.completedAt && !item.archivedAt);
    const archivedItems = items.filter(item => item.archivedAt);

    // Group active items
    const overdue = activeItems.filter(item => getDaysUntil(item.nextRevisionDate) < 0).sort((a, b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate));
    const dueToday = activeItems.filter(item => getDaysUntil(item.nextRevisionDate) === 0);
    const upcoming = activeItems.filter(item => getDaysUntil(item.nextRevisionDate) > 0).sort((a, b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate));

    // Clear lists
    dom.overdueList.innerHTML = '';
    dom.dueTodayList.innerHTML = '';
    dom.upcomingList.innerHTML = '';
    dom.completedList.innerHTML = '';
    dom.archivedList.innerHTML = '';

    // Populate lists
    overdue.forEach(item => dom.overdueList.innerHTML += createItemCardHTML(item));
    dueToday.forEach(item => dom.dueTodayList.innerHTML += createItemCardHTML(item));
    upcoming.forEach(item => dom.upcomingList.innerHTML += createItemCardHTML(item));

    completedItems.sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt))
                  .forEach(item => dom.completedList.innerHTML += createItemCardHTML(item));

    archivedItems.sort((a,b) => new Date(b.archivedAt) - new Date(a.archivedAt))
                 .forEach(item => dom.archivedList.innerHTML += createItemCardHTML(item));

    // Show/hide sections
    dom.overdueSection.style.display = overdue.length > 0 ? 'block' : 'none';
    dom.dueTodaySection.style.display = dueToday.length > 0 ? 'block' : 'none';
    dom.upcomingSection.style.display = upcoming.length > 0 ? 'block' : 'none';

    // Handle visibility of toggle buttons and sections
    dom.completedToggleContainer.style.display = completedItems.length > 0 ? 'block' : 'none';
    dom.archivedToggleContainer.style.display = archivedItems.length > 0 ? 'block' : 'none';

    dom.toggleCompletedBtn.textContent = `${showCompleted ? 'Hide' : 'Show'} ${completedItems.length} Mastered Item(s)`;
    dom.completedSection.style.display = showCompleted && completedItems.length > 0 ? 'block' : 'none';

    dom.toggleArchivedBtn.textContent = `${showArchived ? 'Hide' : 'Show'} ${archivedItems.length} Archived Item(s)`;
    dom.archivedSection.style.display = showArchived && archivedItems.length > 0 ? 'block' : 'none';

    // Show "No Items" message if all lists are empty
    const allItems = overdue.length + dueToday.length + upcoming.length + completedItems.length + archivedItems.length;
    dom.noItemsMessage.style.display = allItems === 0 ? 'block' : 'none';
};

// --- EVENT HANDLERS ---
const setupEventListeners = () => {
    dom.titleInput.addEventListener('input', () => {
        dom.addItemBtn.disabled = !dom.titleInput.value.trim();
    });

    dom.toggleAdvancedBtn.addEventListener('click', () => {
        const isHidden = dom.advancedOptions.style.display === 'none';
        dom.advancedOptions.style.display = isHidden ? 'block' : 'none';
    });

    dom.addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = dom.titleInput.value.trim();
        const intervals = dom.intervalsInput.value
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n) && n > 0);

        if (title && intervals.length > 0) {
            const now = new Date();
            const newItem = {
                id: crypto.randomUUID(),
                title,
                level: 0,
                lastRevisionDate: now.toISOString(),
                nextRevisionDate: addDays(now, intervals[0]).toISOString(),
                createdAt: now.toISOString(),
                revisionIntervals: intervals,
            };
            items.push(newItem);
            saveState();
            render();

            // Reset form
            dom.titleInput.value = '';
            dom.intervalsInput.value = REVISION_INTERVALS.join(', ');
            dom.addItemBtn.disabled = true;
            dom.advancedOptions.style.display = 'none';
        }
    });

    dom.toggleCompletedBtn.addEventListener('click', () => {
        showCompleted = !showCompleted;
        render();
    });

    dom.toggleArchivedBtn.addEventListener('click', () => {
        showArchived = !showArchived;
        render();
    });

    dom.clearCompletedBtn.addEventListener('click', () => {
        items = items.filter(item => !item.completedAt || item.archivedAt);
        saveState();
        render();
    });

    dom.revisionListsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const card = target.closest('.revision-item-card, .editing-card');
        const id = card?.dataset.id;
        if (!id) return;

        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        switch (action) {
            case 'complete':
                const item = items[itemIndex];
                const newLevel = item.level + 1;
                const now = new Date();
                if (newLevel >= item.revisionIntervals.length) {
                    item.completedAt = now.toISOString();
                } else {
                    item.level = newLevel;
                    item.lastRevisionDate = now.toISOString();
                    item.nextRevisionDate = addDays(now, item.revisionIntervals[newLevel]).toISOString();
                }
                break;
            case 'archive':
                items[itemIndex].archivedAt = new Date().toISOString();
                break;
            case 'delete':
                items.splice(itemIndex, 1);
                break;
            case 'restore':
                delete items[itemIndex].archivedAt;
                break;
            case 'edit':
                items[itemIndex].isEditing = true;
                break;
            case 'cancel-edit':
                delete items[itemIndex].isEditing;
                break;
            case 'save-edit':
                const newTitle = card.querySelector('[data-action="update-title-input"]').value.trim();
                if (newTitle) {
                    items[itemIndex].title = newTitle;
                }
                delete items[itemIndex].isEditing;
                break;
        }

        saveState();
        render();
    });
};


// --- INIT ---
const init = () => {
  // Insert header icons
  document.querySelector('.header-content').insertAdjacentHTML('afterbegin', icons.brain);
  document.querySelector('#toggle-advanced-btn').innerHTML = icons.cog;
  document.querySelector('#add-item-btn').insertAdjacentHTML('afterbegin', icons.plus);

  // Insert list header icons
  document.querySelector('#no-items-message').insertAdjacentHTML('afterbegin', icons.bell);
  document.querySelector('#overdue-section h2').insertAdjacentHTML('afterbegin', icons.calendarClock);
  document.querySelector('#due-today-section h2').insertAdjacentHTML('afterbegin', icons.checkCircle);
  document.querySelector('#upcoming-section h2').insertAdjacentHTML('afterbegin', icons.calendarDays);
  document.querySelector('#completed-section h2').insertAdjacentHTML('afterbegin', icons.badgeCheck);
  document.querySelector('#clear-completed-btn').insertAdjacentHTML('afterbegin', icons.trash);
  document.querySelector('#archived-section h2').insertAdjacentHTML('afterbegin', icons.archiveBox);

  dom.intervalsInput.value = REVISION_INTERVALS.join(', ');
  loadState();
  render();
  setupEventListeners();
};

// --- Start the app ---
document.addEventListener('DOMContentLoaded', init);
