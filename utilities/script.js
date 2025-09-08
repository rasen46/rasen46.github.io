// configs
const jsonFiles = [
  'v1.4_u2.json',
  'v1.4.json',
  'v1.3_u2.json',
  'v1.3.json',
  'v1.2.json',
  'v1.1.json',
  'v1.json',
  'v1_beta.json',
  'v0.2.json',
  'v0.1_20.json',
  'LIN_v0.1.json'
];

// elements
const tabs = document.querySelectorAll(".tab");
const container = document.querySelector(".card-list");

// get jsons
const fetchPromises = jsonFiles.map(file => 
  fetch(`utilities/jsons/${file}`).then(res => res.json())
);

Promise.all(fetchPromises)
  .then(results => {
    results.forEach(data => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.category = data.cata_class || "uncategorized";

      const innerData = data.data || {};
      const formattedData = JSON.stringify(innerData, null, 2)
        .slice(1, -1)
        .trim();

      card.innerHTML = `
        <div class="json-preview">
          <div>
            <strong>${data.title || 'No Title'}</strong>
            <div>${data.description || 'No description'}</div>
          </div>
          <div class="buttons">
            <button class="view-btn" onclick="toggleExpand(this)">View</button>
            <button class="copy-btn" onclick="copyData(this)">Copy</button>
          </div>
        </div>
        <div class="json-expanded" style="display:none;">
          <pre>${formattedData}</pre>
        </div>
      `;

      container.appendChild(card);
    });

    // init
    initCategoryFiltering();
  })
  .catch(err => {
    console.error("Error loading JSON files:", err);
  });

// cat filter
function initCategoryFiltering() {
  const cards = document.querySelectorAll(".card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // remove active classes
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;

      // show cards
      cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  const activeTab = document.querySelector(".tab.active");
  if (activeTab) {
    const event = new Event("click");
    activeTab.dispatchEvent(event);
  }
}

// view
function toggleExpand(button) {
  const card = button.closest(".card");
  const expanded = card.querySelector(".json-expanded");
  const isVisible = expanded.style.display === "block";

  expanded.style.display = isVisible ? "none" : "block";
  button.textContent = isVisible ? "View" : "Hide";
}

// copy
function copyData(button) {
  const card = button.closest(".card");
  const pre = card.querySelector("pre");

  if (!pre) return alert("No data to copy!");

  navigator.clipboard.writeText(pre.textContent)
    .then(() => {
      button.textContent = "Copied!";
      setTimeout(() => button.textContent = "Copy", 1200);
    })
    .catch(() => {
      alert("Failed to copy data!");
    });
}





