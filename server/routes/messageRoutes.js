const express=require('express');
const Message=require('../models/Message');
const User=require('../models/User');
const { Op } = require('sequelize');

const router=express.Router();

router.post('/',async(req, res)=>{
    const {content, sender_id, receiver_id}=req.body;

    try {
        const message=await Message.create({content, sender_id,receiver_id});
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({error:err.message});
    };
});

router.get('/:sender_id/:receiver_id',async(req,res)=>{
    const {sender_id, receiver_id}=req.params;

    try {
        const messages= await Message.findAll({
            where:{
                sender_id: sender_id,
                receiver_id: receiver_id,
            },
        });
        res.json(messages);
    } catch (err) {
        res.status(400).json({error:err.message});
        
    };
});

// Obtener últimos mensajes
router.get('/recent/:userId', async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: req.params.userId },
                    { receiver_id: req.params.userId }
                ]
            },
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'sender', attributes: ['username'] },
                { model: User, as: 'receiver', attributes: ['username'] }
            ]
        });
        res.json(messages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Marcar mensaje como leído
router.put('/:messageId/read', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.messageId);
        if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
        
        await message.update({ read: true });
        res.json({ message: 'Mensaje marcado como leído' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports=router;