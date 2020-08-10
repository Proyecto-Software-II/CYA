var express = require('express');
var app = express();
var { config } = require('./config');
var usersApi = require('./routes/users');

// body parser
app.use(express.json());

//routes
usersApi(app);

// ping
app.get('/ping', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    serverDate: moment.now(),
    message: 'pong!! 🏓',
  });
});

app.listen(config.port, () => {
  console.log(`Escuchando en el puerto ${config.port}`);
});
