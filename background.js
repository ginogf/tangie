// Create a context menu item for selected text
chrome.contextMenus.create({
    id: "tangie",
    title: "Summarize with Tangie",
    contexts: ["selection"],
  });
  
  // Listen for the context menu item being clicked
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "tangie") {
      // Send a message to the content script with the selected text
      chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
    }
  });
  