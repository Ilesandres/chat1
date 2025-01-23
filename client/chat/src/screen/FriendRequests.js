import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getPendingRequests, 
    acceptRequest, 
    rejectRequest,
    searchUsers,
    sendFriendRequest,
    getAcceptedContacts
} from '../modules/api';

const FriendRequests = () => {
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadRequests();
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await getAcceptedContacts();
            setContacts(data);
        } catch (err) {
            console.error('Error al cargar contactos:', err);
        }
    };

    const loadRequests = async () => {
        try {
            const data = await getPendingRequests();
            setRequests(data);
        } catch (err) {
            setError('Error al cargar las solicitudes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setSearching(true);
        try {
            const results = await searchUsers(searchQuery);
            // Filtrar usuarios que ya son contactos o tienen solicitudes pendientes
            const filteredResults = results.filter(user => 
                !contacts.some(contact => contact.friend.id === user.id) &&
                !requests.some(request => request.user.id === user.id)
            );
            setSearchResults(filteredResults);
        } catch (err) {
            setError('Error al buscar usuarios');
        } finally {
            setSearching(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            await sendFriendRequest(userId);
            // Actualizar resultados de búsqueda
            setSearchResults(prev => prev.filter(user => user.id !== userId));
        } catch (err) {
            setError('Error al enviar solicitud');
        }
    };

    const handleAccept = async (contactId) => {
        try {
            await acceptRequest(contactId);
            await loadRequests(); // Recargar la lista
        } catch (err) {
            setError('Error al aceptar la solicitud');
        }
    };

    const handleReject = async (contactId) => {
        try {
            await rejectRequest(contactId);
            await loadRequests(); // Recargar la lista
        } catch (err) {
            setError('Error al rechazar la solicitud');
        }
    };

    if (loading) return <div className="loading">Cargando solicitudes...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="requests-container">
            <header className="requests-header">
                <button onClick={() => navigate('/chats')} className="back-button">
                    ←
                </button>
                <h2>Solicitudes de Amistad</h2>
            </header>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar usuarios..."
                        className="search-input"
                    />
                    <button 
                        onClick={handleSearch}
                        className="search-button"
                        disabled={searching}
                    >
                        {searching ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((user) => (
                            <div key={user.id} className="search-result-item">
                                <div className="user-info">
                                    <h3>{user.username}</h3>
                                    <p>{user.email}</p>
                                </div>
                                <button
                                    onClick={() => handleSendRequest(user.id)}
                                    className="add-button"
                                >
                                    Enviar solicitud
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="requests-list">
                {requests.length === 0 ? (
                    <div className="no-requests">
                        No hay solicitudes pendientes
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="request-item">
                            <div className="request-info">
                                <h3>{request.user.username}</h3>
                                <p className="request-date">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="request-actions">
                                <button
                                    onClick={() => handleAccept(request.id)}
                                    className="accept-button"
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    className="reject-button"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendRequests; 