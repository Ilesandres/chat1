const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Agregar contacto
router.post('/add', auth, async (req, res) => {
    try {
        const { friendId } = req.body;
        
        // Verificar si ya existe el contacto
        const existingContact = await Contact.findOne({
            where: {
                userId: req.user.id,
                friendId: friendId
            }
        });

        if (existingContact) {
            return res.status(400).json({ error: 'El contacto ya existe' });
        }

        const contact = await Contact.create({
            userId: req.user.id,
            friendId: friendId,
            status: 'pending'
        });

        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Listar contactos
router.get('/', auth, async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.user.id);

        const contacts = await Contact.findAll({
            where: {
                userId: req.user.id,
                status: 'accepted'
            },
            include: [{
                model: User,
                as: 'friend',
                attributes: ['id', 'username', 'email']
            }]
        });

        console.log('Contactos encontrados:', contacts.length);
        res.json(contacts);
    } catch (err) {
        console.error('Error al listar contactos:', err);
        res.status(400).json({ error: err.message });
    }
});

// Aceptar contacto
router.put('/accept/:contactId', auth, async (req, res) => {
    try {
        const contact = await Contact.findOne({
            where: {
                id: req.params.contactId,
                friendId: req.user.id,
                status: 'pending'
            }
        });

        if (!contact) {
            return res.status(404).json({ error: 'Solicitud de contacto no encontrada' });
        }

        await contact.update({ status: 'accepted' });
        res.json({ message: 'Contacto aceptado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Endpoint de prueba
router.get('/debug', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const allContacts = await Contact.findAll({
            where: { userId },
            raw: true // Para ver los datos planos
        });
        
        res.json({
            userId,
            contactsCount: allContacts.length,
            contacts: allContacts
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         friendId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, accepted, blocked]
 * 
 * @swagger
 * /contacts:
 *   get:
 *     summary: Obtiene todos los contactos del usuario autenticado
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contactos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   friendId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   friend:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *       401:
 *         description: No autorizado - Token inválido
 * 
 * @swagger
 * /contacts/add:
 *   post:
 *     summary: Agrega un nuevo contacto
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - friendId
 *             properties:
 *               friendId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *       400:
 *         description: Error en la solicitud o contacto ya existe
 *       401:
 *         description: No autorizado
 * 
 * @swagger
 * /contacts/accept/{contactId}:
 *   put:
 *     summary: Acepta una solicitud de contacto
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto a aceptar
 *     responses:
 *       200:
 *         description: Contacto aceptado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Solicitud de contacto no encontrada
 *       401:
 *         description: No autorizado
 * 
 * @swagger
 * /contacts/debug:
 *   get:
 *     summary: Obtiene información de debug de contactos
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información de debug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 contactsCount:
 *                   type: integer
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 */

module.exports = router; 