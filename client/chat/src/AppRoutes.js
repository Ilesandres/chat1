import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './screen/Login';
import Register from './screen/Register';
import ChatList from './screen/ChatList';
import Chat from './screen/chat';

const AppRoutes = () => {
  const chats = [
    { id: 1, name: 'Maria', messages: [{ id: 1, content: 'Hola Juan' }] },
  ];

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={(e, p) => console.log(e, p)} />} />
      <Route path="/register" element={<Register onRegister={(u) => console.log(u)} />} />
      <Route path="/chats" element={<ChatList chats={chats} />} />
      <Route path="/chat/:id" element={<Chat chat={chats[0]} />} />
    </Routes>
  );
};

export default AppRoutes;
