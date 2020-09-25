const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var cors = require('cors');
const { config } = require('./config');
const usersApi = require('./routes/users');
const cancellationsApi = require('./routes/cancellations');
const openingsApi = require('./routes/openings');

app.use(cors());

app.use('/static', express.static('files'));
app.use('/formats', express.static('formats'));

// body parser
app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

//routes
usersApi(app);
cancellationsApi(app);
openingsApi(app);

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
