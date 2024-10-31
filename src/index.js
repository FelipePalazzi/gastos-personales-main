const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cron = require('node-cron');
const router = require('./routes/gasto.routes.js');
const router2 = require('./routes/tipogasto.routes.js');
const router3 = require('./routes/categoriagasto.routes.js');
const router4 = require('./routes/ingreso.routes.js');
const router5 = require('./routes/monedaingreso.routes.js');
const router6 = require('./routes/responsableingreso.routes.js');
const router7 = require('./routes/resumen.routes.js');
const login = require('./routes/login/login.routes.js');
const { pagina, symbols } = require('./constants.js');
require('dotenv').config();
const port = process.env.PORT || 3000



const app = express()

// Middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.get(`${symbols.barra}`, (req, res) => {
  res.json({ message: `${pagina.mensaje}` })
})

app.use(router)
app.use(router2)
app.use(router3)
app.use(router4)
app.use(router5)
app.use(router6)
app.use(router7)
app.use(login)

// handling errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.log(err)
  res.status(500).json({ error: err.message })
});

cron.schedule('*/12 * * * *', () => {
  console.log('Actualizando server');
  fetch(`${process.env.PAGINA_URL}${symbols.barra}`)
   .then(response => response.json())
   .then(data => console.log(data))
  .catch(error => console.error(error));
});

app.listen(port, () => {
  console.log(`Server on port ${port}`)
})