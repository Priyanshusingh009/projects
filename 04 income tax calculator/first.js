const form = document.querySelector("form");

// Professional Flying Coin Particle Animation
function triggerCoinShower(x, y) {
  const container = document.getElementById("coin-particles");
  if (!container) return;

  const coinCount = 18;
  for (let i = 0; i < coinCount; i++) {
    const coin = document.createElement("div");
    coin.classList.add("flying-coin");

    // Random trajectory spread
    const angle = (Math.PI * 2 * i) / coinCount + (Math.random() - 0.5) * 0.4;
    const distance = 90 + Math.random() * 140;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 40;
    const rot = (Math.random() - 0.5) * 720;

    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    coin.style.setProperty("--tx", `${destX}px`);
    coin.style.setProperty("--ty", `${destY}px`);
    coin.style.setProperty("--rot", `${rot}deg`);

    container.appendChild(coin);
    setTimeout(() => coin.remove(), 1200);
  }
}

// Smooth Count-Up Animation for Tax Result
function animateTaxCounter(element, targetAmount, duration = 900) {
  const startTime = performance.now();
  const startAmount = 0;

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic curve
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startAmount + (targetAmount - startAmount) * easeOut);

    element.innerHTML = `Your total tax is <span class="tax-amount">₹${current.toLocaleString("en-IN")}</span>`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const income = document.getElementById("income");
  const amount = parseFloat(income.value);
  const result = document.querySelector("h2");
  const taxDetails = document.getElementById("tax-details");

  if (isNaN(amount) || amount < 0) return;

  let totaltax = 0;
  if (amount <= 1200000) {
    totaltax = 0;
  } else if (amount <= 1600000) {
    totaltax = (amount - 1200000) * 0.15;
  } else if (amount <= 2000000) {
    totaltax = (amount - 1600000) * 0.20 + 60000;
  } else if (amount <= 2500000) {
    totaltax = (amount - 2000000) * 0.25 + 140000;
  } else {
    totaltax = (amount - 2500000) * 0.30 + 265000;
  }

  // Trigger coin explosion from button position
  const submitBtn = form.querySelector("button");
  const rect = submitBtn.getBoundingClientRect();
  triggerCoinShower(rect.left + rect.width / 2, rect.top + rect.height / 2);

  // Smooth pop-in and count-up number animation
  result.classList.remove("highlight");
  void result.offsetWidth; // Reflow trigger
  result.classList.add("highlight");

  animateTaxCounter(result, totaltax, 950);

  // Effective rate and Net In-Hand Income
  const effectiveRate = amount > 0 ? ((totaltax / amount) * 100).toFixed(1) : "0.0";
  const inHand = amount - totaltax;

  if (taxDetails) {
    taxDetails.innerHTML = `
      <div class="stat-pill">
        <span class="stat-label">Effective Rate</span>
        <span class="stat-value">${effectiveRate}%</span>
      </div>
      <div class="stat-pill">
        <span class="stat-label">Net In-Hand</span>
        <span class="stat-value">₹${inHand.toLocaleString("en-IN")}</span>
      </div>
    `;
    taxDetails.classList.add("visible");
  }
});