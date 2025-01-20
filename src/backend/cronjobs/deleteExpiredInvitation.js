const cron = require('node-cron');
const pool = require('../db/dbConnection.js'); 

cron.schedule('0 * * * *', async () => {
    console.log('Actualizando estado de invitaciones a expiradas...');

    try {
        const resultUpdate = await pool.query(`
            UPDATE invitaciones
            SET estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Expirada')
            WHERE fecha_expiracion < NOW()
              AND estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Pendiente')
        `);
        console.log(`${resultUpdate.rowCount} invitaciones actualizadas a estado expirado.`);
    } catch (error) {
        console.error('Error al actualizar estado de invitaciones a expiradas:', error);
    }
});

cron.schedule('5 0 * * *', async () => {
    console.log('Eliminando invitaciones expiradas hace más de 1 mes...');

    try {
        const resultDelete = await pool.query(`
            DELETE FROM invitaciones
            WHERE fecha_expiracion < NOW() - INTERVAL '31 days'
              AND estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Expirada')
        `);
        console.log(`${resultDelete.rowCount} invitaciones expiradas eliminadas.`);
    } catch (error) {
        console.error('Error al eliminar invitaciones expiradas:', error);
    }
});
