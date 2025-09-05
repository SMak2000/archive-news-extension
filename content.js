// Stop the script if we're already on an archive page to prevent redirect loops.
if (!window.location.hostname.includes('archive.ph')) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
  const sites = data.sites;
  const currentHostname = window.location.hostname;
  const shouldRedirect = sites.some(site => currentHostname.includes(site));
  if (shouldRedirect) {
    // Use the TimeGate endpoint to go directly to the latest snapshot.
    const newUrl = `https://archive.ph/timegate/${window.location.href}`;
    window.location.href = newUrl;
  }
});
}


