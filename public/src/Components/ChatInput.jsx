
// import { BsEmojiSmileFill } from "react-icons/bs";
// import { IoMdSend } from "react-icons/io";
// import styled from "styled-components";
// import Picker from "emoji-picker-react";
// import { useState } from "react";

// export default function ChatInput({ handleSendMsg }) {
//   const [msg, setMsg] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const handleEmojiPickerhideShow = () => {
//     setShowEmojiPicker(!showEmojiPicker);
//   };

//   const handleEmojiClick = (emojiObject) => {
//     setMsg((prevMsg) => prevMsg + emojiObject.emoji);
//   };

//   const sendChat = (event) => {
//     event.preventDefault();
//     if (msg.trim().length > 0) {
//       handleSendMsg(msg);
//       setMsg("");
//     }
//   };

//   return (
//     <Container>
//       <div className="button-container">
//         <div className="emoji">
//           <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
//           {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
//         </div>
//       </div>
//       <form className="input-container" onSubmit={sendChat}>
//         <input
//           type="text"
//           placeholder="Type your message here"
//           onChange={(e) => setMsg(e.target.value)}
//           value={msg}
//         />
//         <button type="submit">
//           <IoMdSend />
//         </button>
//       </form>
//     </Container>
//   );
// }

// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 1rem;
//   background-color: #080420;
//   border-top: 1px solid #9a86f3;
//   @media screen and (min-width: 720px) and (max-width: 1080px) {
//  padding:0 1rem;
//  gap:1rem;
//   }
//   .button-container {
//     margin-right: 1rem;
//     .emoji {
//       position: relative;
//       svg {
//         font-size: 1.5rem;
//         color: #ffff00c8;
//         cursor: pointer;
//       }
//       .emoji-picker-react {
//         position: absolute;
//         top: -350px;
//         background-color: #080420;
//         box-shadow: 0 5px 10px #9a86f3;
//         border-color: #9a86f3;
//         .emoji-scroll-wrapper::-webkit-scrollbar {
//           background-color: #080420;
//           width: 5px;
//         }
//         .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
//           background-color: #9a86f3;
//         }
//         .emoji-categories button {
//           filter: contrast(0);
//         }
//         .emoji-search {
//           background-color: transparent;
//           border-color: #9a86f3;
//         }
//         .emoji-group:before {
//           background-color: #080420;
//         }
//       }
//     }
//   }

//   .input-container {
//     flex: 1;
//     display: flex;
//     align-items: center;
//     background-color: #ffffff34;
//     border-radius: 2rem;
//     padding: 0.5rem 1rem;

//     input {
//       flex-grow: 1;
//       background: transparent;
//       color: white;
//       border: none;
//       font-size: 1rem;
//       padding: 0 1rem;

//       &::selection {
//         background-color: #9a86f3;
//       }

//       &:focus {
//         outline: none;
//       }
//     }

//     button {
//       background-color: #9a86f3;
//       border: none;
//       border-radius: 50%;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       padding: 0.5rem;
//       cursor: pointer;
//       @media screen and (min-width: 720px) and (max-width: 1080px) {
//        padding:0.3rem 1rem;
//        svg{
//         font-size:1rem;
//        }
//   }
//       svg {
//         font-size: 1.5rem;
//         color: white;
//       }
//     }
//   }
// `;
//......................
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const containerRef = useRef();

  // Toggle emoji picker visibility
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji click
  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  // Send chat message
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
        containerRef.current && !containerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div ref={emojiPickerRef}>
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #080420;
  border-top: 1px solid #9a86f3;
  position: relative;

  .button-container {
    margin-right: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        bottom: 50px; /* Move picker above input field */
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        z-index: 2;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
        }
        .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
          background-color: #9a86f3;
        }
        .emoji-categories button {
          filter: contrast(0);
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #ffffff34;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    position: relative; /* Ensure emoji picker doesn't push this element */

    input {
      flex-grow: 1;
      background: transparent;
      color: white;
      border: none;
      font-size: 1rem;
      padding: 0 1rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      background-color: #9a86f3;
      border: none;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      cursor: pointer;
      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }
`;
