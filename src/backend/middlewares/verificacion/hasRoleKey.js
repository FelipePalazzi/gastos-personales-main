const pool = require('../../db/dbConnection.js');

const hasRoleKey = async (userId, keyId, allowedRoles) => {
    const result = await pool.query(`
        SELECT r.nombre AS role
        FROM user_keys uk
        JOIN role_user_keys r ON uk.role = r.id
        WHERE uk.user_id = $1 AND uk.key_id = $2 and uk.estado = $3
    `, [userId, keyId, estado=1]);

    if (result.rowCount === 0) {
        return null;
    }

    const userRole = result.rows[0].role;

    return allowedRoles.includes(userRole) ? userRole : null;
};

module.exports = hasRoleKey;
