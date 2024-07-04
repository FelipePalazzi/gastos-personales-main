const pool = require('../db/dbConnection.js');

const ingresoController = {};

ingresoController.getIngreso = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT i.id, i.fecha, r.nombre as responsable, m.descripcion as moneda, i.importe, i.tipocambio, i.descripcion  FROM ingreso i
            INNER JOIN moneda m ON i.moneda = m.id
            INNER JOIN responsable r ON i.responsable = r.id`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

ingresoController.getIngresobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT i.id, i.fecha, r.nombre as responsable, m.descripcion as moneda, i.importe, i.tipocambio, i.descripcion  FROM ingreso i
            INNER JOIN moneda m ON i.moneda = m.id
            INNER JOIN responsable r ON i.responsable = r.id
            WHERE i.id = $1`, [id]);
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

    const newingreso = await pool.query(`INSERT INTO ingreso (fecha, responsable, moneda, importe, tipocambio, descripcion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
     [fecha, responsable, moneda, importe, tipocambio, descripcion]);

    res.status(200).json(newingreso.rows);
  } catch (err) {
    next(err);
  }
};

ingresoController.updateIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha, responsable, moneda, importe, tipocambio, descripcion} = req.body;
    const result = await pool.query(`
    UPDATE ingreso 
    SET fecha = $1, 
        responsable = $2, 
        moneda = $3, 
        importe = $4, 
        tipocambio = $5, 
        descripcion = $6
    WHERE id = $7
    RETURNING *`,
    [fecha, responsable, moneda, importe, tipocambio, descripcion, id]
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
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM ingreso WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Ingreso not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = ingresoController