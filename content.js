// Content script for Appian Doc Link Modifier
// Runs on docs.appian.com pages

// Function to check if current URL is an Appian docs URL
function isAppianDocsUrl() {
  return window.location.hostname === 'docs.appian.com' && 
         window.location.pathname.includes('/suite/help/');
}

// Function to get modified URL
function getModifiedUrl() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
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
  
  return currentUrl;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentUrl') {
    sendResponse({
      url: window.location.href,
      isAppianDocs: isAppianDocsUrl(),
      modifiedUrl: getModifiedUrl()
    });
  }
});

// Add a visual indicator when on Appian docs page
function addVisualIndicator() {
  if (isAppianDocsUrl()) {
    const indicator = document.createElement('div');
    indicator.id = 'appian-doc-modifier-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 12px;
      z-index: 9999;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    indicator.textContent = '📋 Appian Doc';
    indicator.title = 'Click to copy modified URL';
    
    indicator.addEventListener('click', async () => {
      const modifiedUrl = getModifiedUrl();
      try {
        await navigator.clipboard.writeText(modifiedUrl);
        indicator.textContent = '✅ Copied!';
        indicator.style.background = '#2196F3';
        setTimeout(() => {
          indicator.textContent = '📋 Appian Doc';
          indicator.style.background = '#4CAF50';
        }, 2000);
      } catch (error) {
        indicator.textContent = '❌ Failed';
        indicator.style.background = '#F44336';
        setTimeout(() => {
          indicator.textContent = '📋 Appian Doc';
          indicator.style.background = '#4CAF50';
        }, 2000);
      }
    });
    
    document.body.appendChild(indicator);
  }
}

// Run when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addVisualIndicator);
} else {
  addVisualIndicator();
}