const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const sequelize=require('./config/database');
const useRoutes=require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes');
const contactRoutes=require('./routes/contactRoutes');
const Contact = require('./models/Contact');
// Importaciones de Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

require('dotenv').config();

const app=express();
const PORT= process.env.PORT || 3001;

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Mensajería',
            version: '1.0.0',
            description: 'API para sistema de mensajería y contactos',
            contact: {
                name: 'Andres Iles',
                email: 'ilesandres6@gmail.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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


