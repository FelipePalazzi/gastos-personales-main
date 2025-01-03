const pool = require('../db/dbConnection.js');

const monedasPosiblesController = {};

monedasPosiblesController.getMonedasPosibles = async (req, res, next) => {
  try {
    const monedasPosibles = await pool.query(`
      SELECT
      nombre AS "monedasposibles",
      codigo AS "codigo_monedasposibles",
      id AS "id_monedasposibles"
      FROM monedas_posibles
      ORDER BY nombre ASC;
    `);

    res.status(200).json(monedasPosibles.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = monedasPosiblesController;
