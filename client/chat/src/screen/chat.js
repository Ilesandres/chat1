import React, { useState } from 'react';

const Chat = ({ chat }) => {
  const [messages, setMessages] = useState(chat.messages || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    const message = { id: messages.length + 1, content: newMessage };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat con {chat.name}</h2>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default Chat;
