const fakeUsers = [
    { id: 1, username: 'Juan', email: 'juan@example.com', password: '1234' },
  ];
  
  const fakeChats = [
    { id: 1, name: 'Maria', messages: [{ id: 1, content: 'Hola Juan' }] },
  ];
  
  export const login = (email, password) => {
    const user = fakeUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales incorrectas');
    return user;
  };
  
  export const register = (user) => {
    if (fakeUsers.find((u) => u.email === user.email)) {
      throw new Error('El email ya está registrado');
    }
    fakeUsers.push({ ...user, id: fakeUsers.length + 1 });
    return user;
  };
  
  export const getChats = () => fakeChats;
  
  export const getChatById = (id) => fakeChats.find((c) => c.id === parseInt(id));
  