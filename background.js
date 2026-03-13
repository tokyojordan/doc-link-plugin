// Background service worker for Appian Doc Link Modifier

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyModifiedUrl") {
    copyModifiedUrl(request.url)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Function to copy modified URL to clipboard
async function copyModifiedUrl(url) {
  try {
    const modifiedUrl = modifyAppianUrl(url);
    await navigator.clipboard.writeText(modifiedUrl);
    return modifiedUrl;
  } catch (error) {
    throw error;
  }
}

// Function to modify Appian documentation URLs
function modifyAppianUrl(url) {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'docs.appian.com' && 
        urlObj.pathname.includes('/suite/help/')) {
      
      const pathParts = urlObj.pathname.split('/');
      
      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'help' && i + 1 < pathParts.length) {
          const versionPart = pathParts[i + 1];
          
          if (/^\d+\.\d+$/.test(versionPart)) {
            pathParts[i + 1] = 'latest';
            urlObj.pathname = pathParts.join('/');
            return urlObj.toString();
          }
        }
      }
    }
    
    return url;
  } catch (error) {
    return url;
  }
}