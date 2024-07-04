const pool = require('../db/dbConnection.js');

const tipogastoController = {};

tipogastoController.gettipoGastos = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM tipogasto`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

tipogastoController.gettipoGastobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM tipogasto WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

tipogastoController.createtipoGasto = async (req, res, next) => {
  try {
    const {descripcion, categoria, responsable} = req.body;
    const newtipogasto = await pool.query(`INSERT INTO tipogasto (descripcion, categoria, responsable) VALUES ($1, $2, $3) RETURNING *`,
     [descripcion, categoria, responsable]);
    res.status(200).json(newtipogasto.rows);
  } catch (err) {
    next(err);
  }
};

tipogastoController.updatetipoGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {descripcion, categoria, responsable} = req.body;
    const result = await pool.query(`UPDATE tipogasto SET descripcion = $1 , categoria = $2, responsable = $3 WHERE id = $4 RETURNING *`,
     [descripcion, categoria, responsable,  id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

tipogastoController.deletetipoGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM tipogasto WHERE id = $1`, [id]);
     if (result.rows.length === 0)
      return res.status(404).json({ message: "tipoGasto not found" });
     return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };

  module.exports = tipogastoController