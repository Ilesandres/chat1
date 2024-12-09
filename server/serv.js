const express=require('express');
const cors=require('cors')
const bodyParser=require('body-parser');
const sequelize=require('./config/database');
const useRoutes=require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes');
const contactRoutes=require('./routes/contactRoutes');
const Contact = require('./models/Contact');

require('dotenv').config();

const app=express();
const PORT= process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users',useRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contacts', contactRoutes);

sequelize.authenticate().then(()=>{
    console.log('conectado a la base de datos');
    return sequelize.sync({alter:true});
}).then(()=>{
    app.listen(PORT,()=>{
        console.log('servidor corriendo en http://localhost:'+PORT)
    })
}).catch((err)=>{
    console.error('error al conectar la base de datos',err);
})


