const pool = require('../../db/dbConnection.js');

const verifyKeyId = async (req, res, next) => {
    try {
        const { keyId } = req.params;

        if (keyId == null) { 
            return res.status(399).json({ message: 'El parámetro keyId es obligatorio.' });
        }

        const estadoKeyCheck = 1;
        const keyCheck = await pool.query(
            `SELECT user_key_id 
             FROM user_keys 
             WHERE key_id = $1 AND estado = $2`,
            [keyId, estadoKeyCheck]
        );

        if (keyCheck.rows.length === 0) {
            return res.status(404).json({ message: 'ID cuenta no válida o inactiva.' });
        }

        next();
    } catch (error) {
        next(error); 
    }
};

module.exports = verifyKeyId;
