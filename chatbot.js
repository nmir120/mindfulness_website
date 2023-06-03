const MAX_CONVERSATION_LENGTH = 5; // Chat history is limited to 5 messages to avoid lengthy response times

let conversation = [
  { role: 'system', content: 'You are a bot named Serenity, deeply versed in mindfulness and meditation. Your role is to provide accurate insights and thoughtful advice in these areas. Keep responses less than 50 words.' }
];

function generateResponse(userMessage) {
  const url = `https://api.openai.com/v1/chat/completions`;

  // Add the user message to the conversation
  conversation.push({ role: 'user', content: userMessage });

  // Remove the second message every 5 messages (excluding the system message)
  if ((conversation.length - 1) % MAX_CONVERSATION_LENGTH === 0 && conversation.length > MAX_CONVERSATION_LENGTH + 1) {
    conversation.splice(1, 1);
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  };
  const data = {
    "model": "gpt-3.5-turbo",
    "messages": conversation,
    "max_tokens": 100,
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
      console.log(error);
      return "Sorry, there was an error generating the response. Please try again later.";
    });
}

const defaultMessage = `Hi, my name is Serenity, I'm an AI bot deeply versed in mindfulness and meditation, and I'm here to assist you. Pose any questions you have in these realms, and I'll draw upon a wealth of knowledge and research to offer you accurate insights and thoughtful advice.`;

window.onload = function() {
  // Send the default message if the chat is empty
  if (isChatEmpty()) {
    sendDefaultMessage();
  }
};

function isChatEmpty() {
  const chatContainer = document.getElementById('chat-messages');
  return chatContainer.children.length === 0;
}

function sendDefaultMessage() {
  createMessageBubble(defaultMessage, false);
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
    });
}

 // Placeholder loading message while waiting for API response
function createThinkingMessage() {
  const chatContainer = document.getElementById('chat-messages');
  const thinkingMessage = document.createElement('div');
  thinkingMessage.classList.add('thinking');
  thinkingMessage.innerHTML = `<em>Serenity is thinking...</em>`;
  chatContainer.appendChild(thinkingMessage);
}

function removeThinkingMessage() {
  const thinkingMessage = document.querySelector('.thinking');
  if (thinkingMessage) {
    thinkingMessage.remove();
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
// todo:
// - figure out how to hide key but still use it while hosting online - ask chatgbt
// - make sure output doesn't get cut off by token limit - specify a character limit in the prompt instead?
// - publish/host on github pages like snake
// - put on resume
// v1 - dedicated page, ask bot about personal challenges. single prompt and answer, no chat. 
// v2 - dedicated page, scrollable chat, ask bot about anything re: mindfulness/ meditation

// v3: instead of having a dedicated page, maybe just have a chatbot popup in bottom right of entire website
// the chatbot can act as a general mindfulness + meditation guide. Tell the bot what it is, and keep the convo
// on the topic of mindfulness/mediation. User can ask anything about practices, science, challenges they are facing,
// + "click me for a random fact" button?