const pool = require('../db/dbConnection.js');

const tipogastoController = {};

tipogastoController.gettipoGastos = async (req, res, next) => {
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
    const result = await pool.query(`SELECT * FROM tipogasto WHERE key_id = $1`, [keyId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

tipogastoController.gettipoGastobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }
    const result = await pool.query(`SELECT * FROM tipogasto WHERE id = $1 AND key_id = $2`, [id, keyId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

tipogastoController.createtipoGasto = async (req, res, next) => {
  try {
    const {descripcion, categoria, responsable} = req.body;
    const { keyId } = req.params;  
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const newtipogasto = await pool.query(`INSERT INTO tipogasto (descripcion, categoria, responsable, key_id) VALUES ($1, $2, $3, $4) RETURNING *`,
     [descripcion, categoria, responsable, keyId]);
    res.status(200).json(newtipogasto.rows);
  } catch (err) {
    next(err);
  }
};

tipogastoController.updatetipoGasto = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const {descripcion, categoria, responsable} = req.body;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(`UPDATE tipogasto SET descripcion = $1 , categoria = $2, responsable = $3 WHERE id = $4 AND key_id = $5 RETURNING *`,
     [descripcion, categoria, responsable,  id, keyId]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

tipogastoController.deletetipoGasto = async (req, res, next) => {
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

    const result = await pool.query(`DELETE FROM tipogasto WHERE id = $1 AND key_id = $2`, [id, keyId]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  module.exports = tipogastoController