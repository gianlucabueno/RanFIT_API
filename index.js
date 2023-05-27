const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const allRoutes = require('./routes/all-route');
const session = require('express-session');

const app = express();

// Configuração do middleware de sessão
app.use(
    session({
      secret: 'mySecretKey',
      resave: false,
      saveUninitialized: false,
    })
);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', allRoutes.routes);



app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
