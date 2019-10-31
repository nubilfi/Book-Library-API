const jwt = require('jsonwebtoken');

const opts = require('../config/options');

exports.TokenVerification = (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization) {
    const bearerValue = authorization.split(' ');
    token = bearerValue[bearerValue.length - 1];
  } else {
    token = req.body.token || req.query.token;
  }

  // token value is ready to use
  if (token) {
    jwt.verify(token, opts.jwtSecret.tokenKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ success: false, message: 'Failed to authenticate the token!', error: err });
        return;
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(403).json({ success: false, message: 'No token provided!' });
  }
};
