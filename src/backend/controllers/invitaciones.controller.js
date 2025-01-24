const pool = require('../db/dbConnection.js');
const invitacionesController = {};
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

// Obtener las claves asociadas a un user_id
invitacionesController.getInvitacionsbyUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { estado, fechaEnvioDesde, fechaEnvioHasta, fechaExpiracionDesde, fechaExpiracionHasta } = req.query;
    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ message: 'No tienes acceso a este Usuario.' });
    }
    const estadoValido = await pool.query(
      `SELECT nombre FROM invitaciones_estado WHERE nombre = $1`,
      [estado]
    );
    if (estadoValido.rows.length === 0) {
      return res.status(400).json({ message: `El estado '${estado}' no es válido.` });
    }

    const result = await pool.query(`
        SELECT 
        i.id as "id_invitacion", 
        k.nombre as "nombre_key",
        k.descripcion as "descripcion_key",
        ie.nombre as "estado",
        i.fecha_envio as "enviado",
        i.fecha_expiracion as "vence"
        FROM invitaciones i
        right join users u on u.user_id = i.user_id 
        right join "keys" k on k.key_id = i.key_id 
        right join invitaciones_estado ie on i.estado = ie.id 
        WHERE i.user_id = $1 and ie.nombre = $2
        AND i.fecha_envio BETWEEN $3 AND $4
        AND i.fecha_expiracion BETWEEN $5 AND $6
        order by i.fecha_envio desc
    `, [userId, estado, fechaEnvioDesde, fechaEnvioHasta, fechaExpiracionDesde, fechaExpiracionHasta]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron invitaciones para este usuario.' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};
// Obtener las claves asociadas a un key_id
invitacionesController.getInvitacionsbyKeyId = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const { estado, username, fechaEnvioDesde, fechaEnvioHasta, fechaExpiracionDesde, fechaExpiracionHasta } = req.query;
    const allowedRoles = ['admin_creator'];

    if (!(await hasAccessToKey(req.user.userId, keyIdNum))) {
      return res.status(403).json({ message: 'No tienes acceso a esta ID cuenta.' });
    }

    const keyCheck = await pool.query(`SELECT user_key_id FROM user_keys WHERE key_id = $1 and estado=$2`, [keyId, estado = 1]);
    if (keyCheck.rows.length === 0) {
      return res.status(404).json({ message: 'ID cuenta no válida.' });
    }

    const userRole = await hasRoleKey(req.user.userId, keyId, allowedRoles);

    if (!userRole) {
      return res.status(403).json({ message: 'No tienes acceso a esta funcionalidad' });
    }

    const estadoValido = await pool.query(
      `SELECT nombre FROM invitaciones_estado WHERE nombre = $1`,
      [estado]
    );
    if (estadoValido.rows.length === 0) {
      return res.status(400).json({ message: `El estado '${estado}' no es válido.` });
    }

    const result = await pool.query(`
            SELECT
            i.id as "id_invitacion", 
            u.username as "nombre_usuario",
            CONCAT(
                SUBSTRING(u.email FROM 1 FOR 3), 
                '*****', 
                SUBSTRING(u.email FROM POSITION('@' IN u.email) - 3 FOR 3),
                '@',
                SUBSTRING(u.email FROM POSITION('@' IN u.email) + 1 FOR LENGTH(u.email))
            ) AS "email",
            ie.nombre as "estado",
            i.fecha_envio as "enviado",
            i.fecha_expiracion as "vence"
            FROM invitaciones i
            right join users u on u.user_id = i.user_id 
            right join "keys" k on k.key_id = i.key_id 
            right join invitaciones_estado ie on i.estado = ie.id 
            WHERE i.key_id = $1 and ie.nombre = $2
            AND (u.username ILIKE '%' || $3 || '%' OR $3 = '')
            AND i.fecha_envio BETWEEN $4 AND $5
            AND i.fecha_expiracion BETWEEN $6 AND $7
            order by i.fecha_envio desc
      `, [keyId, estado, username, fechaEnvioDesde, fechaEnvioHasta, fechaExpiracionDesde, fechaExpiracionHasta]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron invitaciones para esta cuenta.' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

invitacionesController.createinvitacion = async (req, res, next) => {
  try {
    const { codigo_invitacion } = req.body;
    const { userId } = req.params;

    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ message: 'No tienes acceso a este Usuario.' });
    }

    const codigo_invitacion_valido = await pool.query(
      `SELECT key_id, fecha_expiracion FROM "keys" WHERE codigo_invitacion = $1 and activo`,
      [codigo_invitacion]
    );
    if (codigo_invitacion_valido.rows.length === 0) {
      return res.status(400).json({ message: 'El código de invitación no es válido.' });
    }
    const { key_id, fecha_expiracion } = codigo_invitacion_valido.rows[0];

    if (fecha_expiracion && new Date(fecha_expiracion) < new Date()) {
      return res.status(400).json({ message: 'El código de invitación ha expirado.' });
    }
    const invitacionExistente = await pool.query(
      `SELECT id FROM invitaciones WHERE user_id = $1 AND key_id = $2`,
      [userId, key_id]
    );

    if (invitacionExistente.rows.length > 0) {
      return res.status(400).json({ message: 'La invitación ya existe para este usuario y clave.' });
    }

    const newInvitacion = await pool.query(
      `INSERT INTO invitaciones (user_id, key_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userId, key_id]
    );
    res.status(200).json(newInvitacion.rows);
  } catch (err) {
    next(err);
  }
};

invitacionesController.deleteinvitacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invitacionCheck = await pool.query(
      `SELECT user_id FROM invitaciones
          WHERE id = $1 and
          estado = (select id from invitaciones_estado where nombre = 'Pendiente')`,
      [id]
    );

    if (invitacionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Invitación no encontrada o ya aprobada" });
    }

    if (invitacionCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: "No tienes permiso para cancelar esta invitación." });
    }

    const updateInvitacion = await pool.query(
      `
            UPDATE invitaciones
            SET estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Cancelada')
            WHERE id = $1
            RETURNING *;
          `,
      [id]
    );

    res.status(200).json(updateInvitacion.rows[0]);
  } catch (error) {
    next(error);
  }
};

invitacionesController.aprobarinvitacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invitacionInfo = await pool.query(
      ` SELECT k.user_creator
        FROM invitaciones i
        JOIN "keys" k ON i.key_id = k.key_id
        WHERE i.id = $1`,
      [id]
    );

    if (invitacionInfo.rows.length === 0) {
      return res.status(404).json({ message: "Invitación no encontrada." });
    }

    const { user_creator } = invitacionInfo.rows[0];

    if (req.user.userId !== Number(user_creator)) {
      return res.status(403).json({ message: "No tienes permiso para aprobar esta invitación." });
    }

    const updateInvitacion = await pool.query(
      ` UPDATE invitaciones
        SET estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Aprobada')
        WHERE id = $1
        RETURNING *;`,
      [id]
    );

    res.status(200).json(updateInvitacion.rows[0]);
  } catch (error) {
    next(error);
  }
};
invitacionesController.rechazarinvitacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invitacionInfo = await pool.query(
      ` SELECT k.user_creator
       FROM invitaciones i
       JOIN "keys" k ON i.key_id = k.key_id
       WHERE i.id = $1`,
      [id]
    );

    if (invitacionInfo.rows.length === 0) {
      return res.status(404).json({ message: "Invitación no encontrada." });
    }

    const { user_creator } = invitacionInfo.rows[0];

    if (req.user.userId !== Number(user_creator)) {
      return res.status(403).json({ message: "No tienes permiso para rechazar esta invitación." });
    }

    const updateInvitacion = await pool.query(
      ` UPDATE invitaciones
       SET estado = (SELECT id FROM invitaciones_estado WHERE nombre = 'Rechazada')
       WHERE id = $1
       RETURNING *;`,
      [id]
    );

    res.status(200).json(updateInvitacion.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = invitacionesController