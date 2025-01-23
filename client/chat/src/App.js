import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screen/Login';
import ChatList from './screen/ChatList';
import Chat from './screen/Chat';
import FriendRequests from './screen/FriendRequests';
import Register from './screen/Register';

const App = () => {
  // Función para verificar si hay un token
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Componente para rutas protegidas
  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/chats" /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated() ? <Navigate to="/chats" /> : <Register />
        } />
        <Route path="/chats" element={
          <PrivateRoute>
            <ChatList />
          </PrivateRoute>
        } />
        <Route path="/chat/:userId" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
        <Route path="/requests" element={
          <PrivateRoute>
            <FriendRequests />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/chats" />} />
      </Routes>
    </Router>
  );
};

export default App;
