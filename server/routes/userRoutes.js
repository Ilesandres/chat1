const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/User');
const Contact=require('../models/Contact');
const auth=require('../middleware/auth');
const jwt=require('jsonwebtoken');

const router=express.Router();

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