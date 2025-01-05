const fs = require('fs');
const path = require('path');

function loadRoutes(app) {
  const routesPath = path.join(__dirname);
  fs.readdirSync(routesPath)
    .filter(file => file !== 'loadRoutes.js' && file.endsWith('.routes.js'))
    .forEach(file => {
      const route = require(path.join(routesPath, file));
      app.use(route); // Automatically register the routes
    });
}

module.exports = loadRoutes;
