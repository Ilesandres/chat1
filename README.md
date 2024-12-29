
proyecto de chat simple (aun sin unir server con cliente)

ruta de back:  `` localhost:3005/api``<br/>
doc-test:     ``localhost:3005/api-docs/*/``

- *TECNOLOGIAS*
    - node <br>
        * sql2 <br/>
        * expres<br>
        * socket.io <br>
        * dotenv <br>
        * cors <br>

        secure
        * body-parser
        * helmet
        * morgan<br>
        ```` 
        npm install express socket.io dotenv cors helmet morgan
        ````
        
        ````
        npm install --save-dev nodemon
        ````
    - react
        * react
        * react-dom
        * socket.io-client
        * react-router-dom
        * axios <br>

        design
        * styled-components
        *   tailwindcss
        * bootstrap
        ````
        npm install socket.io-client axios react-router-dom
        ````
- *DISTRIBUCION DE CARPETAS*  
    
    - client<br>
       - node_modules<br>
       - public<br>
       - src <br>
           - modules
           - screen
           - App.css
           -  App.js
           - AppRoutes.js
           - index.css
           - index.js
           - logo.svg
           - reportWebVitals.js
           - setuptes.js
           - package-lock.json
           - package.json
           - README.MD
    - server
        -config
            database.js
        - docs
            - sql data.sql
        -middleware
            -auth.js
        -models
            -Contact.js  
            -Message.js
            -User.js
            -Group.js
            -Notification.js
        -routes
            -messageRoutes.js
            -userRoutes.js
            -contactRoutes.js
        -uploads
        -node_modules
        -package-lock.json
        -package.json
        -.env
        -serv.js
    - README.md

![Tienda en linea SQl](https://github.com/Ilesandres/img_Proyects/blob/main/chatapp/image.png)