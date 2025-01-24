const pool = require('../../db/dbConnection.js');

const verifyKeyId = async (req, res, next) => {
    try {
        const { keyId } = req.params;

        if (keyId == null) { 
            return res.status(399).json({ message: 'El parámetro keyId es obligatorio.' });
        }

        const keyCheck = await pool.query(
            `SELECT user_key_id 
             FROM user_keys 
             WHERE key_id = $1`,
            [keyId]
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
