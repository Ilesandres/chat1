const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');

const router = express.Router();

// Agregar contacto
router.post('/add', async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const contact = await Contact.create({ userId, friendId });
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Listar contactos
router.get('/:userId', async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            where: {
                userId: req.params.userId,
                status: 'accepted'
            },
            include: {
                model: User,
                as: 'friend',
                attributes: ['username', 'email']
            }
        });
        res.json(contacts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 