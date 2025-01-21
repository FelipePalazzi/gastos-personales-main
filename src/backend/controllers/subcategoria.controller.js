const pool = require('../db/dbConnection.js');
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const subcategoriaController = {};
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

subcategoriaController.getsubcategoria = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const { activo } = req.query; // true, false, or null
    const activeFilter = activo === 'null' ? null : activo === 'true';
    const allowedRoles = ['admin', 'admin_creator', 'user'];

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

    const subcategorias = await pool.query(`
      SELECT 
        nombre AS "subcategoria", 
        id AS "id_subcategoria", 
        activo AS "subcategoria_activo",
        categoria AS "id_categoria",
        responsable AS "id_responsable"
      FROM subcategoria
      WHERE key_id = $1
        AND ($2::boolean IS NULL OR activo = $2)
      ORDER BY nombre ASC;
    `, [keyId, activeFilter]);

    res.status(200).json(subcategorias.rows);
  } catch (err) {
    next(err);
  }
};

subcategoriaController.getsubcategoriabyID = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator', 'user'];

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

    const subcategoria = await pool.query(`
      SELECT 
        nombre AS "subcategoria", 
        id AS "id_subcategoria", 
        activo AS "subcategoria_activo",
        categoria AS "id_categoria",
        responsable AS "id_responsable"
      FROM subcategoria
      WHERE key_id = $1 and id = $2
    `, [keyId, id]);

    if (subcategoria.rows.length === 0) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    res.json(subcategoria.rows);
  } catch (error) {
    next(error);
  }
};

subcategoriaController.createsubcategoria = async (req, res, next) => {
  try {
    const { nombre, categoria, responsable } = req.body;
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

    const newSubcategoria = await pool.query(
      `INSERT INTO subcategoria (nombre, categoria, responsable, key_id) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (nombre, categoria, responsable, key_id)
       DO UPDATE SET activo = CASE 
           WHEN subcategoria.activo IS NOT TRUE THEN EXCLUDED.activo
           ELSE subcategoria.activo
       END
       RETURNING *`,
      [nombre, categoria, responsable, keyId]
    );
    res.status(200).json(newSubcategoria.rows);
  } catch (err) {
    next(err);
  }
};

subcategoriaController.updatesubcategoria = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const { nombre, categoria, responsable, activo } = req.body; 
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

    const updateSubcategoria = await pool.query(
      `UPDATE subcategoria 
       SET nombre = $1, categoria = $2, responsable = $3, activo = $4
       WHERE id = $5 AND key_id = $6 RETURNING *`,
      [nombre, categoria, responsable,activo, id, keyId]
    );
    if (updateSubcategoria.rows.length === 0) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    res.json(updateSubcategoria.rows);
  } catch (error) {
    next(error);
  }
};

subcategoriaController.deletesubcategoria = async (req, res, next) => {
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

    const updateSubcategoria = await pool.query(
      `UPDATE subcategoria SET activo = not activo WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (updateSubcategoria.rows.length === 0) {
      return res.status(404).json({ message: "Subcategoria no encontrada" });
    }

    res.json(updateSubcategoria.rows);
  } catch (error) {
    next(error);
  }
};

  module.exports = subcategoriaController