-- Asegúrate de usar InnoDB como motor de almacenamiento
CREATE DATABASE ChatApp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ChatApp;

-- Tabla de usuarios
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada usuario
    username VARCHAR(50) NOT NULL UNIQUE,   -- Nombre de usuario único
    email VARCHAR(100) NOT NULL UNIQUE,     -- Email único
    password_hash VARCHAR(255) DEFAULT NULL, -- Contraseña hash, por defecto NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de actualización
) ENGINE=INNODB;

-- Tabla para los mensajes
CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada mensaje
    sender_id INT NOT NULL,                    -- ID del usuario que envía el mensaje
    receiver_id INT NOT NULL,                  -- ID del usuario que recibe el mensaje
    content TEXT NOT NULL,                     -- Contenido del mensaje
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del envío
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE, -- Relación con tabla Users
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Relación con tabla Users
) ENGINE=INNODB;

-- Tabla para almacenar las sesiones (opcional)
CREATE TABLE Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada sesión
    user_id INT NOT NULL,                      -- ID del usuario
    session_token VARCHAR(255) NOT NULL,       -- Token de sesión único
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de inicio de sesión
    expires_at DATETIME NOT NULL,             -- Fecha de expiración de la sesión
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE -- Relación con tabla Users
) ENGINE=INNODB;

-- Tabla de amigos/contactos (opcional)
CREATE TABLE Contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada relación
    user_id INT NOT NULL,                      -- ID del usuario
    friend_id INT NOT NULL,                    -- ID del amigo/contacto
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del contacto
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, friend_id) -- Asegurar que no se repitan las relaciones
) ENGINE=INNODB;
