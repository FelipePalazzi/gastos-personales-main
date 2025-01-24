const pool = require('../../db/dbConnection.js');

const hasAccessToKey = async (userId, keyId) => {
    const result = await pool.query(`
        SELECT 1
        FROM user_keys
        WHERE user_id = $1 AND key_id = $2 and estado = $3
    `, [userId, keyId, estado=1]);

    return result.rowCount > 0;
};
module.exports = hasAccessToKey