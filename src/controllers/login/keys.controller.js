const pool = require('../../db/dbConnection.js');
const keysController = {};
require('dotenv').config();

keysController.getkeys = async (req, res) => {
        try {
          const {userId} = req.params;

          const result = await pool.query(`SELECT k.key_id, k.key_name as "Nombre", k.description as "Descripcion" 
                                            FROM keys k 
                                            INNER JOIN user_keys u ON u.key_id = k.key_id 
                                            WHERE u.user_id = $1`, [userId]);
      
          if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron llaves para este usuario.' });
          }
      
          res.status(200).json(result.rows);
        } catch (err) {
          next(err);
        }
      };

keysController.createkey = async (req, res, next) => {
    try {
      const { key_name, description } = req.body;

      const newkey = await pool.query(
        `INSERT INTO keys (key_name, description) VALUES ($1, $2) RETURNING *`,
        [key_name, description]
      );
      res.status(200).json(newkey.rows);
    } catch (err) {
      next(err);
    }
  };

module.exports = keysController;