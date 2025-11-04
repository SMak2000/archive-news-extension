// Stop the script if we're already on an archive page to prevent redirect loops.
if (!window.location.hostname.includes('archive.ph')) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
    const sites = data.sites.filter(s => s.enabled).map(s => s.site);
    const currentHostname = window.location.hostname;

    const shouldRedirect = sites.some(site => currentHostname.includes(site));

    if (shouldRedirect) {
      const newUrl = `https://archive.ph/timegate/${window.location.href}`;
      window.location.href = newUrl;
    }
  });
}


