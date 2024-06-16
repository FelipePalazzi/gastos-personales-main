import pool from "../db/dbConnection.js"


const responsableingresoController = {};

responsableingresoController.getresponsableIngreso = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM responsable`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

responsableingresoController.getresponsableIngresobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM responsable WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

responsableingresoController.createresponsableIngreso = async (req, res, next) => {
  try {
    const {nombre} = req.body;
    const newresponsableingreso = await pool.query(`INSERT INTO responsable (nombre) VALUES ($1) RETURNING *`,
     [nombre]);
    res.status(200).json(newresponsableingreso.rows);
  } catch (err) {
    next(err);
  }
};

responsableingresoController.updateresponsableIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {nombre} = req.body;
    const result = await pool.query(`UPDATE responsable SET nombre = $1 WHERE id = $2 RETURNING *`,
     [nombre, id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

responsableingresoController.deleteresponsableIngreso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM ingreso WHERE id = $1`, [id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "responsableIngreso not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  export default responsableingresoController