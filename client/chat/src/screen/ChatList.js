import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentChats, logout } from '../modules/api';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(userInfo);
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getRecentChats();
      console.log('Datos recibidos:', data); 
      
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.error('Formato de datos inesperado:', data);
        setError('Error en el formato de datos');
      }
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('Error al cargar las conversaciones');
      if (err.message.includes('No hay usuario autenticado')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleChatClick = (userId) => {
    if (userId) {
      navigate(`/chat/${userId}`);
    } else {
      console.error('ID de usuario inválido');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (err) {
      console.error('Error al formatear fecha:', err);
      return 'Fecha no disponible';
    }
  };

  if (loading) return <div className="loading">Cargando conversaciones...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-list-container">
      <header className="chat-list-header">
        <h2>Conversaciones</h2>
        <div className="user-controls">
          <span className="current-user">
            {currentUser?.username || 'Usuario'}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            No hay conversaciones disponibles
          </div>
        ) : (
          conversations.map((conv) => {
            if (!conv || !conv.otherUser) {
              console.error('Conversación inválida:', conv);
              return null;
            }

            return (
              <div 
                key={conv.conversationId || `conv-${conv.otherUser.id}`}
                className="conversation-item"
                onClick={() => handleChatClick(conv.otherUser.id)}
              >
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h3>{conv.otherUser.username || 'Usuario desconocido'}</h3>
                    <span className={`online-status ${conv.otherUser.online ? 'online' : 'offline'}`} 
                          title={conv.otherUser.online ? 'En línea' : 'Desconectado'}
                    />
                  </div>
                  {conv.messages && conv.messages[0] && (
                    <div className="last-message">
                      <p>{conv.messages[0].content || 'Sin mensaje'}</p>
                      <span className="message-time">
                        {formatDate(conv.messages[0].createdAt)}
                      </span>
                    </div>
                  )}
                </div>
                {conv.messages && conv.messages.some(msg => !msg.read && msg.receiver_id === currentUser.id) && (
                  <span className="unread-indicator">
                    {conv.messages.filter(msg => !msg.read && msg.receiver_id === currentUser.id).length}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
