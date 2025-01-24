const pool = require('../db/dbConnection.js');
const gastoController = {};
const hasAccessToKey = require('../middlewares/verificacion/hasAccesstoKey.js')
const hasRoleKey = require('../middlewares/verificacion/hasRoleKey.js');

gastoController.getGastos = async (req, res, next) => {
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
      categoria,
      subcategoria,
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

    buildFilter('categoria', categoria, 'c.nombre');
    buildFilter('subcategoria', subcategoria, 's.nombre');
    buildFilter('responsable', responsable, 'r.nombre');
    buildFilter('moneda', moneda, 'mp.codigo');
    buildFilter('metodopago', metodopago, 'm2.nombre');
    buildFilter('submetodopago', submetodopago, 's2.nombre');
    buildFilter('comentario', comentario, 'g.comentario');

    // Filtros por rango de fechas
    if (fechaDesde) {
      filters.push(`g.fecha >= $${values.length + 1}`);
      values.push(new Date(fechaDesde).toISOString());
    }
    if (fechaHasta) {
      filters.push(`g.fecha <= $${values.length + 1}`);
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
      filters.push(`g.monto_${monedaFiltro.toLowerCase()} >= $${values.length + 1}`);
      values.push(montoMinValid);
    }
    if (!isNaN(montoMaxValid) && monedaFiltro) {
      filters.push(`g.monto_${monedaFiltro.toLowerCase()} <= $${values.length + 1}`);
      values.push(montoMaxValid);
    }



    // Consulta SQL construida dinámicamente
    const query = `
      SELECT g.id,
        g.fecha,
        c.nombre as "categoria",
        s.categoria as "id_categoria",
        s.nombre as "subcategoria",
        g.subcategoria as "id_subcategoria",
        r.nombre as "responsable",
        g.responsable as "id_responsable",
        g.monto_uyu as "UYU",
        g.monto_usd as "USD",
        g.monto_arg as "ARG",
        mp.codigo as "monedamonto",
        g.moneda_origen as "id_moneda",
        m2.nombre as "metododepago",
        s2.metodo_pago as "id_metodopago",
        s2.nombre as "submetododepago",
        g.submetodo_pago as "id_submetodopago",
        g.comentario,
        e.nombre
      FROM gasto g
      RIGHT JOIN subcategoria s ON s.id = g.subcategoria AND s.key_id = g.key_id
      RIGHT JOIN categoria c ON s.categoria = c.id AND c.key_id = g.key_id
      RIGHT JOIN responsable r ON r.id = g.responsable AND r.key_id = g.key_id
      LEFT JOIN estado e ON e.id = g.estado
      LEFT JOIN moneda m ON m.id = g.moneda_origen AND m.key_id = g.key_id
      LEFT JOIN monedas_posibles mp ON mp.id = m.id_moneda
      LEFT JOIN submetodopago s2 ON s2.id = g.submetodo_pago AND s2.key_id = g.key_id
      LEFT JOIN metodopago m2 ON s2.metodo_pago = m2.id
      WHERE g.key_id = $1
      ${filters.length ? `AND ${filters.join(' AND ')}` : ''}
      ORDER BY g.fecha DESC
      OFFSET $${values.length + 1} ROWS FETCH FIRST $${values.length + 2} ROWS ONLY;
    `;
    values.push(offset, limit);
    const result = await pool.query(query, values);
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
      SELECT g.id,
        g.fecha,
        c.nombre as "categoria",
        s.categoria as "id_categoria",
        s.nombre as "subcategoria",
        g.subcategoria as "id_subcategoria",
        r.nombre as "responsable",
        g.responsable as "id_responsable",
        g.monto_uyu as "UYU",
        g.monto_usd as "USD",
        g.monto_arg as "ARG",
        mp.codigo as "monedamonto",
        g.moneda_origen as "id_moneda",
        m2.nombre as "metododepago",
        s2.metodo_pago as "id_metodopago",
        s2.nombre as "submetododepago",
        g.submetodo_pago as "id_submetodopago",
        g.comentario,
        e.nombre
      FROM gasto g
      RIGHT JOIN subcategoria s ON s.id = g.subcategoria AND s.key_id = g.key_id
      RIGHT JOIN categoria c ON s.categoria = c.id AND c.key_id = g.key_id
      RIGHT JOIN responsable r ON r.id = g.responsable AND r.key_id = g.key_id
      LEFT JOIN estado e ON e.id = g.estado
      LEFT JOIN moneda m ON m.id = g.moneda_origen AND m.key_id = g.key_id
      LEFT JOIN monedas_posibles mp ON mp.id = m.id_moneda
      LEFT JOIN submetodopago s2 ON s2.id = g.submetodo_pago AND s2.key_id = g.key_id
      LEFT JOIN metodopago m2 ON s2.metodo_pago = m2.id
      WHERE g.id = $1 and g.key_id=$2
      `, [id, keyId]);
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

    const { fecha, subcategoria, id_moneda_origen, comentario, responsable, submetodopago } = req.body;

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

    const newGasto = await pool.query(`
      INSERT INTO gasto (fecha, subcategoria, moneda_origen, comentario, responsable, key_id, monto_uyu, monto_usd, monto_arg, submetodo_pago)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      fecha, subcategoria, idMoneda, comentario, responsable, keyId, monto_uyu, monto_usd, monto_arg, submetodopago]);

    res.status(200).json(newGasto.rows[0]);

  } catch (err) {
    next(err);
  }
};

gastoController.updateGasto = async (req, res, next) => {
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

    const { fecha, subcategoria, id_moneda_origen, comentario, responsable, submetodopago, estado } = req.body;

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
      UPDATE gasto 
      SET fecha = $1, 
          subcategoria = $2, 
          moneda_origen = $3, 
          comentario = $4, 
          responsable = $5, 
          monto_uyu = $6, 
          monto_usd = $7, 
          monto_arg = $8, 
          submetodo_pago = $9,
          estado = (select id from estado where nombre=$10)
      WHERE id = $11 AND key_id = $12
      RETURNING *
    `, [
      fecha, subcategoria, idMoneda, comentario, responsable, monto_uyu, monto_usd, monto_arg, submetodopago, estado, id, keyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gasto no encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

gastoController.deleteGasto = async (req, res, next) => {
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
      UPDATE gasto
      SET estado = (SELECT id FROM estado WHERE nombre = $1)
      WHERE id = $2 AND key_id = $3
      RETURNING *
    `, [estado, id, keyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gasto no encontrado.' });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = gastoController;