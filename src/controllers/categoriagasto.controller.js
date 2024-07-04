const pool = require('../db/dbConnection.js');

const categoriagastoController = {};

categoriagastoController.getcategoriaGastos = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM categoria`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

categoriagastoController.getcategoriaGastobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM categoria WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "categoriaGasto not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

categoriagastoController.createcategoriaGasto = async (req, res, next) => {
  try {
    const {descripcion} = req.body;
    const newcategoriagasto = await pool.query(`INSERT INTO categoria (descripcion) VALUES ($1) RETURNING *`,
     [descripcion]);
    res.status(200).json(newcategoriagasto.rows);
  } catch (err) {
    next(err);
  }
};

categoriagastoController.updatecategoriaGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {descripcion} = req.body;
    const result = await pool.query(`UPDATE categoria SET descripcion = $1 WHERE id = $2 RETURNING *`,
     [descripcion, id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "categoriaGasto not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

categoriagastoController.deletecategoriaGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM categoria WHERE id = $1`, [id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "categoriaGasto not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

module.exports = categoriagastoController;