const pool = require('../db/dbConnection.js');
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const responsableController = {};
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

responsableController.getresponsable = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const { activo } = req.query; // true, false, or null
    const activeFilter = activo === 'null' ? null : activo === 'true';
    const allowedRoles = ['admin', 'admin_creator', 'user'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const responsables = await pool.query(`
      SELECT 
        nombre AS "responsable", 
        id AS "id_responsable", 
        activo AS "responsable_activo"
      FROM responsable
      WHERE key_id = $1
        AND ($2::boolean IS NULL OR activo = $2)
      ORDER BY nombre ASC;
    `, [keyId, activeFilter]);

    res.status(200).json(responsables.rows);
  } catch (err) {
    next(err);
  }
};

responsableController.getresponsablebyID = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator', 'user'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const responsable = await pool.query(`
      SELECT 
        nombre AS "responsable", 
        id AS "id_responsable", 
        activo AS "responsable_activo"
      FROM responsable
      WHERE key_id = $1 and id = $2
    `, [keyId, id]);

    if (responsable.rows.length === 0) {
      return res.status(404).json({ message: "Responsable no encontrado" });
    }

    res.json(responsable.rows);
  } catch (error) {
    next(error);
  }
};

responsableController.createresponsable = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const newResponsable = await pool.query(
      `INSERT INTO responsable (nombre, key_id) 
       VALUES ($1, $2)
       ON CONFLICT (nombre, key_id)
       DO UPDATE SET activo = CASE 
           WHEN responsable.activo IS NOT TRUE THEN EXCLUDED.activo
           ELSE responsable.activo
       END
       RETURNING *`,
      [nombre, keyId]
    );
    res.status(200).json(newResponsable.rows);
  } catch (err) {
    next(err);
  }
};

responsableController.updateresponsable = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const { nombre, activo } = req.body;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const updateResponsable = await pool.query(
      `UPDATE responsable SET nombre = $1, activo=$2 WHERE id = $3 AND key_id = $4 RETURNING *`,
      [nombre, activo, id, keyId]
    );
    if (updateResponsable.rows.length === 0) {
      return res.status(404).json({ message: "Responsable no encontrado" });
    }

    res.json(updateResponsable.rows);
  } catch (error) {
    next(error);
  }
};

responsableController.deleteresponsable = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const updateResponsable = await pool.query(
      `UPDATE responsable SET activo = not activo WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (updateResponsable.rows.length === 0) {
      return res.status(404).json({ message: "Responsable no encontrado" });
    }

    res.json(updateResponsable.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = responsableController