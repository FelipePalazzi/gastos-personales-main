const pool = require('../db/dbConnection.js');

const categoriagastoController = {};

categoriagastoController.getcategoriaGastos = async (req, res, next) => {
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

    const result = await pool.query(`SELECT * FROM categoria WHERE key_id = $1`, [keyId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

categoriagastoController.getcategoriaGastobyID = async (req, res, next) => {
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

    const result = await pool.query(`SELECT * FROM categoria WHERE id = $1 AND key_id = $2`, [id, keyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "categoriaGasto not found" });
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

categoriagastoController.createcategoriaGasto = async (req, res, next) => {
  try {
    const { descripcion } = req.body;
    const { keyId } = req.params;  
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const newcategoriagasto = await pool.query(
      `INSERT INTO categoria (descripcion, key_id) VALUES ($1, $2) RETURNING *`,
      [descripcion, keyId]
    );
    res.status(200).json(newcategoriagasto.rows);
  } catch (err) {
    next(err);
  }
};

categoriagastoController.updatecategoriaGasto = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const { descripcion } = req.body; 
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(
      `UPDATE categoria SET descripcion = $1 WHERE id = $2 AND key_id = $3 RETURNING *`,
      [descripcion, id, keyId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "categoriaGasto not found" });
    }
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

categoriagastoController.deletecategoriaGasto = async (req, res, next) => {
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

    const result = await pool.query(
      `DELETE FROM categoria WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "categoriaGasto not found" });
    }
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = categoriagastoController;
