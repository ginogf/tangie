// Get references to the buttons and the result div
const summarizeButton = document.getElementById('summarize');
const explainButton = document.getElementById('explain');
const paraphraseButton = document.getElementById('paraphrase');
const resultDiv = document.getElementById('result');

// Add event listeners to the buttons
summarizeButton.addEventListener('click', () => handleButtonClick('summarize'));
explainButton.addEventListener('click', () => handleButtonClick('explain'));
paraphraseButton.addEventListener('click', () => handleButtonClick('paraphrase'));

function handleButtonClick(action) {
    // Get the selected text from the background page
    chrome.runtime.sendMessage({ message: 'getSelectedText' }, response => {
      const text = response.text;
  
      // Send a message to the background script with the action and the selected text
      chrome.runtime.sendMessage({ action, text }, function(response) {
        if (response.text) {
          // Display the response text in your UI
          resultDiv.textContent = response.text;
        }
      });
    });
}  
