const pool = require('../db/dbConnection.js');

const gastoController = {};

gastoController.getGastos = async (req, res, next) => {
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
    const result = await pool.query(`SELECT g.id, g.fecha, tg.descripcion as tipogasto, g.tipocambio, g.totalar, g.total , g.descripcion, r.nombre as responsable, c.descripcion as categoria FROM gasto g
            INNER JOIN tipogasto tg ON g.tipogasto = tg.id
            INNER JOIN categoria c ON tg.categoria = c.id
            INNER JOIN responsable r ON g.responsable = r.id WHERE g.key_id = $1`, [keyId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

gastoController.getGastobyID = async (req, res, next) => {
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

    const result = await pool.query(`SELECT g.id, g.fecha, tg.descripcion as tipogasto, g.tipocambio, g.totalar, g.total , g.descripcion, r.nombre as responsable, c.descripcion as categoria FROM gasto g
            INNER JOIN tipogasto tg ON g.tipogasto = tg.id
            INNER JOIN categoria c ON tg.categoria = c.id
            INNER JOIN responsable r ON g.responsable = r.id
            WHERE g.id = $1 AND g.key_id = $2 `, [id, keyId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

gastoController.createGasto = async (req, res, next) => {
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

    const { fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable} = req.body;

    const newgasto = await pool.query(`INSERT INTO gasto (fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable, key_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
     [fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable, keyId]);

    res.status(200).json(newgasto.rows);
  } catch (err) {
    next(err);
  }
};

gastoController.updateGasto = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const { fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable} = req.body;
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }
    const result = await pool.query(`
    UPDATE gasto 
    SET fecha = $1, 
        tipogasto = $2, 
        tipocambio = $3, 
        totalar = $4, 
        total = $5, 
        descripcion = $6, 
        responsable = $7
    WHERE id = $8 AND key_id = $9
    RETURNING *`,
    [fecha, tipogasto, tipocambio, totalar, total, descripcion,responsable, id, keyId]
  );
     if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

gastoController.deleteGasto = async (req, res, next) => {
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

    const result = await pool.query(`DELETE FROM gasto WHERE id = $1 AND key_id = $2`, [id, keyId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = gastoController;