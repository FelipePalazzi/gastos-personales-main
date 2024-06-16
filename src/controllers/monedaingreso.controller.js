import pool from "../db/dbConnection.js"


const monedaingresoController = {};

monedaingresoController.getmonedaIngreso = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM moneda`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

monedaingresoController.getmonedaIngresobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM moneda WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "monedaIngreso not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

monedaingresoController.createmonedaIngreso = async (req, res, next) => {
  try {
    const {descripcion} = req.body;
    const newmonedaingreso = await pool.query(`INSERT INTO moneda (descripcion) VALUES ($1) RETURNING *`,
     [descripcion]);
    res.status(200).json(newmonedaingreso.rows);
  } catch (err) {
    next(err);
  }
};

monedaingresoController.updatemonedaIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {descripcion} = req.body;
    const result = await pool.query(`UPDATE moneda SET descripcion = $1 WHERE id = $2 RETURNING *`,
     [descripcion, id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "monedaIngreso not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

monedaingresoController.deletemonedaIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM ingreso WHERE id = $1`, [id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "monedaIngreso not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  export default monedaingresoController