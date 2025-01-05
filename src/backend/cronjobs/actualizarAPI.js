const cron = require('node-cron');
const { symbols } = require('../../constants');
require('dotenv').config();

cron.schedule('*/12 * * * *', () => {
    console.log('Actualizando server');
    fetch(`${process.env.PAGINA_URL}${symbols.barra}`)
     .then(response => response.json())
    .catch(error => console.error(error));
  });