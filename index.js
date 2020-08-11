const express = require('express');
const app = express();
const { config } = require('./config');
const usersApi = require('./routes/users');
const cancellationsApi = require('./routes/cancellations');

// body parser
app.use(express.json());

//routes
usersApi(app);
cancellationsApi(app);

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
