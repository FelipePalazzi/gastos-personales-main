const cron = require('node-cron');
const pool = require('../db/dbConnection.js'); 

cron.schedule('0 * * * *', async () => {
    console.log('Actualizando codigo de invitacion expirados...');

    try {
        const resultUpdate = await pool.query(`
            UPDATE "keys"
            SET codigo_invitacion = gen_random_uuid(), fecha_expiracion = (now() + '7 days'::interval)
            WHERE fecha_expiracion < NOW()
              AND activo = true
        `);
        console.log(`${resultUpdate.rowCount} codigos de invitacion actualizados.`);
    } catch (error) {
        console.error('Error al actualizar codigos de invitacion:', error);
    }
});
