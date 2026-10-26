const form=document.querySelector("form");
form.addEventListener('submit',(e)=>{
  e.preventDefault();
  const boy = document.getElementById("boy").value.trim().toLowerCase();
  const girl = document.getElementById("girl").value.trim().toLowerCase();

  // 1. Common matching letters between both names
  let commonLetters = 0;
  let seen = "";
  for (let char of boy) {
    if (girl.includes(char) && !seen.includes(char) && char !== " ") {
      commonLetters++;
      seen += char;
    }
  }

  // 2. Matching letters in the romantic word "L-O-V-E"
  const combined = boy + girl;
  let loveCount = 0;
  for (let char of combined) {
    if ("love".includes(char)) {
      loveCount++;
    }
  }

  // 3. Name length factor (bonus for balanced lengths)
  const lengthDiff = Math.abs(boy.length - girl.length);
  const lengthScore = Math.max(0, 12 - lengthDiff);

  // 4. Guaranteed high percentage calculation (Starts at 65% base + bonuses)
  let score = 65 + (commonLetters * 6) + (loveCount * 3) + lengthScore;

  // Add a small deterministic hash so every name pair feels unique
  let charSum = 0;
  for (let i = 0; i < combined.length; i++) {
    charSum += combined.charCodeAt(i);
  }
  score += (charSum % 7);

  // Cap between 68% and 99% (so it always produces high romantic scores!)
  const finalResult = Math.min(Math.max(score, 68), 99);

  // Sweet romantic message based on the result
  let message = "";
  if (finalResult >= 99) {
    message = "💖 TRUE SOULMATES! 99% PURE DESTINY! 💖";
    launchGlitteringHearts();
  } else if (finalResult >= 90) {
    message = "❤️ Soulmates! Match made in heaven!";
  } else if (finalResult >= 80) {
    message = "💖 High Chemistry! Strong bond!";
  } else {
    message = "💘 Good Connection! Love is in the air!";
  }

  const resultElem = document.querySelector('h2');
  resultElem.textContent = `Result: ${finalResult}% — ${message}`;
  resultElem.classList.add('highlight-result');
})

// 99% Glittering Hearts Celebration Animation
function launchGlitteringHearts() {
  const particles = ['💖', '✨', '💕', '❤️', '🌟', '💓', '💎', '💞', '💘'];
  const resultElem = document.querySelector('h2');
  const rect = resultElem ? resultElem.getBoundingClientRect() : {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    width: 0,
    height: 0
  };

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  function spawnWave(count, delay) {
    setTimeout(() => {
      for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.classList.add('glitter-heart');
        heart.textContent = particles[Math.floor(Math.random() * particles.length)];

        // Random radial trajectory (exploding in all directions & floating upwards)
        const angle = Math.random() * 2 * Math.PI;
        const distance = 120 + Math.random() * 280;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - (80 + Math.random() * 120); // upward floating bias

        const scale = (0.9 + Math.random() * 1.4).toFixed(2);
        const rot = (Math.random() * 360 - 180) + 'deg';

        heart.style.left = `${originX}px`;
        heart.style.top = `${originY}px`;
        heart.style.setProperty('--dx', `${dx}px`);
        heart.style.setProperty('--dy', `${dy}px`);
        heart.style.setProperty('--scale', scale);
        heart.style.setProperty('--rot', rot);
        heart.style.animationDuration = `${2 + Math.random() * 0.8}s`;

        document.body.appendChild(heart);

        // Auto-cleanup after animation completes
        setTimeout(() => {
          heart.remove();
        }, 2800);
      }
    }, delay);
  }

  // Trigger two radiant glitter waves
  spawnWave(35, 0);
  spawnWave(35, 300);
}

