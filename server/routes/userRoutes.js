const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/User');
const Contact=require('../models/Contact');
const auth=require('../middleware/auth');
const jwt=require('jsonwebtoken');

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *         token:
 *           type: string
 *           description: JWT token para autenticación
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * @swagger
 * tags:
 *   name: Users
 *   description: API de gestión de usuarios
 * 
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Error en los datos proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * 
 * @swagger
 * /users/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 * 
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Obtiene el perfil de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 * 
 * @swagger
 * /users/profile/{id}:
 *   put:
 *     summary: Actualiza el perfil de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 * 
 * @swagger
/users/block/{userId}:
 *   post:
 *     summary: Bloquea a un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a bloquear
 *     responses:
 *       200:
 *         description: Usuario bloqueado exitosamente
 *       400:
 *         description: Error al bloquear usuario
 */

router.post('/register',async(req,res)=>{
    try {
        const {username,email, password}=req.body;
        
        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Crear usuario con la contraseña hasheada
        const user = await User.create({
            username,
            email,
            password: hashedPassword  // guardamos el hash, no la contraseña en texto plano
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(400).json({error:err.message});
    }
});

router.post('/login', async (req,res)=>{
    const {email,password}= req.body;
    try {
        const user = await User.findOne({where:{email}});
        if(!user) return res.status(404).json({error:'usuario no encontrado'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({error:'contraseña incorrecta'});

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Actualizar estado online
        await user.update({ online: true, lastSeen: new Date() });

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (err) {
        res.status(400).json({error:err.message});
    }
});

// Obtener perfil de usuario
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'username', 'email'] // excluimos password
        });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar perfil
router.put('/profile/:id', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        await user.update({ username, email });
        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/block/:userId', auth, async (req, res) => {
    try {
        const contact = await Contact.findOne({
            where: {
                userId: req.user.id,
                friendId: req.params.userId
            }
        });
        
        if (contact) {
            await contact.update({ status: 'blocked' });
            res.json({ message: 'Usuario bloqueado' });
        } else {
            await Contact.create({
                userId: req.user.id,
                friendId: req.params.userId,
                status: 'blocked'
            });
            res.json({ message: 'Usuario bloqueado' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports =router;