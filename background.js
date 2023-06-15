require('dotenv').config();
const fetch = require('node-fetch');

// Listen for the message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, text } = request;

  // Prepare the message based on the action
  let message;
  switch (action) {
    case 'summarize':
      message = `Can you summarize the following text? ${text}`;
      break;
    case 'explain':
      message = `Can you explain the following text in simple terms? ${text}`;
      break;
    case 'paraphrase':
      message = `Can you paraphrase the following text? ${text}`;
      break;
  }

  // Make a request to the OpenAI API
  fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "text-davinci-002",
      messages: [{
        role: "system",
        content: "You are ChatGPT, a helpful assistant."
      }, {
        role: "user",
        content: message
      }]
    }),
  })
  .then(response => response.json())
  .then(data => {
    // Send the response back to the popup
    sendResponse({ text: data.choices[0].text });
  })
  .catch(error => {
    console.error('Error:', error);
  });

  // Indicate that the response will be sent asynchronously
  return true;
});
