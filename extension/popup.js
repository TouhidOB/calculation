const POPULAR_CALCS = [
  { id: "mortgage", name: "Mortgage Calculator", desc: "Monthly principal, interest, taxes, and amortization schedule." },
  { id: "loan-calculator", name: "Loan & EMI Calculator", desc: "Equal monthly installments and amortization balance." },
  { id: "auto-loan-calculator", name: "Auto Loan Calculator", desc: "Car loan financing with down payment & trade-in value." },
  { id: "compound-interest", name: "Compound Interest Calculator", desc: "Future value of recurring investments with compounding." },
  { id: "bmi", name: "BMI Calculator", desc: "Body Mass Index metric with WHO health categories." },
  { id: "calorie-calculator", name: "Calorie & TDEE Calculator", desc: "Daily maintenance and deficit energy expenditure." },
  { id: "concrete-calculator", name: "Concrete Slab Calculator", desc: "Volume, cubic yards, and 50-kg cement bag estimator." },
  { id: "paint-calculator", name: "Paint Coverage Calculator", desc: "Gallons and liters required based on wall dimensions." },
  { id: "percentage-calculator", name: "Percentage Calculator", desc: "Percentage increase, decrease, differences, and discounts." },
  { id: "salary-calculator", name: "Salary to Hourly Calculator", desc: "Convert annual salary to hourly, weekly, and paycheck rates." },
  { id: "tip-calculator", name: "Tip & Bill Splitter", desc: "Gratuity and per-person bill split for dining." },
  { id: "electricity-calculator", name: "Electricity Cost Calculator", desc: "Monthly appliance energy consumption and cost." }
];

const resultsList = document.getElementById("resultsList");
const searchInput = document.getElementById("searchInput");
const quickTags = document.getElementById("quickTags");

function renderList(items) {
  if (items.length === 0) {
    resultsList.innerHTML = `<div style="text-align:center; padding: 20px; font-size:12px; color:#64748b;">No calculators matched. Press Enter to search on TryCalc.net.</div>`;
    return;
  }
  resultsList.innerHTML = items.map(c => `
    <a href="https://trycalc.net/calculators/${c.id}" target="_blank" class="calc-item">
      <div class="calc-name">${c.name}</div>
      <div class="calc-desc">${c.desc}</div>
    </a>
  `).join("");
}

// Initial render
renderList(POPULAR_CALCS);

// Search filter
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) {
    renderList(POPULAR_CALCS);
    return;
  }
  const filtered = POPULAR_CALCS.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.desc.toLowerCase().includes(q) ||
    c.id.toLowerCase().includes(q)
  );
  renderList(filtered);
});

// Enter key opens full search on TryCalc
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = encodeURIComponent(searchInput.value.trim());
    chrome.tabs.create({ url: `https://trycalc.net/?q=${q}` });
  }
});

// Quick tag click
quickTags.addEventListener("click", (e) => {
  const tag = e.target.closest(".tag");
  if (tag && tag.dataset.id) {
    chrome.tabs.create({ url: `https://trycalc.net/calculators/${tag.dataset.id}` });
  }
});
