const pool = require('../db/dbConnection.js');

const responsableingresoController = {};

responsableingresoController.getresponsableIngreso = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }
    const result = await pool.query(`SELECT * FROM responsable WHERE key_id = $1`, [keyId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

responsableingresoController.getresponsableIngresobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE id = $1 AND key_id = $2`, [id, keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(`SELECT * FROM responsable WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

responsableingresoController.createresponsableIngreso = async (req, res, next) => {
  try {
    const {nombre} = req.body;
    const { keyId } = req.params; 
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    } 
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const newresponsableingreso = await pool.query(`INSERT INTO responsable (nombre, key_id) VALUES ($1, $2) RETURNING *`,
     [nombre, keyId]);
    res.status(200).json(newresponsableingreso.rows);
  } catch (err) {
    next(err);
  }
};

responsableingresoController.updateresponsableIngreso = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const {nombre} = req.body;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(`UPDATE responsable SET nombre = $1 WHERE id = $2 AND key_id = $3 RETURNING *`,
     [nombre, id, keyId]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

responsableingresoController.deleteresponsableIngreso = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(`DELETE FROM ingreso WHERE id = $1 AND key_id = $2`, [id, keyId]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  module.exports = responsableingresoController