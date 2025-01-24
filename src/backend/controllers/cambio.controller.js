const pool = require('../db/dbConnection.js');

const cambioController = {};

cambioController.getCambioFecha = async (req, res, next) => {
  try {
    const { fecha } = req.query; 
    const cambio = await pool.query(`
        SELECT
            c.fecha::date AS fecha,
            MAX(CASE WHEN mp_origen.codigo = 'USD' AND mp_destino.codigo = 'UYU' THEN c.cambio ELSE NULL END) AS usduyu,
            MAX(CASE WHEN mp_origen.codigo = 'USD' AND mp_destino.codigo = 'ARG' THEN c.cambio ELSE NULL END) AS usdarg,
            MAX(CASE WHEN mp_origen.codigo = 'UYU' AND mp_destino.codigo = 'USD' THEN c.cambio ELSE NULL END) AS uyuusd,
            MAX(CASE WHEN mp_origen.codigo = 'UYU' AND mp_destino.codigo = 'ARG' THEN c.cambio ELSE NULL END) AS uyuarg,
            MAX(CASE WHEN mp_origen.codigo = 'ARG' AND mp_destino.codigo = 'USD' THEN c.cambio ELSE NULL END) AS argusd,
            MAX(CASE WHEN mp_origen.codigo = 'ARG' AND mp_destino.codigo = 'UYU' THEN c.cambio ELSE NULL END) AS arguyu
        FROM
            cambio c
        JOIN
            monedas_posibles mp_origen ON c.moneda_origen = mp_origen.id
        JOIN
            monedas_posibles mp_destino ON c.moneda_destino = mp_destino.id
        WHERE
            c.fecha::date =  $1
        GROUP BY
            c.fecha::date;
    `, [fecha]);

    res.status(200).json(cambio.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = cambioController;
