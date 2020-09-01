const verifyTokenMiddleware = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You must provide a token',
    });
  }
};

module.exports = verifyTokenMiddleware;
