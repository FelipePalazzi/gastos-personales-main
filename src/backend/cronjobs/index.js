const fs = require('fs');
const path = require('path');

// Ruta donde están los cron jobs
const cronJobsPath = path.join(__dirname);

// Lee todos los archivos en la carpeta cronjobs
fs.readdirSync(cronJobsPath)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Excluye 'index.js' y solo toma los archivos .js
  .forEach(file => {
    require(path.join(cronJobsPath, file)); // Importa cada archivo
  });
