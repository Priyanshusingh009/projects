/**
 * Celestia — Cosmic Astrology Application Logic
 * Implements deterministic daily transits, ethical prediction constraints,
 * zodiac sign calculator, and compatibility explorer.
 */

// ==========================================================================
// 1. ZODIAC ARCHETYPAL DATABASE
// ==========================================================================
const ZODIAC_SIGNS = [
  {
    id: "aries",
    name: "Aries",
    glyph: "♈",
    element: "fire",
    elementLabel: "Fire Sign",
    dates: "Mar 21 – Apr 19",
    startMonth: 3, startDay: 21,
    endMonth: 4, endDay: 19,
    ruler: "Mars",
    archetype: "The Pioneering Trailblazer",
    colors: ["Crimson Aura", "Solar Amber", "Ruby Red"],
    traits: ["Courageous", "Dynamic", "Spontaneous"]
  },
  {
    id: "taurus",
    name: "Taurus",
    glyph: "♉",
    element: "earth",
    elementLabel: "Earth Sign",
    dates: "Apr 20 – May 20",
    startMonth: 4, startDay: 20,
    endMonth: 5, endDay: 20,
    ruler: "Venus",
    archetype: "The Grounded Builder",
    colors: ["Emerald Moss", "Warm Terracotta", "Forest Green"],
    traits: ["Patient", "Reliable", "Sensual"]
  },
  {
    id: "gemini",
    name: "Gemini",
    glyph: "♊",
    element: "air",
    elementLabel: "Air Sign",
    dates: "May 21 – Jun 20",
    startMonth: 5, startDay: 21,
    endMonth: 6, endDay: 20,
    ruler: "Mercury",
    archetype: "The Cosmic Messenger",
    colors: ["Celestial Cyan", "Sunburst Yellow", "Silver Mist"],
    traits: ["Curious", "Adaptable", "Articulate"]
  },
  {
    id: "cancer",
    name: "Cancer",
    glyph: "♋",
    element: "water",
    elementLabel: "Water Sign",
    dates: "Jun 21 – Jul 22",
    startMonth: 6, startDay: 21,
    endMonth: 7, endDay: 22,
    ruler: "Moon",
    archetype: "The Intuitive Guardian",
    colors: ["Lunar Pearl", "Opalescent Silver", "Seafoam Green"],
    traits: ["Empathetic", "Protective", "Imaginative"]
  },
  {
    id: "leo",
    name: "Leo",
    glyph: "♌",
    element: "fire",
    elementLabel: "Fire Sign",
    dates: "Jul 23 – Aug 22",
    startMonth: 7, startDay: 23,
    endMonth: 8, endDay: 22,
    ruler: "Sun",
    archetype: "The Radiant Sovereign",
    colors: ["Imperial Gold", "Solar Orange", "Warm Bronze"],
    traits: ["Generous", "Charismatic", "Confident"]
  },
  {
    id: "virgo",
    name: "Virgo",
    glyph: "♍",
    element: "earth",
    elementLabel: "Earth Sign",
    dates: "Aug 23 – Sep 22",
    startMonth: 8, startDay: 23,
    endMonth: 9, endDay: 22,
    ruler: "Mercury",
    archetype: "The Mindful Alchemist",
    colors: ["Sage Green", "Earthy Sand", "Navy Blue"],
    traits: ["Analytical", "Helpful", "Discerning"]
  },
  {
    id: "libra",
    name: "Libra",
    glyph: "♎",
    element: "air",
    elementLabel: "Air Sign",
    dates: "Sep 23 – Oct 22",
    startMonth: 9, startDay: 23,
    endMonth: 10, endDay: 22,
    ruler: "Venus",
    archetype: "The Harmonic Arbiter",
    colors: ["Rose Quartz", "Lavender Bloom", "Soft Sky"],
    traits: ["Diplomatic", "Fair-minded", "Aesthetic"]
  },
  {
    id: "scorpio",
    name: "Scorpio",
    glyph: "♏",
    element: "water",
    elementLabel: "Water Sign",
    dates: "Oct 23 – Nov 21",
    startMonth: 10, startDay: 23,
    endMonth: 11, endDay: 21,
    ruler: "Pluto & Mars",
    archetype: "The Transformative Seer",
    colors: ["Deep Burgundy", "Obsidian Black", "Midnight Blue"],
    traits: ["Perceptive", "Passionate", "Resilient"]
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    glyph: "♐",
    element: "fire",
    elementLabel: "Fire Sign",
    dates: "Nov 22 – Dec 21",
    startMonth: 11, startDay: 22,
    endMonth: 12, endDay: 21,
    ruler: "Jupiter",
    archetype: "The Philosophical Explorer",
    colors: ["Royal Purple", "Cobalt Indigo", "Topaz Gold"],
    traits: ["Optimistic", "Free-spirited", "Philosophical"]
  },
  {
    id: "capricorn",
    name: "Capricorn",
    glyph: "♑",
    element: "earth",
    elementLabel: "Earth Sign",
    dates: "Dec 22 – Jan 19",
    startMonth: 12, startDay: 22,
    endMonth: 1, endDay: 19,
    ruler: "Saturn",
    archetype: "The Resolute Architect",
    colors: ["Charcoal Slate", "Dark Espresso", "Forest Pine"],
    traits: ["Disciplined", "Strategic", "Patient"]
  },
  {
    id: "aquarius",
    name: "Aquarius",
    glyph: "♒",
    element: "air",
    elementLabel: "Air Sign",
    dates: "Jan 20 – Feb 18",
    startMonth: 1, startDay: 20,
    endMonth: 2, endDay: 18,
    ruler: "Uranus & Saturn",
    archetype: "The Visionary Innovator",
    colors: ["Electric Cyan", "Aquamarine", "Ultra Violet"],
    traits: ["Original", "Humanitarian", "Independent"]
  },
  {
    id: "pisces",
    name: "Pisces",
    glyph: "♓",
    element: "water",
    elementLabel: "Water Sign",
    dates: "Feb 19 – Mar 20",
    startMonth: 2, startDay: 19,
    endMonth: 3, endDay: 20,
    ruler: "Neptune & Jupiter",
    archetype: "The Mystical Dreamer",
    colors: ["Mystic Lilac", "Ocean Teal", "Iridescent Pearl"],
    traits: ["Compassionate", "Artistic", "Intuitive"]
  }
];

// ==========================================================================
// 2. CURATED ETHICAL PREDICTION POOL
// Designed with 0% fatalism, 100% personal agency & constructive reflection.
// ==========================================================================
const PREDICTION_THEMES = [
  {
    energyTitle: "Clarity & Momentum",
    energyDesc: "Planetary aspects activate your sector of initiative. Thoughts assemble into clear strategies, making this an inspiring cycle to begin steps on long-gestating ideas.",
    challengeTitle: "Scattered Enthusiasm",
    challengeDesc: "A surge of mental energy can tempt you to juggle too many tasks simultaneously. Guard against overpromising your time.",
    actionTitle: "Single-Tasking Mastery",
    actionDesc: "Select one high-priority goal before noon and dedicate your deepest focus to it without checking notifications."
  },
  {
    energyTitle: "Reflective Equilibrium",
    energyDesc: "Gentle lunar harmonies invite quiet contemplation. Your inner instincts are sharpened, allowing you to see through surface-level noise.",
    challengeTitle: "Second-Guessing Instincts",
    challengeDesc: "Over-analyzing simple situations may create subtle hesitation. Trust the wisdom you've accumulated through experience.",
    actionTitle: "Conscious Pause",
    actionDesc: "Before replying to charged messages, take three grounding breaths to respond from wisdom rather than reflexive habit."
  },
  {
    energyTitle: "Collaborative Spark",
    energyDesc: "Transits highlight connection and mutual understanding. Conversations with peers or loved ones flow with refreshing sincerity and unexpected insights.",
    challengeTitle: "Boundary Blurred Lines",
    challengeDesc: "Eagerness to support others can inadvertently deplete your own reserves if you forget to pace yourself.",
    actionTitle: "Gracious Limits",
    actionDesc: "Offer meaningful support where you can, but protect your evening rest cycle with clear, affectionate boundaries."
  },
  {
    energyTitle: "Strategic Consolidation",
    energyDesc: "Saturnian alignment promotes structure, discipline, and grounding. Practical matters such as budgets, schedules, and systems feel natural to organize.",
    challengeTitle: "Rigidity & Self-Critique",
    challengeDesc: "The pursuit of perfection can make small adjustments feel heavier than they are. Give room for healthy spontaneity.",
    actionTitle: "Celebrate Micro-Wins",
    actionDesc: "Acknowledge progress on foundations rather than demanding final results today. Consistent small steps yield monumental shifts."
  },
  {
    energyTitle: "Creative Alchemy",
    energyDesc: "Venusian and Solar currents illuminate self-expression, aesthetic pleasure, and creative innovation. Colors, sounds, and design stimulate your mood.",
    challengeTitle: "Distraction by Novelty",
    challengeDesc: "Shimmering distractions can pull your attention away from existing responsibilities.",
    actionTitle: "Channel the Muse",
    actionDesc: "Dedicate 30 guilt-free minutes to a creative hobby, writing, or cooking to give your imagination a joyful outlet."
  }
];

// Color Swatches matching predictions
const COLOR_SWATCHES = {
  "Crimson Aura": "#ff4d6d",
  "Solar Amber": "#ffb703",
  "Ruby Red": "#d90429",
  "Emerald Moss": "#2a9d8f",
  "Warm Terracotta": "#e76f51",
  "Forest Green": "#2d6a4f",
  "Celestial Cyan": "#00b4d8",
  "Sunburst Yellow": "#ffd166",
  "Silver Mist": "#ced4da",
  "Lunar Pearl": "#e9ecef",
  "Opalescent Silver": "#d8e2dc",
  "Seafoam Green": "#99d98c",
  "Imperial Gold": "#f3c053",
  "Solar Orange": "#f77f00",
  "Warm Bronze": "#b08968",
  "Sage Green": "#84a98c",
  "Earthy Sand": "#ddb892",
  "Navy Blue": "#1d3557",
  "Rose Quartz": "#f4a261",
  "Lavender Bloom": "#c77dff",
  "Soft Sky": "#a2d2ff",
  "Deep Burgundy": "#6a040f",
  "Obsidian Black": "#495057",
  "Midnight Blue": "#03045e",
  "Royal Purple": "#7209b7",
  "Cobalt Indigo": "#3a0ca3",
  "Topaz Gold": "#e0a96d",
  "Charcoal Slate": "#5c677d",
  "Dark Espresso": "#382923",
  "Forest Pine": "#1b4332",
  "Electric Cyan": "#48cae4",
  "Aquamarine": "#52b788",
  "Ultra Violet": "#9d4edd",
  "Mystic Lilac": "#b392ac",
  "Ocean Teal": "#0077b6",
  "Iridescent Pearl": "#f8f9fa"
};

// Deep Dive Horizons Content
const HORIZON_CONTENT = {
  career: [
    {
      badge: "Focus Opportunity",
      title: "Streamline Strategic Priorities",
      text: "The present planetary alignment favors clarifying your core deliverables. Clear out low-impact busywork and align directly with key stakeholders."
    },
    {
      badge: "Professional Dynamics",
      title: "Active Listening in Negotiations",
      text: "Colleagues appreciate clarity wrapped in empathy. Expressing your requirements directly while actively listening to mutual objectives unlocks progress."
    }
  ],
  love: [
    {
      badge: "Heart Center",
      title: "Authentic Expression",
      text: "Share small moments of vulnerability and appreciation. Sincere check-ins strengthen mutual trust far more than grand gestures."
    },
    {
      badge: "Relational Balance",
      title: "Space & Togetherness",
      text: "Healthy intimacy flourishes when both individuals honor their autonomy. Celebrate your partner's or loved one's separate passions today."
    }
  ],
  mindset: [
    {
      badge: "Wellness Anchor",
      title: "Grounding the Nervous System",
      text: "When thoughts accelerate, physical grounding—a 15-minute nature walk, gentle stretching, or warm hydration—restores clarity immediately."
    },
    {
      badge: "Inner Dialogue",
      title: "Grace Over Self-Judgment",
      text: "Treat yourself with the kindness you would offer a trusted friend. Planetary currents urge self-compassion as a driver of resilience."
    }
  ]
};

// ==========================================================================
// 3. APPLICATION STATE
// ==========================================================================
let currentSelectedSign = ZODIAC_SIGNS[0]; // Default: Aries
let activeUserName = "";

// ==========================================================================
// 4. STARFIELD GENERATOR
// ==========================================================================
function initStarfield() {
  const container = document.getElementById("stars-container");
  if (!container) return;

  const starCount = 80;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    
    const size = Math.random() * 2.5 + 1;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 4;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.setProperty("--duration", `${duration}s`);
    star.style.setProperty("--delay", `${delay}s`);

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

// ==========================================================================
// 5. DETERMINISTIC HASHING ENGINE (Deterministic & Safe Readings)
// ==========================================================================
function getDeterministicDailySeed(signId, userSalt = "") {
  const now = new Date();
  // Format: YYYY-MM-DD
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const key = `${signId}_${dateStr}_${userSalt.trim().toLowerCase()}`;

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// ==========================================================================
// 6. ASTROLOGICAL CALCULATOR (Date of Birth -> Sun Sign)
// ==========================================================================
function calculateZodiacSign(dateObj) {
  const month = dateObj.getMonth() + 1; // 1-12
  const day = dateObj.getDate();

  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign;
    }
  }

  // Handle Capricorn wrap-around (Dec 22 - Jan 19)
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return ZODIAC_SIGNS.find(s => s.id === "capricorn");
  }

  return ZODIAC_SIGNS[0];
}

// ==========================================================================
// 7. COMPATIBILITY CALCULATOR
// ==========================================================================
function calculateCompatibility(signA, signB) {
  if (signA.id === signB.id) {
    return {
      percentage: "94%",
      headline: "Twin Mirror Resonance",
      text: "Sharing the same celestial element creates instantaneous mutual understanding and instinctive shared values.",
      tags: ["Deep Empathy", "Shared Rhythm", "Unspoken Harmony"]
    };
  }

  const fireAndAir = (signA.element === "fire" && signB.element === "air") || (signA.element === "air" && signB.element === "fire");
  const earthAndWater = (signA.element === "earth" && signB.element === "water") || (signA.element === "water" && signB.element === "earth");
  const sameElement = signA.element === signB.element;

  if (fireAndAir) {
    return {
      percentage: "92%",
      headline: "Dynamic Ignition & Inspiration",
      text: "Air feeds Fire's vitality, while Fire provides warmth and enthusiasm to Air's expansive vision. High creative harmony.",
      tags: ["Creative Synergy", "Spontaneous Adventure", "Mutual Growth"]
    };
  }

  if (earthAndWater) {
    return {
      percentage: "90%",
      headline: "Nourishing Stability & Depth",
      text: "Water softens Earth's pragmatic contours, while Earth provides steady containment for Water's deep intuition and feeling.",
      tags: ["Emotional Safety", "Enduring Trust", "Grounded Support"]
    };
  }

  if (sameElement) {
    return {
      percentage: "88%",
      headline: `Elemental Affinity (${signA.element.toUpperCase()})`,
      text: `Both share the instinctive language of ${signA.element}. Communication feels effortless and familiar from day one.`,
      tags: ["Natural Rhythm", "Effortless Bond", "Shared Values"]
    };
  }

  // Complementary tension
  return {
    percentage: "79%",
    headline: "Complementary Contrast",
    text: "Different elemental approaches offer complementary balance. With respectful curiosity, differences become powerful strengths.",
    tags: ["Perspective Shift", "Growth Catalyst", "Fascinating Balance"]
  };
}

// ==========================================================================
// 8. RENDER FUNCTIONS
// ==========================================================================

// Render 12 Zodiac Cards in the Quick-Picker Grid
function renderZodiacGrid() {
  const grid = document.getElementById("zodiac-grid");
  if (!grid) return;

  grid.innerHTML = "";

  ZODIAC_SIGNS.forEach(sign => {
    const card = document.createElement("div");
    card.className = `zodiac-card ${sign.id === currentSelectedSign.id ? "active" : ""}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.dataset.signId = sign.id;

    card.innerHTML = `
      <div class="zodiac-glyph">${sign.glyph}</div>
      <h4 class="zodiac-name">${sign.name}</h4>
      <div class="zodiac-dates">${sign.dates}</div>
      <span class="zodiac-element-pill element-${sign.element}">${sign.element}</span>
    `;

    card.addEventListener("click", () => {
      selectSign(sign);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSign(sign);
      }
    });

    grid.appendChild(card);
  });
}

// Update Active Sign Selection & Display Reading
function selectSign(sign) {
  currentSelectedSign = sign;

  // Update grid active highlights
  document.querySelectorAll(".zodiac-card").forEach(c => {
    c.classList.toggle("active", c.dataset.signId === sign.id);
  });

  // Render reading
  renderActiveForecast();

  // Scroll smoothly to forecast if user picked manually
  const forecastSection = document.getElementById("forecast-section");
  if (forecastSection) {
    forecastSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Render the Forecast Dashboard for the Active Sign
function renderActiveForecast() {
  const sign = currentSelectedSign;
  const seed = getDeterministicDailySeed(sign.id, activeUserName);

  // 1. Update Banner
  const avatarEl = document.getElementById("banner-avatar");
  const badgeEl = document.getElementById("banner-element-badge");
  const nameEl = document.getElementById("banner-sign-name");
  const datesEl = document.getElementById("banner-sign-dates");
  const greetingEl = document.getElementById("banner-greeting");

  if (avatarEl) avatarEl.textContent = sign.glyph;
  if (badgeEl) {
    badgeEl.textContent = `${sign.elementLabel} • ${sign.archetype}`;
    badgeEl.className = `banner-tag element-${sign.element}`;
  }
  if (nameEl) nameEl.textContent = sign.name;
  if (datesEl) datesEl.textContent = `${sign.dates} • Ruled by ${sign.ruler}`;

  if (greetingEl) {
    greetingEl.textContent = activeUserName ? `Cosmic Forecast for ${activeUserName}` : "Daily Cosmic Transit";
  }

  // 2. Select Safe Deterministic Prediction Theme
  const themeIndex = seed % PREDICTION_THEMES.length;
  const theme = PREDICTION_THEMES[themeIndex];

  // Update 3-Pillars
  const energyTitle = document.getElementById("energy-title");
  const energyDesc = document.getElementById("energy-desc");
  const challengeTitle = document.getElementById("challenge-title");
  const challengeDesc = document.getElementById("challenge-desc");
  const actionTitle = document.getElementById("action-title");
  const actionDesc = document.getElementById("action-desc");

  if (energyTitle) energyTitle.textContent = theme.energyTitle;
  if (energyDesc) energyDesc.textContent = theme.energyDesc;
  if (challengeTitle) challengeTitle.textContent = theme.challengeTitle;
  if (challengeDesc) challengeDesc.textContent = theme.challengeDesc;
  if (actionTitle) actionTitle.textContent = theme.actionTitle;
  if (actionDesc) actionDesc.textContent = theme.actionDesc;

  // 3. Cosmic Matrix
  const hours = [
    "09:00 - 11:00", "11:30 - 13:30", "14:00 - 16:00", 
    "16:30 - 18:30", "19:00 - 21:00"
  ];
  const powerHour = hours[seed % hours.length];
  const colorName = sign.colors[seed % sign.colors.length];
  const colorHex = COLOR_SWATCHES[colorName] || "#f2cb73";
  const cosmicNum = (seed % 9) + 1; // 1-9 single digit or master numbers
  
  // Daily affinity sign
  const otherSigns = ZODIAC_SIGNS.filter(s => s.id !== sign.id);
  const affinitySign = otherSigns[seed % otherSigns.length];

  const valPowerHour = document.getElementById("val-power-hour");
  const valColorName = document.getElementById("val-color-name");
  const valColorDot = document.getElementById("val-color-dot");
  const valCosmicNum = document.getElementById("val-cosmic-num");
  const valAffinitySign = document.getElementById("val-affinity-sign");

  if (valPowerHour) valPowerHour.textContent = powerHour;
  if (valColorName) valColorName.textContent = colorName;
  if (valColorDot) {
    valColorDot.style.backgroundColor = colorHex;
    valColorDot.style.boxShadow = `0 0 10px ${colorHex}`;
  }
  if (valCosmicNum) valCosmicNum.textContent = cosmicNum;
  if (valAffinitySign) valAffinitySign.textContent = `${affinitySign.name} ${affinitySign.glyph}`;

  // 4. Populate Deep Dive Content Panes
  populateDeepDivePanes();

  // 5. Update Compatibility Pane
  renderCompatibilityPane();
}

// Populate Career, Love, and Mindset deep dive cards
function populateDeepDivePanes() {
  const careerContainer = document.getElementById("career-content");
  const loveContainer = document.getElementById("love-content");
  const mindsetContainer = document.getElementById("mindset-content");

  if (careerContainer) {
    careerContainer.innerHTML = HORIZON_CONTENT.career.map(item => `
      <div class="deep-block">
        <span class="deep-block-badge">${item.badge}</span>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </div>
    `).join("");
  }

  if (loveContainer) {
    loveContainer.innerHTML = HORIZON_CONTENT.love.map(item => `
      <div class="deep-block">
        <span class="deep-block-badge">${item.badge}</span>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </div>
    `).join("");
  }

  if (mindsetContainer) {
    mindsetContainer.innerHTML = HORIZON_CONTENT.mindset.map(item => `
      <div class="deep-block">
        <span class="deep-block-badge">${item.badge}</span>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </div>
    `).join("");
  }
}

// Render Compatibility Section
function renderCompatibilityPane() {
  const compatSign1 = document.getElementById("compat-sign-1");
  const compatSelect = document.getElementById("compat-select");

  if (compatSign1) {
    compatSign1.textContent = `${currentSelectedSign.name} ${currentSelectedSign.glyph}`;
  }

  if (compatSelect && compatSelect.children.length === 0) {
    // Populate dropdown with all signs
    ZODIAC_SIGNS.forEach(sign => {
      const option = document.createElement("option");
      option.value = sign.id;
      option.textContent = `${sign.name} ${sign.glyph}`;
      if (sign.id === "leo" && currentSelectedSign.id !== "leo") {
        option.selected = true;
      }
      compatSelect.appendChild(option);
    });

    compatSelect.addEventListener("change", updateCompatibilityResult);
  }

  updateCompatibilityResult();
}

function updateCompatibilityResult() {
  const compatSelect = document.getElementById("compat-select");
  if (!compatSelect) return;

  const compareSignId = compatSelect.value;
  const compareSign = ZODIAC_SIGNS.find(s => s.id === compareSignId) || ZODIAC_SIGNS[1];

  const result = calculateCompatibility(currentSelectedSign, compareSign);

  const percentEl = document.getElementById("compat-percentage");
  const titleEl = document.getElementById("compat-title");
  const textEl = document.getElementById("compat-text");
  const tagsEl = document.getElementById("compat-tags");

  if (percentEl) percentEl.textContent = result.percentage;
  if (titleEl) titleEl.textContent = result.headline;
  if (textEl) textEl.textContent = result.text;
  if (tagsEl) {
    tagsEl.innerHTML = result.tags.map(t => `<span class="compat-tag">${t}</span>`).join("");
  }
}

// ==========================================================================
// 9. EVENT LISTENERS & INITIALIZATION
// ==========================================================================
function setupEventListeners() {
  // 1. Birth Chart Form submission
  const form = document.getElementById("astrology-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById("user-name");
      const dateInput = document.getElementById("birth-date");

      if (!dateInput.value) {
        alert("Please enter a valid birth date.");
        return;
      }

      const birthDate = new Date(dateInput.value);
      const today = new Date();

      if (birthDate > today) {
        alert("Birth date cannot be in the future! Please enter a valid date.");
        return;
      }

      activeUserName = nameInput.value.trim();
      const detectedSign = calculateZodiacSign(birthDate);

      // Select sign & update forecast
      selectSign(detectedSign);
    });
  }

  // 2. Tab Navigation
  const tabButtons = document.querySelectorAll(".forecast-tab");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      
      tabButtons.forEach(b => b.classList.toggle("active", b === btn));

      document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.toggle("active", pane.id === `pane-${targetTab}`);
      });
    });
  });

  // 3. Ethical Code Modal Dialog
  const ethicsBtn = document.getElementById("ethics-modal-btn");
  const modal = document.getElementById("ethics-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const understandBtn = document.getElementById("modal-understand-btn");

  const openModal = () => modal && modal.classList.remove("hidden");
  const closeModal = () => modal && modal.classList.add("hidden");

  if (ethicsBtn) ethicsBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (understandBtn) understandBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // 4. Update Header Date
  updateHeaderDate();
}

function updateHeaderDate() {
  const headerDateEl = document.getElementById("header-date");
  const bannerDateEl = document.getElementById("banner-today-date");

  const now = new Date();
  const options = { month: "short", day: "numeric", year: "numeric" };
  const formatted = now.toLocaleDateString("en-US", options);

  if (headerDateEl) headerDateEl.textContent = `${formatted} • Cosmic Transits`;
  if (bannerDateEl) bannerDateEl.textContent = `Alignments for ${formatted}`;
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  renderZodiacGrid();
  renderActiveForecast();
  setupEventListeners();
});
