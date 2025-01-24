const pool = require('../db/dbConnection.js');
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const submetodopagoController = {};
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

submetodopagoController.getsubmetodopago = async (req, res, next) => {
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

    const submetodospagos = await pool.query(`
      SELECT 
        nombre AS "submetodo_pago", 
        id AS "id_submetodo_pago", 
        activo AS "submetodo_pago_activo",
        metodo_pago as "id_metodopago"
      FROM submetodopago
      WHERE key_id = $1
        AND ($2::boolean IS NULL OR activo = $2)
      ORDER BY nombre ASC;
    `, [keyId, activeFilter]);

    res.status(200).json(submetodospagos.rows);
  } catch (err) {
    next(err);
  }
};

submetodopagoController.getsubmetodopagobyID = async (req, res, next) => {
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

    const submetodopago = await pool.query(`
      SELECT 
        nombre AS "submetodo_pago", 
        id AS "id_submetodo_pago", 
        activo AS "submetodo_pago_activo",
        metodo_pago as "id_metodopago"
      FROM submetodopago
      WHERE key_id = $1 and id = $2
    `, [keyId, id]);

    if (submetodopago.rows.length === 0) {
      return res.status(404).json({ message: "Submetodo de pago no encontrado" });
    }

    res.json(submetodopago.rows);
  } catch (error) {
    next(error);
  }
};

submetodopagoController.createsubmetodopago = async (req, res, next) => {
  try {
    const { nombre, metodo_pago } = req.body;
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

    const newSubmetodopago = await pool.query(
      `INSERT INTO submetodopago (nombre, metodo_pago, key_id) 
       VALUES ($1, $2, $3)
       ON CONFLICT (nombre, metodo_pago, key_id)
       DO UPDATE SET activo = CASE 
           WHEN submetodopago.activo IS NOT TRUE THEN EXCLUDED.activo
           ELSE submetodopago.activo
       END
       RETURNING *`,
      [nombre, metodo_pago, keyId]
    );
    res.status(200).json(newSubmetodopago.rows);
  } catch (err) {
    next(err);
  }
};

submetodopagoController.updatesubmetodopago = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const { nombre, metodo_pago, activo } = req.body;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const updateSubmetodopago = await pool.query(
      `UPDATE submetodopago 
       SET nombre = $1, metodo_pago = $2 , activo=$3
       WHERE id = $4 AND key_id = $5 RETURNING *`,
      [nombre, metodo_pago, activo, id, keyId]
    );
    if (updateSubmetodopago.rows.length === 0) {
      return res.status(404).json({ message: "Submetodo de pago no encontrado" });
    }

    res.json(updateSubmetodopago.rows);
  } catch (error) {
    next(error);
  }
};

submetodopagoController.deletesubmetodopago = async (req, res, next) => {
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

    const updateSubmetodopago = await pool.query(
      `UPDATE submetodopago SET activo = not activo WHERE id = $1 AND key_id = $2 RETURNING *`,
      [id, keyId]
    );
    if (updateSubmetodopago.rows.length === 0) {
      return res.status(404).json({ message: "Submetodo de pago no encontrado" });
    }

    res.json(updateSubmetodopago.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = submetodopagoController