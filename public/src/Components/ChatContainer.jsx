import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getAllMessagesRoute, sendMessages } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    // Fetch messages when the currentChat or currentUser changes
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    // Send the message to the server and emit through socket
    await axios.post(sendMessages, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    // Optimistically update the UI by appending the new message
    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: msg, _id: uuidv4() },
    ]);
  };

  useEffect(() => {
    // Listen for incoming messages from the socket
    if (socket.current) {
      socket.current.on("msg-received", (msg) => {
        // Update the state with the new message
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromSelf: false, message: msg, _id: uuidv4() },
        ]);
      });
    }

    // Clean up the socket listener on component unmount
    return () => {
      if (socket.current) {
        socket.current.off("msg-received");
      }
    };
  }, [socket]);

  useEffect(() => {
    // Ensure scroll position is at the bottom when messages change
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat ? (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message._id || uuidv4()} ref={scrollRef}>
                <div
                  className={`message ${message.fromSelf ? "sended" : "received"}`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      ) : (
        <FallbackMessage>
          Please select a chat to start messaging.
        </FallbackMessage>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    max-height: 75vh;

    ::-webkit-scrollbar {
      width: 0.3rem;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      border-radius: 1rem;
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }

    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const FallbackMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: white;
`;

export default ChatContainer;
