const siteInput = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const addCurrentSiteBtn = document.getElementById("addCurrentSiteBtn");
const siteList = document.getElementById("siteList");

// Load saved sites from storage
chrome.storage.sync.get({ sites: [] }, (data) => {
  data.sites.forEach(addSiteToUI);
});

// Add site from input
addBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();
  addSite(site);
  siteInput.value = "";
});

// Add current site button
addCurrentSiteBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        // Don't add non-http pages or archive.ph itself
        if (url.protocol.startsWith("http") && !url.hostname.includes('archive.ph')) {
          // Extract the domain, removing 'www.' if it exists
          const domain = url.hostname.replace(/^www\./, '');
          addSite(domain);
        }
      } catch (e) {
        console.error("Could not parse URL:", tabs[0].url);
      }
    }
  });
});

// Add a site to storage and UI
function addSite(site) {
  if (!site) return;

  chrome.storage.sync.get({ sites: [] }, (data) => {
    const sites = data.sites;
    if (!sites.some(s => s.site === site)) {
      sites.push({ site, enabled: true });
      chrome.storage.sync.set({ sites });
      addSiteToUI({ site, enabled: true });
    }
  });
}

// Add a site to the UI
function addSiteToUI({ site, enabled }) {
  const li = document.createElement("li");
  li.textContent = site;

  const slider = document.createElement("input");
  slider.type = "checkbox";
  slider.checked = enabled;
  slider.style.marginLeft = "10px";
  slider.addEventListener("change", () => {
    toggleSite(site, slider.checked);
  });

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.style.marginLeft = "10px";
  removeBtn.addEventListener("click", () => {
    chrome.storage.sync.get({ sites: [] }, (data) => {
      const sites = data.sites.filter(s => s.site !== site);
      chrome.storage.sync.set({ sites });
      li.remove();
    });
  });

  li.appendChild(slider);
  li.appendChild(removeBtn);
  siteList.appendChild(li);
}

// Toggle the enabled state of a site
function toggleSite(site, enabled) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
    const sites = data.sites.map(s => s.site === site ? { ...s, enabled } : s);
    chrome.storage.sync.set({ sites });
  });
}
