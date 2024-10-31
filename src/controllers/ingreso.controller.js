const pool = require('../db/dbConnection.js');

const ingresoController = {};

ingresoController.getIngreso = async (req, res, next) => {
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
    const result = await pool.query(`SELECT i.id, i.fecha, r.nombre as responsable, m.descripcion as moneda, i.importe, i.tipocambio, i.descripcion  FROM ingreso i
            INNER JOIN moneda m ON i.moneda = m.id
            INNER JOIN responsable r ON i.responsable = r.id WHERE i.key_id = $1`, [keyId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

ingresoController.getIngresobyID = async (req, res, next) => {
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
    const result = await pool.query(`SELECT i.id, i.fecha, r.nombre as responsable, m.descripcion as moneda, i.importe, i.tipocambio, i.descripcion  FROM ingreso i
            INNER JOIN moneda m ON i.moneda = m.id
            INNER JOIN responsable r ON i.responsable = r.id
            WHERE i.id = $1 AND i.key_id = $2`, [id, keyId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Ingreso not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

ingresoController.createIngreso = async (req, res, next) => {
  try {
    const { fecha, responsable, moneda, importe, tipocambio, descripcion} = req.body;
    const { keyId } = req.params; 
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const newingreso = await pool.query(`INSERT INTO ingreso (fecha, responsable, moneda, importe, tipocambio, descripcion, key_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
     [fecha, responsable, moneda, importe, tipocambio, descripcion, keyId]);

    res.status(200).json(newingreso.rows);
  } catch (err) {
    next(err);
  }
};

ingresoController.updateIngreso = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const keyIdNum = Number(keyId);
    
    if (!req.user.keyIds.includes(keyIdNum)) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
    }
    const { fecha, responsable, moneda, importe, tipocambio, descripcion} = req.body;
    const keyCheck = await pool.query(`SELECT * FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const result = await pool.query(`
    UPDATE ingreso 
    SET fecha = $1, 
        responsable = $2, 
        moneda = $3, 
        importe = $4, 
        tipocambio = $5, 
        descripcion = $6
    WHERE id = $7 AND key_id = $8
    RETURNING *`,
    [fecha, responsable, moneda, importe, tipocambio, descripcion, id, keyId]
  );
     if (result.rows.length === 0)
      return res.status(404).json({ message: "Ingreso not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

ingresoController.deleteIngreso = async (req, res, next) => {
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
      return res.status(404).json({ message: "Ingreso not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = ingresoController