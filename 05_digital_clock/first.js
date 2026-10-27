/**
 * AuraClock — Digital Clock, Focus Timer & Tasks
 * Complete JavaScript logic for time rendering, focus countdown timer, and persistent task manager.
 */

// ==========================================================================
// 1. DIGITAL CLOCK MODULE
// ==========================================================================
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ampmEl = document.getElementById('ampm');
const dateTextEl = document.getElementById('date-text');
const greetingEl = document.getElementById('greeting-text');
const formatToggleBtn = document.getElementById('format-toggle');
const toggleIndicator = formatToggleBtn.querySelector('.toggle-indicator');

// Format state: '12' or '24', loaded from localStorage or defaulting to 12
let is24HourFormat = localStorage.getItem('auraclock_24h') === 'true';

function updateToggleDisplay() {
  toggleIndicator.textContent = is24HourFormat ? '24H' : '12H';
  if (is24HourFormat) {
    ampmEl.classList.add('hidden');
  } else {
    ampmEl.classList.remove('hidden');
  }
}

function updateGreeting(hours24) {
  let greeting = '';
  if (hours24 >= 5 && hours24 < 12) {
    greeting = '🌅 Good Morning • Time to make things happen';
  } else if (hours24 >= 12 && hours24 < 17) {
    greeting = '☀️ Good Afternoon • Keep the momentum going';
  } else if (hours24 >= 17 && hours24 < 22) {
    greeting = '🌆 Good Evening • Reflect & wrap up today';
  } else {
    greeting = '🌙 Good Night • Rest & recharge';
  }
  greetingEl.textContent = greeting;
}

function updateDate(now) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateTextEl.textContent = now.toLocaleDateString(undefined, options);
}

function updateTime() {
  const now = new Date();
  let rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  const rawSeconds = now.getSeconds();

  updateGreeting(rawHours);
  updateDate(now);

  let displayHours = rawHours;
  let ampm = 'AM';

  if (!is24HourFormat) {
    ampm = rawHours >= 12 ? 'PM' : 'AM';
    displayHours = rawHours % 12;
    displayHours = displayHours ? displayHours : 12; // 0 hour should be 12
    ampmEl.textContent = ampm;
  }

  // Pad digits with leading zero
  hoursEl.textContent = String(displayHours).padStart(2, '0');
  minutesEl.textContent = String(rawMinutes).padStart(2, '0');
  secondsEl.textContent = String(rawSeconds).padStart(2, '0');
}

formatToggleBtn.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat;
  localStorage.setItem('auraclock_24h', is24HourFormat);
  updateToggleDisplay();
  updateTime();
});

// Initial clock load and 1s interval
updateToggleDisplay();
updateTime();
setInterval(updateTime, 1000);


// ==========================================================================
// 2. FOCUS TIMER MODULE
// ==========================================================================
const timerDisplay = document.getElementById('timer-display');
const timerStatusBadge = document.getElementById('timer-status-badge');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerProgressRing = document.getElementById('timer-progress-ring');
const timerSublabel = document.getElementById('timer-sublabel');
const presetButtons = document.querySelectorAll('.preset-btn');
const customPresetBtn = document.getElementById('custom-preset-btn');
const customTimerDrawer = document.getElementById('custom-timer-drawer');
const customMinutesInput = document.getElementById('custom-minutes');
const setCustomBtn = document.getElementById('set-custom-btn');

const RING_CIRCUMFERENCE = 2 * Math.PI * 72; // 452.39
timerProgressRing.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;

let totalSeconds = 1500; // default 25 min
let remainingSeconds = 1500;
let timerInterval = null;
let isTimerRunning = false;

// Audio context holder
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Synthesize pleasant completion chime with Web Audio API
function playTimerDoneSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.14;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } catch (e) {
    console.warn('Audio not supported or blocked:', e);
  }
}

function formatTimerDigits(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  timerDisplay.textContent = formatted;

  // Update ring progress
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const offset = RING_CIRCUMFERENCE - (progressRatio * RING_CIRCUMFERENCE);
  timerProgressRing.style.strokeDashoffset = offset;

  // Browser tab title
  if (isTimerRunning) {
    document.title = `(${formatted}) Focus Timer — AuraClock`;
  } else {
    document.title = 'AuraClock — Digital Clock, Timer & Tasks';
  }
}

function startTimer() {
  if (remainingSeconds <= 0) return;
  getAudioContext();
  isTimerRunning = true;
  timerStartBtn.classList.add('is-running');
  timerStartBtn.querySelector('span').textContent = 'Pause';
  timerStatusBadge.textContent = 'Running';
  timerStatusBadge.className = 'status-badge badge-running';

  timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerStartBtn.classList.remove('is-running');
      timerStartBtn.querySelector('span').textContent = 'Start';
      timerStatusBadge.textContent = 'Finished!';
      timerStatusBadge.className = 'status-badge badge-accent';
      playTimerDoneSound();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerStartBtn.classList.remove('is-running');
  timerStartBtn.querySelector('span').textContent = 'Resume';
  timerStatusBadge.textContent = 'Paused';
  timerStatusBadge.className = 'status-badge';
  document.title = 'AuraClock — Digital Clock, Timer & Tasks';
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  remainingSeconds = totalSeconds;
  timerStartBtn.classList.remove('is-running');
  timerStartBtn.querySelector('span').textContent = 'Start';
  timerStatusBadge.textContent = 'Idle';
  timerStatusBadge.className = 'status-badge';
  updateTimerDisplay();
}

function setPreset(seconds, label = 'Focus Session') {
  resetTimer();
  totalSeconds = seconds;
  remainingSeconds = seconds;
  timerSublabel.textContent = label;
  updateTimerDisplay();
}

timerStartBtn.addEventListener('click', () => {
  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

timerResetBtn.addEventListener('click', resetTimer);

presetButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    presetButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn === customPresetBtn) {
      customTimerDrawer.classList.remove('hidden');
      customMinutesInput.focus();
    } else {
      customTimerDrawer.classList.add('hidden');
      const timeVal = parseInt(btn.dataset.time, 10);
      const label = btn.textContent.trim();
      setPreset(timeVal, label);
    }
  });
});

setCustomBtn.addEventListener('click', () => {
  const mins = parseInt(customMinutesInput.value, 10);
  if (mins && mins > 0 && mins <= 360) {
    setPreset(mins * 60, `Custom (${mins}m)`);
  }
});

customMinutesInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    setCustomBtn.click();
  }
});

updateTimerDisplay();


// ==========================================================================
// 3. TASK MANAGER MODULE
// ==========================================================================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskListEl = document.getElementById('task-list');
const emptyTasksState = document.getElementById('empty-tasks-state');
const taskCounter = document.getElementById('task-counter');
const tasksLeftMsg = document.getElementById('tasks-left-msg');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterTabs = document.querySelectorAll('.filter-tab');

let currentFilter = 'all';
let tasks = [];

// Load persisted tasks
try {
  const savedTasks = localStorage.getItem('auraclock_tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
} catch (e) {
  console.warn('Could not read tasks from localStorage', e);
  tasks = [];
}

function saveTasks() {
  localStorage.setItem('auraclock_tasks', JSON.stringify(tasks));
}

function updateTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;

  taskCounter.textContent = `${completed} / ${total}`;
  tasksLeftMsg.textContent = `${remaining} pending`;
}

function renderTasks() {
  taskListEl.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  if (filteredTasks.length === 0) {
    emptyTasksState.classList.remove('hidden');
    if (tasks.length > 0 && currentFilter !== 'all') {
      emptyTasksState.querySelector('p').textContent = `No ${currentFilter} tasks found.`;
    } else {
      emptyTasksState.querySelector('p').textContent = 'No tasks yet! Add one above to kickstart your focus.';
    }
  } else {
    emptyTasksState.classList.add('hidden');
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    // Left container: checkbox & task text
    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);

    checkbox.addEventListener('change', () => {
      toggleTask(task.id);
    });

    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(spanText);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-task';
    deleteBtn.title = 'Delete task';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
    deleteBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;

    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    taskListEl.appendChild(li);
  });

  updateTaskStats();
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTask = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      return { ...t, completed: !t.completed };
    }
    return t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderTasks();
  });
});

// Initial tasks render
renderTasks();