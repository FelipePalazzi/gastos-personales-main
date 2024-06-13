const { pool }= require ("../db/dbConnection");


exports.getResumen1 = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT 
  YEAR, 
  MONTH, 
  CASE 
    WHEN SUM(gasto_ar) = 0 THEN '0'
    ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_ar), 'FM999999999.99'))
  END AS "GASTO AR", 
  CASE 
    WHEN SUM(ingreso_ar) = 0 THEN '0'
    ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_ar), 'FM999999999.99'))
  END AS "INGRESO AR"
FROM (
  SELECT 
    EXTRACT(YEAR FROM g.fecha) AS YEAR, 
    EXTRACT(MONTH FROM g.fecha) AS MONTH, 
    SUM(g.totalar) AS gasto_ar, 
    0 AS ingreso_ar
  FROM 
    gasto g
  GROUP BY 
    MONTH, YEAR
  UNION ALL
  SELECT 
    EXTRACT(YEAR FROM i.fecha) AS YEAR, 
    EXTRACT(MONTH FROM i.fecha) AS MONTH, 
    0 AS gasto_ar, 
    SUM(CASE 
      WHEN i.moneda = 1 THEN i.importe * i.tipocambio 
      WHEN i.moneda = 2 THEN i.importe / i.tipocambio
      WHEN i.moneda = 3 THEN i.importe * 1 
      ELSE 0
    END) AS ingreso_ar
  FROM 
    ingreso i
  GROUP BY 
    MONTH, YEAR
) AS subquery
GROUP BY 
  MONTH, YEAR
ORDER BY 
  YEAR, MONTH;`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};