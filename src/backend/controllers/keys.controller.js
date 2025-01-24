const pool = require('../db/dbConnection.js');
const keysController = {};
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

// Obtener las claves asociadas a un user_id
keysController.getKeysbyUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { estado, activo, nombre, role } = req.query; 
    const activeFilter = activo === 'null' ? null : activo === 'true';

    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ message: 'No tienes acceso a este Usuario.' });
    }
    const result = await pool.query(`
      SELECT k.nombre as "nombre", 
             k.descripcion as "descripcion", 
             k.key_id as "id_key", 
             k.codigo_invitacion as "codigo_invitacion",
             k.activo as "activo",
              CASE 
                  WHEN ruk.nombre = 'admin_creator' THEN 'Dueño'
                  WHEN ruk.nombre = 'admin' THEN 'Administrador'
                  WHEN ruk.nombre = 'user' THEN 'Usuario'
                  WHEN ruk.nombre = 'resumen_only' THEN 'Resumenes'
              END AS "role"
      FROM "keys" k
      LEFT JOIN user_keys uk ON uk.key_id = k.key_id
      LEFT JOIN role_user_keys ruk ON uk.role = ruk.id
      left join user_keys_estado uke on uk.estado = uke.id
      WHERE uk.user_id = $1 AND (uke.nombre ILIKE '%' || $2 || '%' OR $2 = '')
      AND ($3::boolean IS NULL OR activo = $3)
      AND (k.nombre ILIKE '%' || $4 || '%' OR $4 = '')
      AND (
    CASE 
        WHEN ruk.nombre = 'admin_creator' THEN 'Dueño'
        WHEN ruk.nombre = 'admin' THEN 'Administrador'
        WHEN ruk.nombre = 'user' THEN 'Usuario'
        WHEN ruk.nombre = 'resumen_only' THEN 'Resumenes'
    END ILIKE '%' || $5 || '%' OR $5 = ''
  )
      ORDER BY (Lower(k.nombre)) asc
    `, [userId,estado, activeFilter, nombre, role]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron cuentas para este usuario.' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Obtener los usuarios asociados a un key_id
keysController.getUsersByKeyId = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const { estado, role, username, fechaDesde, fechaHasta } = req.query;
    const allowedRoles = ['admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }
    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const result = await pool.query(`
      SELECT u.username as "username", 
            u.user_id as "user_id", 
              CASE 
                  WHEN ruk.nombre = 'admin_creator' THEN 'Dueño'
                  WHEN ruk.nombre = 'admin' THEN 'Administrador'
                  WHEN ruk.nombre = 'user' THEN 'Usuario'
                  WHEN ruk.nombre = 'resumen_only' THEN 'Resumenes'
              END AS "role" 
            uk.fecha_union as "fecha_union",
            CONCAT(
              SUBSTRING(u.email FROM 1 FOR 3), 
              '*****', 
              SUBSTRING(u.email FROM POSITION('@' IN u.email) - 3 FOR 3),
              '@',
              SUBSTRING(u.email FROM POSITION('@' IN u.email) + 1 FOR LENGTH(u.email))
            ) AS "email",
            uk.fecha_salida as "fecha_salida",
            uke.nombre as "estado"
      FROM user_keys uk
      LEFT JOIN users u ON uk.user_id = u.user_id
      LEFT JOIN role_user_keys ruk ON uk.role = ruk.id
      left join "keys" k on k.key_id = uk.key_id 
      left join user_keys_estado uke on uk.estado = uke.id
      WHERE uk.key_id = $1
        AND (uke.nombre ILIKE '%' || $2 || '%' OR $2 = '')
        AND (
          CASE 
              WHEN ruk.nombre = 'admin_creator' THEN 'Dueño'
              WHEN ruk.nombre = 'admin' THEN 'Administrador'
              WHEN ruk.nombre = 'user' THEN 'Usuario'
              WHEN ruk.nombre = 'resumen_only' THEN 'Resumenes'
          END ILIKE '%' || $3 || '%' OR $3 = ''
        )
        AND (u.username ILIKE '%' || $4 || '%' OR $4 = '')
        AND uk.fecha_union BETWEEN $5 AND $6
      ORDER BY 
        CASE 
          WHEN ruk.nombre = 'admin_creator' THEN 0 
          ELSE 1 
        END,
        uk.role ASC,
        uk.fecha_union DESC;
    `, [keyId, estado, role, username, fechaDesde, fechaHasta]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios para esta cuenta.' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

keysController.createkey = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const userId = req.user.userId;
    const newKey = await pool.query(`
      INSERT INTO "keys" (nombre, descripcion, user_creator)
      VALUES ($1, $2, $3) RETURNING *;
    `, [nombre, descripcion, userId]);

    res.status(200).json(newKey.rows);
  } catch (err) {
    next(err);
  }
};

keysController.updatekey = async (req, res, next) => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const { keyId } = req.params;
    const userId = req.user.userId;

    const creatorCheck = await pool.query(
      `SELECT user_creator FROM "keys" WHERE key_id = $1`,
      [keyId]
    );

    if (creatorCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key no encontrada.' });
    }

    if (creatorCheck.rows[0].user_creator !== Number(userId)) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta clave.' });
    }

    const result = await pool.query(
      `
        UPDATE "keys"
        SET nombre = $1, descripcion = $2, codigo_invitacion = gen_random_uuid(), fecha_expiracion = now() + INTERVAL '7 days', activo = $3
        WHERE key_id = $4
        RETURNING *;
      `,
      [nombre, descripcion, activo, keyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Key no encontrada.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

keysController.deletekey = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const userId = req.user.userId;

    const creatorCheck = await pool.query(
      `SELECT user_creator FROM "keys" WHERE key_id = $1`,
      [keyId]
    );

    if (creatorCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Key no encontrada.' });
    }

    if (creatorCheck.rows[0].user_creator !== Number(userId)) {
      return res.status(403).json({ message: 'No tienes permiso para desactivar esta clave.' });
    }

    const result = await pool.query(
      `
        UPDATE "keys"
        SET activo = not activo,
        fecha_expiracion = CASE
        WHEN activo = true THEN NOW()  
        ELSE NOW() + INTERVAL '7 days'  
      END
        WHERE key_id = $1
        RETURNING *;
      `,
      [keyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Key no encontrada.' });
    }

    res.status(200).json({ message: 'La clave ha sido actualizada correctamente.' });
  } catch (err) {
    next(err);
  }
};

module.exports = keysController;
