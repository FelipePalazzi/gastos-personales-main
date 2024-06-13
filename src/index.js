import express from "express"
import cors from "cors"
import morgan from "morgan"
import router from "./routes/gasto.routes.js"
import router2 from "./routes/tipogasto.routes.js"
import router3 from "./routes/categoriagasto.routes.js"
import router4 from "./routes/ingreso.routes.js"
import router5 from "./routes/monedaingreso.routes.js"
import router6 from "./routes/responsableingreso.routes.js"
import router7 from "./routes/resumen.routes.js"
import cron from 'node-cron';
import {pagina,symbols } from './constants'

const { port } = require('./db/config.js')


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

// handling errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({ error: err.message })
});

cron.schedule('*/14 * * * *', () => {
  console.log('Actualizando server');
  fetch(`${pagina.pagina}${symbols.barra}`)
   .then(response => response.json())
   .then(data => console.log(data))
  .catch(error => console.error(error));
});

app.listen(port, () => {
  console.log(`Server on port ${port}`)
})