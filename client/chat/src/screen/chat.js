import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendMessage, getRecentChats, markConversationAsRead } from '../modules/api';

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user'));
                if (!userInfo) {
                    throw new Error('No hay usuario autenticado');
                }
                setCurrentUser(userInfo);
                await loadMessages();
                await markMessagesAsRead(userInfo);
            } catch (err) {
                console.error('Error al inicializar chat:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initChat();
    }, [userId]);

    const markMessagesAsRead = async (userInfo) => {
        try {
            console.log('Intentando marcar mensajes como leídos. Sender:', userId, 'Receiver:', userInfo.id);
            const result = await markConversationAsRead(userId);
            console.log('Resultado de marcar mensajes:', result);
        } catch (err) {
            console.error('Error al marcar mensajes como leídos:', err);
        }
    };

    const loadMessages = async () => {
        try {
            console.log('Cargando mensajes...');
            const conversations = await getRecentChats();
            const currentConversation = conversations.find(conv => 
                conv.otherUser.id.toString() === userId
            );
            
            if (currentConversation) {
                console.log('Conversación encontrada:', currentConversation);
                setMessages(currentConversation.messages || []);
                setOtherUser(currentConversation.otherUser);
            } else {
                console.log('No se encontró la conversación');
            }
            setError(null);
        } catch (err) {
            console.error('Error al cargar mensajes:', err);
            throw err;
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(userId, newMessage);
            setNewMessage('');
            loadMessages();
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            setError('Error al enviar el mensaje');
        }
    };

    const handleBack = () => {
        navigate('/chats');
    };

    if (loading) return <div className="loading">Cargando chat...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="chat-container">
            <header className="chat-header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <h2>{otherUser?.username || 'Chat'}</h2>
            </header>

            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${
                            message.sender_id.toString() === userId ? 'received' : 'sent'
                        }`}
                    >
                        <div className="message-content">
                            {message.content}
                        </div>
                        <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Chat;
