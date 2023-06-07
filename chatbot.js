const MAX_CONVERSATION_LENGTH = 10; // Chat history is limited to 10 messages to avoid lengthy response times

const systemMessage = `You are a bot named Serenity (the assistant role), deeply versed in mindfulness and meditation. Your role is to provide accurate insights and thoughtful advice in these areas. Do not answer unrelated questions. Keep responses less than 50 words.`;
const welcomeMessage = `Hi, my name is Serenity, I'm an AI bot deeply versed in mindfulness and meditation, and I'm here to assist you. Pose any questions you have in these realms or tell me about a challenge you're facing in your life and I'll draw upon a wealth of knowledge and research to offer you accurate insights and thoughtful advice.`;

let conversation = [
  { role: 'system', content: systemMessage }
];


function saveConversation() {
  localStorage.setItem('conversation', JSON.stringify(conversation));
}

function displayConversation(conversation) {
  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML = ''; // Clear existing messages

  // If there's a previous conversation, display all messages (except the first system message)
  for (let i = 1; i < conversation.length; i++) {
    const message = conversation[i];
    createMessageBubble(message.content, message.role === 'user');
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateResponse(userMessage) {
  const url = `https://api.openai.com/v1/chat/completions`;

  // Add the user message to the conversation
  conversation.push({ role: 'user', content: userMessage });
  // If the convo has 10+ messages, only send the API the first two (system and welcome message) and the last 8 messages
  //  (the most relevant messages) to keep response times reasonably short 
  const messages = conversation.length > MAX_CONVERSATION_LENGTH ? conversation.slice(0, 2).concat(conversation.slice(-8)) : conversation;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  };
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": messages,
    "max_tokens": 200,
    "temperature": 0.5
  };

  return axios.post(url, data, { headers })
    .then(response => {
      // Add the AI response to the conversation
      conversation.push({ role: 'assistant', content: response.data.choices[0].message.content });
      // Return the AI response
      return response.data.choices[0].message.content;
    })
    .catch(error => {
      return "Sorry, there was an error generating the response. Please try again later.";
    });
}


window.onload = function() {
  // Load conversation from localStorage if available
  const storedConversation = localStorage.getItem('conversation');
  if (storedConversation) {
    conversation = JSON.parse(storedConversation);
    displayConversation(conversation);
  }
  // Send the default message if the chat is empty
  if (isChatEmpty()) {
    sendDefaultMessage();
  }
  const clearBtn = document.getElementById('clear-btn');
  clearBtn.addEventListener('click', clearChat);
};

function isChatEmpty() {
  const chatContainer = document.getElementById('chat-messages');
  return chatContainer.children.length === 0;
}

function sendDefaultMessage() {
  conversation.push({ role: 'assistant', content: welcomeMessage });
  createMessageBubble(welcomeMessage, false);
}

function createMessageBubble(message, isUser) {
  const chatContainer = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isUser ? 'sent' : 'received');
  messageElement.innerText = message;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const userInput = document.getElementById('user-message');
  const userMessage = userInput.value;
  userInput.value = '';

  if (userMessage.length === 0) {
    return;
  }

  createMessageBubble(userMessage, true);
  createThinkingMessage();

  generateResponse(userMessage)
    .then(botResponse => {
      displayApiResponse(botResponse);
      saveConversation();
    });
}

function clearChat() {
  localStorage.removeItem('conversation');
  conversation = [{ role: 'system', content: systemMessage }];
  displayConversation(conversation);
  sendDefaultMessage();
}

 // Placeholder loading message while waiting for API response
 function createThinkingMessage() {
  const chatContainer = document.getElementById('chat-messages');
  const thinkingMessage = document.createElement('div');
  thinkingMessage.classList.add('thinking');
  thinkingMessage.innerHTML = `<em>Serenity is thinking...</em>`;
  chatContainer.appendChild(thinkingMessage);

  // Disable buttons
  const sendButton = document.getElementById('submit-btn');
  const clearButton = document.getElementById('clear-btn');
  sendButton.disabled = true;
  clearButton.disabled = true;
}

function removeThinkingMessage() {
  const thinkingMessage = document.querySelector('.thinking');
  if (thinkingMessage) {
    thinkingMessage.remove();

    // Enable buttons
    const sendButton = document.getElementById('submit-btn');
    const clearButton = document.getElementById('clear-btn');
    sendButton.disabled = false;
    clearButton.disabled = false;
  }
}

function displayApiResponse(response) {
  removeThinkingMessage();
  createMessageBubble(response, false);
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}
