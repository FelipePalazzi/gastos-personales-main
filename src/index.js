const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const loadRoutes = require('../src/backend/routes/loadRoutes.js');
const { pagina, symbols } = require('./constants.js');
require('dotenv').config();
const port = process.env.PORT || 3000

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('tiny', {
  skip: (req, res) => res.statusCode < 400
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.get(`${symbols.barra}`, (req, res) => {
  res.json({ message: `${pagina.mensaje}` })
})

loadRoutes(app);

// handling errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  const message = process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message;
  res.status(500).json({ error: message });
});

require('./backend/cronjobs');

app.use(express.static('assets'));

app.listen(port, () => {
  console.log(`Server on port ${port}`)
})