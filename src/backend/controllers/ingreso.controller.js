const pool = require('../db/dbConnection.js');
const ingresoController = {};
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

ingresoController.getIngresos = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator', 'user'];

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

    const {
      estado,
      responsable,
      moneda,
      metodopago,
      submetodopago,
      comentario,
      fechaDesde,
      fechaHasta,
      montoMin,
      montoMax,
      monedaFiltro,
      offset = 0,
      limit = 10,
    } = req.query;

    let filters = [];
    let values = [keyId];

    const buildFilter = (field, queryParam, alias) => {
      if (queryParam) {
        const terms = queryParam
          .split(/, | ,|,/) // Dividir por ", ", " ," o ","
          .map(term => term.trim().toLowerCase()) // Normalizar a minúsculas
          .filter(term => term.length > 0); // Filtrar vacíos

        if (terms.length) {
          const conditions = terms
            .map((_, i) => `LOWER(${alias}) ILIKE $${values.length + 1 + i}`)
            .join(' OR '); // Construir condiciones con OR
          filters.push(`(${conditions})`);
          values.push(...terms.map(term => `%${term}%`));
        }
      }
    };


    // Filtros dinámicos
    if (estado) {
      filters.push(`(e.nombre = $${values.length + 1})`);
      values.push(estado);
    }
    buildFilter('responsable', responsable, 'r.nombre');
    buildFilter('moneda', moneda, 'mp.codigo');
    buildFilter('metodopago', metodopago, 'm2.nombre');
    buildFilter('submetodopago', submetodopago, 's2.nombre');
    buildFilter('comentario', comentario, 'i.comentario');

    // Filtros por rango de fechas
    if (fechaDesde) {
      filters.push(`i.fecha >= $${values.length + 1}`);
      values.push(new Date(fechaDesde).toISOString());
    }
    if (fechaHasta) {
      filters.push(`i.fecha <= $${values.length + 1}`);
      values.push(new Date(fechaHasta).toISOString());
    }

    // Validación de montoMin y montoMax
    let montoMinValid = parseFloat(montoMin);
    let montoMaxValid = parseFloat(montoMax);

    if (!isNaN(montoMinValid) && !isNaN(montoMaxValid) && montoMinValid > montoMaxValid) {
      [montoMinValid, montoMaxValid] = [montoMaxValid, montoMinValid];
    }

    // Filtros por valores monetarios
    if (!isNaN(montoMinValid) && monedaFiltro) {
      filters.push(`i.monto_${monedaFiltro.toLowerCase()} >= $${values.length + 1}`);
      values.push(montoMinValid);
    }
    if (!isNaN(montoMaxValid) && monedaFiltro) {
      filters.push(`i.monto_${monedaFiltro.toLowerCase()} <= $${values.length + 1}`);
      values.push(montoMaxValid);
    }



    // Consulta SQL construida dinámicamente
    const query = `
      select i.id,
      i.fecha,
      r.nombre as "responsable",
      i.responsable as "id_responsable",
      i.monto_uyu as "UYU",
      i.monto_usd as "USD",
      i.monto_arg as "ARG",
      mp.codigo as "monedamonto",
      i.moneda_origen as "id_moneda",
      m2.nombre  as "metododepago",
      s2.metodo_pago as "id_metodopago",
      s2.nombre as "submetododepago",
      i.submetodo_pago as "id_submetodopago",
      i.comentario,
      e.nombre
      from ingreso i
      right join responsable r on r.id=i.responsable and r.key_id =i.key_id
      left join estado e on e.id =i.estado
      left join moneda m on m.id=i.moneda_origen and m.key_id = i.key_id
      left join monedas_posibles mp on mp.id =m.id_moneda
      left join submetodopago s2 on s2.id = i.submetodo_pago and s2.key_id =i.key_id
      left join metodopago m2 on s2.metodo_pago =m2.id
      where i.key_id=$1
      ${filters.length ? `AND ${filters.join(' AND ')}` : ''}
      ORDER BY i.fecha DESC
      OFFSET $${values.length + 1} ROWS FETCH FIRST $${values.length + 2} ROWS ONLY;
    `;
    values.push(offset, limit);
    const result = await pool.query(query, values);
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
    const allowedRoles = ['admin', 'admin_creator', 'user'];

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
    const result = await pool.query(`
      select i.id,
      i.fecha,
      r.nombre as "responsable",
      i.responsable as "id_responsable",
      i.monto_uyu as "UYU",
      i.monto_usd as "USD",
      i.monto_arg as "ARG",
      mp.codigo as "monedamonto",
      i.moneda_origen as "id_moneda",
      m2.nombre  as "metododepago",
      s2.metodo_pago as "id_metodopago",
      s2.nombre as "submetododepago",
      i.submetodo_pago as "id_submetodopago",
      i.comentario,
      e.nombre
      from ingreso i
      right join responsable r on r.id=i.responsable and r.key_id =i.key_id
      left join estado e on e.id =i.estado
      left join moneda m on m.id=i.moneda_origen and m.key_id = i.key_id
      left join monedas_posibles mp on mp.id =m.id_moneda
      left join submetodopago s2 on s2.id = i.submetodo_pago and s2.key_id =i.key_id
      left join metodopago m2 on s2.metodo_pago =m2.id
      WHERE i.id = $1 and i.key_id=$2
      `, [id, keyId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Ingreso not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

ingresoController.createIngreso = async (req, res, next) => {
  try {
    const { keyId } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

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

    const { fecha, id_moneda_origen, comentario, responsable, submetodopago } = req.body;

    const monedaQuery = await pool.query(`
      SELECT m.id as "id_moneda",
      mp.codigo as "codigo_moneda"
      FROM monedas_posibles mp
      LEFT JOIN moneda m ON m.id_moneda = mp.id
      WHERE m.key_id = $1 AND m.activo = true AND m.id = $2
    `, [keyId, id_moneda_origen]);
    if (monedaQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Moneda no válida o no activa.' });
    }

    const idMoneda = monedaQuery.rows[0].id_moneda;
    const moneda_origen = monedaQuery.rows[0].codigo_moneda;

    let monto_uyu = 0.0;
    let monto_usd = 0.0;
    let monto_arg = 0.0;

    if (moneda_origen === 'UYU') {
      monto_uyu = req.body.monto;
    } else if (moneda_origen === 'USD') {
      monto_usd = req.body.monto;
    } else if (moneda_origen === 'ARG') {
      monto_arg = req.body.monto;
    }

    const newIngreso = await pool.query(`
      INSERT INTO ingreso (fecha, moneda_origen, comentario, responsable, key_id, monto_uyu, monto_usd, monto_arg, submetodo_pago)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      fecha, idMoneda, comentario, responsable, keyId, monto_uyu, monto_usd, monto_arg, submetodopago]);

    res.status(200).json(newIngreso.rows[0]);

  } catch (err) {
    next(err);
  }
};

ingresoController.updateIngreso = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

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

    const { fecha, id_moneda_origen, comentario, responsable, submetodopago, estado } = req.body;

    const monedaQuery = await pool.query(`
      SELECT m.id as "id_moneda",
      mp.codigo as "codigo_moneda"
      FROM monedas_posibles mp
      LEFT JOIN moneda m ON m.id_moneda = mp.id
      WHERE m.key_id = $1 AND m.activo = true AND m.id = $2
    `, [keyId, id_moneda_origen]);

    if (monedaQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Moneda no válida o no activa.' });
    }

    const idMoneda = monedaQuery.rows[0].id_moneda;
    const moneda_origen = monedaQuery.rows[0].codigo_moneda;

    let monto_uyu = 0.0;
    let monto_usd = 0.0;
    let monto_arg = 0.0;

    if (moneda_origen === 'UYU') {
      monto_uyu = req.body.monto;
    } else if (moneda_origen === 'USD') {
      monto_usd = req.body.monto;
    } else if (moneda_origen === 'ARG') {
      monto_arg = req.body.monto;
    }

    const result = await pool.query(`
      UPDATE ingreso 
      SET fecha = $1, 
          moneda_origen = $2, 
          comentario = $3, 
          responsable = $4, 
          monto_uyu = $5, 
          monto_usd = $6, 
          monto_arg = $7, 
          submetodo_pago = $8,
          estado = (select id from estado where nombre=$9)
      WHERE id = $10 AND key_id = $11
      RETURNING *
    `, [
      fecha, idMoneda, comentario, responsable, monto_uyu, monto_usd, monto_arg, submetodopago, estado, id, keyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ingreso no encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

ingresoController.deleteIngreso = async (req, res, next) => {
  try {
    const { keyId, id } = req.params;
    const { estado } = req.body;
    const keyIdNum = Number(keyId);
    const allowedRoles = ['admin', 'admin_creator'];

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

    const result = await pool.query(`
      UPDATE ingreso
      SET estado = (SELECT id FROM estado WHERE nombre = $1)
      WHERE id = $2 AND key_id = $3
      RETURNING *
    `, [estado, id, keyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ingreso no encontrado.' });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = ingresoController;