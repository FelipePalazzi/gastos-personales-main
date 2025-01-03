const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const gasto = require('./backend/routes/gasto.routes.js');
const ingreso = require('./backend/routes/ingreso.routes.js')
const categoria = require('./backend/routes/categoria.routes.js');
const metodopago = require('./backend/routes/metodopago.routes.js');
const moneda = require('./backend/routes/moneda.routes.js');
const monedasposibles = require('./backend/routes/monedasposibles.routes.js')
const responsable = require('./backend/routes/responsable.routes.js')
const subcategoria = require('./backend/routes/subcategoria.routes.js')
const submetodopago = require('./backend/routes/submetodopago.routes.js')
const keys = require('./backend/routes/keys.routes.js')
const login = require('./backend/routes/login.routes.js');
const invitaciones = require('./backend/routes/invitaciones.routes.js')
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

app.use(categoria)
app.use(gasto)
app.use(ingreso)
app.use(invitaciones)
app.use(keys)
app.use(login)
app.use(metodopago)
app.use(moneda)
app.use(monedasposibles)
app.use(responsable)
app.use(subcategoria)
app.use(submetodopago)

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

app.listen(port, () => {
  console.log(`Server on port ${port}`)
})