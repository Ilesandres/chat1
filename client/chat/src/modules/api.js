import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user, token };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Funciones para mensajes y chats
export const getRecentChats = async () => {
    try {
        const response = await api.get('/messages/recent');
        if (!response.data) {
            throw new Error('No se recibieron datos del servidor');
        }
        console.log('Respuesta del servidor:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Error en getRecentChats:', error);
        if (error.response?.status === 401) {
            logout();
            throw new Error('Sesión expirada');
        }
        throw new Error(error.response?.data?.error || 'Error al obtener chats');
    }
};

export const sendMessage = async (receiverId, content) => {
    try {
        const response = await api.post('/messages', {
            receiver_id: receiverId,
            content
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al enviar mensaje');
    }
};

export const markMessageAsRead = async (messageId) => {
    try {
        const response = await api.put(`/messages/${messageId}/read`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al marcar mensaje como leído');
    }
};

// Función para verificar si el token es válido
export const checkAuth = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) throw new Error('No hay usuario autenticado');
        
        // Podríamos hacer una petición al servidor para validar el token
        return user;
    } catch (error) {
        logout();
        throw new Error('Sesión inválida');
    }
};

export const markConversationAsRead = async (senderId) => {
    try {
        console.log('API: Obteniendo mensajes para marcar como leídos');
        const response = await getRecentChats();
        const conversation = response.find(conv => conv.otherUser.id.toString() === senderId);
        
        if (!conversation) return;
        const unreadMessages = conversation.messages.filter(msg => 
            !msg.read && msg.sender_id.toString() === senderId
        );

        console.log('API: Mensajes no leídos encontrados:', unreadMessages.length);
        for (const message of unreadMessages) {
            await markMessageAsRead(message.id);
        }

        return { success: true, messagesRead: unreadMessages.length };
    } catch (error) {
        console.error('API: Error al marcar mensajes como leídos:', error);
        throw new Error('Error al actualizar mensajes');
    }
};

export default api;
  