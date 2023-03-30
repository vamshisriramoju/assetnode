require("dotenv").config();
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log(authHeader);
  if (authHeader) {
    jwt.verify(authHeader, process.env.SECRET, (err, user) => {
      console.log(err, user);
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
