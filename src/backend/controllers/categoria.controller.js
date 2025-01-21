const pool = require('../db/dbConnection.js');
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');
const categoriaController = {};
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')

categoriaController.getcategoria = async (req, res, next) => {
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

    const categoria = await pool.query(`
      SELECT 
        nombre AS "categoria", 
        id AS "id_categoria", 
        activo AS "categoria_activo"
      FROM categoria
      WHERE key_id = $1
        AND ($2::boolean IS NULL OR activo = $2)
      ORDER BY nombre ASC;
    `, [keyId, activeFilter]);

    res.status(200).json(categoria.rows);
  } catch (err) {
    next(err);
  }
};

categoriaController.getcategoriabyID = async (req, res, next) => {
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

    const categoria = await pool.query(`
      SELECT 
        nombre AS "categoria", 
        id AS "id_categoria", 
        activo AS "categoria_activo"
      FROM categoria
      WHERE key_id = $1 and id = $2
      ORDER BY nombre ASC;
    `, [keyId, id]);

    if (categoria.rows.length === 0) {
      return res.status(404).json({ message: "categoriaGasto not found" });
    }
    res.json(categoria.rows);
  } catch (error) {
    next(error);
  }
};

categoriaController.createcategoria = async (req, res, next) => {
  try {
    const { nombre } = req.body;
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

    const newcategoria = await pool.query(
      `INSERT INTO categoria (nombre, key_id) 
       VALUES ($1, $2)
       ON CONFLICT (nombre, key_id)
       DO UPDATE SET activo = CASE 
           WHEN categoria.activo IS NOT TRUE THEN EXCLUDED.activo
           ELSE categoria.activo
       END
       RETURNING *`,
      [nombre, keyId]
    );
    
    res.status(200).json(newcategoria.rows);
  } catch (err) {
    next(err);
  }
};

categoriaController.updatecategoria = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
    const { nombre, activo } = req.body; 
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

    const updatecategoria = await pool.query(
      `UPDATE categoria SET nombre = $1, activo = $2 WHERE id = $3 AND key_id = $4 RETURNING *`,
      [nombre,activo, id, keyId]
    );
    if (updatecategoria.rows.length === 0) {
      return res.status(404).json({ message: "categoria not found" });
    }
    return res.json(updatecategoria.rows);
  } catch (error) {
    next(error);
  }
};

categoriaController.deletecategoria = async (req, res, next) => {
  try {
    const { keyId,id } = req.params;
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

    const updateCategoria = await pool.query(
      `UPDATE categoria SET activo =  not activo WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (updateCategoria.rows.length === 0) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    return res.json(updateCategoria.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = categoriaController;
