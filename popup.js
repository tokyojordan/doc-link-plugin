// Popup script for Appian Doc Link Modifier

document.addEventListener('DOMContentLoaded', function() {
  const originalUrlElement = document.getElementById('originalUrl');
  const modifiedUrlElement = document.getElementById('modifiedUrl');
  const copyButton = document.getElementById('copyButton');
  const statusElement = document.getElementById('status');
  const urlInfoElement = document.getElementById('urlInfo');
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    const isAppianDocs = isAppianDocsUrl(currentUrl);
    
    if (isAppianDocs) {
      const modifiedUrl = modifyAppianUrl(currentUrl);
      originalUrlElement.textContent = currentUrl;
      modifiedUrlElement.textContent = modifiedUrl;
      copyButton.disabled = false;
      copyButton.addEventListener('click', function() {
        copyToClipboard(modifiedUrl);
      });
    } else {
      originalUrlElement.textContent = currentUrl;
      modifiedUrlElement.textContent = 'Not an Appian documentation URL';
      modifiedUrlElement.classList.remove('modified');
      modifiedUrlElement.classList.add('original');
      copyButton.disabled = true;
      copyButton.textContent = 'Not an Appian docs page';
      
      urlInfoElement.innerHTML = `
        <p style="color: #666; text-align: center;">
          This is not an Appian documentation page.<br>
          Navigate to <code>docs.appian.com</code> to use this extension.
        </p>
      `;
    }
  });
  
  function isAppianDocsUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'docs.appian.com' && 
             urlObj.pathname.includes('/suite/help/');
    } catch (error) {
      return false;
    }
  }
  
  function modifyAppianUrl(url) {
    try {
      const urlObj = new URL(url);
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
      
      return url;
    } catch (error) {
      return url;
    }
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showStatus('✅ Copied to clipboard!', 'success');
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<span>✅</span> Copied!';
        copyButton.disabled = true;
        
        setTimeout(() => {
          copyButton.innerHTML = originalText;
          copyButton.disabled = false;
          hideStatus();
        }, 2000);
      })
      .catch(() => {
        showStatus('❌ Failed to copy to clipboard', 'error');
        setTimeout(() => hideStatus(), 3000);
      });
  }
  
  function showStatus(message, type) {
    statusElement.textContent = message;
    statusElement.className = 'status ' + type;
  }
  
  function hideStatus() {
    statusElement.className = 'status';
    statusElement.style.display = 'none';
  }
});