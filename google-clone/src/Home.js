import React from 'react';
import './Home.css';
import { Link } from "react-router-dom";
import AppsIcon from "@material-ui/icons/Apps";
import { Avatar } from "@material-ui/core"
import Search from './Search';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
// import { Hidden } from '@material-ui/core';
import { useState } from 'react'
const API_KEY = "API_Key";

function Home() {
    const [typing, setTyping] = useState(false)
    let isHome = true
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
        <div className='home'>
            <div className='home__header'>
                <div className='home__headerLeft'>
                    <Link to='/about'>About</Link>
                    <Link to='/store'>Store</Link>
                </div>
                <form className='home__headerRight'>
                    <Link to='/google' onClick={() => window.open('http://www.gmail.com')} >Gmail</Link>
                    <Link to='/images' onClick={() => window.open('https://www.google.co.in/imghp?hl=en&tab=ri&ogbl ')}>Images</Link>
                    <AppsIcon />
                    <Avatar />
                </form>

            </div>
            <div className='home__body'>
                <img
                    src={require('./bb.jpeg')}
                    alt='google'
                />
                <div className='home__inputContainer' >
                    <Search isHome />
                </div>
            </div>
            <div className='App ' id='appss'
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
        </div>

    )
}

export default Home
