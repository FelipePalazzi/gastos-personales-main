const pool = require('../db/dbConnection.js');
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const monedaController = {};
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

monedaController.getMoneda = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const { activo } = req.query; // true, false, or null
    const activeFilter = activo === 'null' ? null : activo === 'true';
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const monedas = await pool.query(`
      SELECT
      m.id AS "id_moneda",
      m.activo AS "moneda_activo",
      m.id_moneda as "id_monedasposibles",
      mp.codigo as "codigo_moneda",
      mp.nombre as "nombre_moneda"
      FROM moneda m
      right join monedas_posibles mp on mp.id=m.id_moneda
      WHERE m.key_id = $1
      AND ($2::boolean IS NULL OR m.activo = $2)
      ORDER BY m.id ASC;
    `, [keyId, activeFilter]);

    res.status(200).json(monedas.rows);
  } catch (err) {
    next(err);
  }
};

monedaController.getMonedaFaltante = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const monedas = await pool.query(`
      SELECT 
          mp.nombre AS "nombre_monedas_posibles",
          mp.codigo AS "codigo_monedas_posibles",
          mp.id AS "id_monedas_posibles"
      FROM monedas_posibles mp
      WHERE mp.id NOT IN (
          SELECT m.id_moneda
          FROM moneda m
          WHERE m.key_id = $1
      )
      ORDER BY mp.codigo ASC;
    `, [keyId]);

    res.status(200).json(monedas.rows);
  } catch (err) {
    next(err);
  }
};

monedaController.getMonedabyID = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const monedas = await pool.query(`
      SELECT
      m.id AS "id_moneda",
      m.activo AS "moneda_activo",
      m.id_moneda as "id_monedasposibles",
      mp.codigo as "codigo_moneda",
      mp.nombre as "nombre_moneda"
      FROM moneda m
      right join monedas_posibles mp on mp.id=m.id_moneda
      WHERE m.key_id = $1 and m.id = $2
      ORDER BY m.id ASC;
    `, [keyId, id]);

    if (monedas.rows.length === 0) {
      return res.status(404).json({ message: "Moneda no encontrado" });
    }

    res.json(monedas.rows);
  } catch (err) {
    next(err);
  }
};

monedaController.createMoneda = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const { id_moneda } = req.body;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];
    
    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const newMoneda = await pool.query(
      `INSERT INTO moneda (key_id, id_moneda) 
       VALUES ($1, $2)
       ON CONFLICT (key_id, id_moneda)
       DO UPDATE SET activo = CASE 
           WHEN moneda.activo IS NOT TRUE THEN EXCLUDED.activo
           ELSE moneda.activo
       END
       RETURNING *`,
      [keyId, id_moneda]
    );

    res.status(201).json(newMoneda.rows[0]);
  } catch (err) {
    next(err);
  }
};

monedaController.updateMoneda = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const { id_moneda} = req.body;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];
    
    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const updateMoneda = await pool.query(`
      UPDATE moneda
      SET id_moneda = $1
      WHERE id = $2 AND key_id = $3
      RETURNING *;
    `, [id_moneda, id, keyId]);

    if (updateMoneda.rows.length === 0) {
      return res.status(404).json({ message: 'Moneda no encontrada.' });
    }

    res.status(200).json(updateMoneda.rows[0]);
  } catch (err) {
    next(err);
  }
};

monedaController.deleteMoneda = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];
    
    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta key ID.' });
  }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1`, [keyId]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key ID no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
        return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }
    
    const updateMoneda = await pool.query(
      `UPDATE moneda SET activo = not activo WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (updateMoneda.rows.length === 0) {
      return res.status(404).json({ message: "Moneda no encontrada" });
    }

    res.json(updateMoneda.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = monedaController