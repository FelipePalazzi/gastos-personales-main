const pool = require('../../db/dbConnection.js');

const hasAccessToKey = async (userId, keyId) => {
    const estado = 1;
    const result = await pool.query(`
        SELECT 1
        FROM user_keys
        WHERE user_id = $1 AND key_id = $2 AND estado = $3
    `, [userId, keyId, estado]);

    return result.rowCount > 0;
};

module.exports = hasAccessToKey;
