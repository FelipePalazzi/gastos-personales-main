const pool = require('../db/dbConnection.js');

const metodopagoController = {};

metodopagoController.getMetodopago = async (req, res, next) => {
  try {
    const metodopago = await pool.query(`
      SELECT
      nombre as "metodopago",
      id as "id_metodopago"
      FROM metodopago
      ORDER BY nombre ASC;
    `);

    res.status(200).json(metodopago.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = metodopagoController;
