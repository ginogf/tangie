const CONTEXT_MENU_ID = "tangie";

chrome.contextMenus.remove(CONTEXT_MENU_ID, () => {
  // Ignore any error that might have occurred
  chrome.runtime.lastError;

  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Tangie",
    contexts: ["selection"]
  });
});

let selectedText = '';

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'tangie') {
      selectedText = info.selectionText;
  }
});

// Listen for the message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getSelectedText') {
    sendResponse({ text: selectedText });
    return;
  }

  const { action, text } = request;

  // Prepare the message based on the action
  let prompt;
  switch (action) {
    case 'summarize':
      prompt = `Can you summarize the following text? ${text}`;
      break;
    case 'explain':
      prompt = `Can you explain the following text in simple terms? ${text}`;
      break;
    case 'paraphrase':
      prompt = `Can you paraphrase the following text? ${text}`;
      break;
  }

  // Make a request to the OpenAI API
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are ChatGPT, a helpful assistant."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0,
    })
  })
  .then(response => response.json())
  .then(data => {
    // Send the response back to the popup
    sendResponse({ text: data.choices[0].message.content });
  })
  .catch(error => {
    console.error('Error:', error);
  });

  // Indicate that the response will be sent asynchronously
  return true;
});
