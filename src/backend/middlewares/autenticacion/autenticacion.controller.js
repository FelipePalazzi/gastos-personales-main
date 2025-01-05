const jwt = require('jsonwebtoken');
const loginController = require('../../controllers/login.controller.js');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(403).send('Token requerido');
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          const refreshToken = req.headers['refresh-token'];

          if (!refreshToken) {
              return res.status(403).send('Refresh token requerido');
          }

          try {
              const newTokens = await loginController.refreshToken(req, res);
              if (newTokens.error) {
                  return res.status(403).send(newTokens.error);
              }

              res.set('Authorization', `Bearer ${newTokens.accessToken}`);
              res.set('refresh-token', newTokens.refreshToken);
              req.user = jwt.decode(newTokens.accessToken);
              return next();
          } catch (refreshError) {
              return res.status(403).send('No se pudo renovar el token');
          }
      }
      return res.status(403).send('Token inválido');
  }
};

module.exports = authenticateToken;
