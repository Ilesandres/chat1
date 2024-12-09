import React from 'react';
import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
  return (
    <div>
      <h2>Lista de Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
