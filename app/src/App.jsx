import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
// import { Hidden } from '@material-ui/core';

const API_KEY = "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";


import './App.css'

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello!,im chat bot",
      sender: "ChatGPT!"
    }
  ])
  const [chatbotActive, setChatbotActive] = useState(false);
  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];


    setMessages(newMessages);


    setTyping(true);



    await processMessageTochatGPT(newMessages);
  }

  async function processMessageTochatGPT(chatMessages) {



    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like professional engineer"
    }


    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
        setTyping(false);
      });
  }

  const handleToggleChatbot = () => {
    setChatbotActive(!chatbotActive);  // toggle the chatbot's active status
  }

  return (
    <div className='App '
      style={{ position: "relative", height: "500px", width: "400px" }}>
      <button className='chtbt' onClick={handleToggleChatbot}>Chatbot</button> {/* the toggle button */}
      {chatbotActive && (
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="chatbot is typing!!!!!!" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>)}
    </div>
  )
}

export default App
