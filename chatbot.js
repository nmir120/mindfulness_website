// function generateResponse() {
// 	const userInput = document.getElementById("user-input").value; // Get user input
// 	const url = `https://api.openai.com/v1/chat/completions`;
// 	const prompt = `
//   Input: "At work today I was overwhelmed by a project and ended up getting nothing done."
//   Output: "To combat feeling overwhelmed with a large task, try increasing self-awareness by verbalizing or writing down your feelings. 
//   Create a list of what's in your control and what's not. Identify one small task you can immediately work on and focus on one thing at a time."
//   Using the example above, fill in the Output section below, include relevant science-backed mindfulness exercises (keep it to 100 tokens max)
//   Input: ${userInput}
//   Output: `; // Prompt for the API
// 	const headers = {
// 		"Content-Type": "application/json",
// 		"Authorization": `Bearer ${API_KEY}`,
// 	}
//   const data = {
//     "model": "gpt-3.5-turbo",
//     "messages": [{"role": "user", "content": prompt}],
//     "max_tokens": 100,
//     "temperature": 0.7
//   };
// 	axios.post(url, data, { headers })
// 		.then(response => {
// 			const chatResponse = response.data.choices[0].message.content; // Get the response from the API
// 			document.getElementById("chat-output").innerHTML = chatResponse; // Display the response in the HTML page
// 		})
// 		.catch(error => {
// 			console.log(error);
// 		});

// }

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

  createMessageBubble(userMessage, true);
  createMessageBubble('Zendo is thinking...', false);

  // Call API here to send userMessage and receive response
  // call the following function to display the API response
  displayApiResponse('This is the response from the API...');
}

function displayApiResponse(response) {
  const chatContainer = document.getElementById('chat-messages');
  const thinkingMessage = chatContainer.lastChild;
  thinkingMessage.innerText = response;
}

function handleKeyDown(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		sendMessage();
	}
}

// todo:
// - figure out how to hide key but still use it while hosting online - ask chatgbt
// - push
// - make sure output doesn't get cut off by token limit - specify a character limit in the prompt instead?
// - loading symbol as chat bot generates output (three bouncing dots?)
// - publish/host on github pages like snake
// - put on resume
// v1 - dedicated page, ask bot about personal challenges. single prompt and answer, no chat. 
// v2 - dedicated page, scrollable chat, ask bot about anything re: mindfulness/ meditation

// v3: instead of having a dedicated page, maybe just have a chatbot popup in bottom right of entire website
// the chatbot can act as a general mindfulness + meditation guide. Tell the bot what it is, and keep the convo
// on the topic of mindfulness/mediation. User can ask anything about practices, science, challenges they are facing,
// + "click me for a random fact" button?