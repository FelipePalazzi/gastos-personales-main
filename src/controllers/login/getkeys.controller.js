const pool = require('../../db/dbConnection.js');
const getkeys = {};
require('dotenv').config();

getkeys.conseguirllaves = async (req, res) => {
    const { userId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token requerido.');
    }

    try {
        await pool.query(`SELECT k.key_id, k.key_name as "Nombre", k.description as "Descripcion" FROM keys k INNER JOIN user_keys u on u.key_id=k.key_id WHERE u.user_id=$1`, [userId]);
        res.status(200).send('Acceso eliminado');
    } catch (error) {
        res.status(403).send('Token inválido o expirado');
    }
};

module.exports = getkeys;