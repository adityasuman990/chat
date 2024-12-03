
import { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/popcorn.png";

function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState(null);


  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);


  const handleChatChange = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact); 
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          {/* Branding */}
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h3>Bimbo</h3>
          </div>

          {/* Contacts */}
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => handleChatChange(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt={`${contact.username}'s avatar`}
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Current User */}
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt={`${currentUserName}'s avatar`}
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  background-color: #080420;
  overflow: hidden;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.3rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      border-radius: 0.2rem;
    }

    .contact {
      background-color: rgba(255, 255, 255, 0.1);
      min-height: 5rem;
      width: 90%;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      gap: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: white;
        margin: 0;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    .selected {
      background-color: #9186f3;
    }
  }

  .current-user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #0d0d30;
    padding: 1rem;

    .avatar img {
      height: 4rem;
      border-radius: 50%;
    }

    .username h2 {
      color: white;
      margin: 0;
    }
  }
`;

export default Contacts;

