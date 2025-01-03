const cron = require('node-cron');
const { symbols } = require('../../constants');
require('dotenv').config();

cron.schedule('*/12 * * * *', () => {
    console.log('Actualizando server');
    fetch(`${process.env.PAGINA_URL}${symbols.barra}`)
     .then(response => response.json())
     .then(data => console.log(data))
    .catch(error => console.error(error));
  });