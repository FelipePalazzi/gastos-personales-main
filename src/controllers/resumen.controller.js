import pool from "../db/dbConnection.js"

const resumenController = {};

resumenController.getResumen1 = async (req, res, next) => {
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

resumenController.getResumen2 = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT 
  EXTRACT(DAY FROM fecha) AS DAY,
  EXTRACT(MONTH FROM fecha) AS MONTH,
  EXTRACT(YEAR FROM fecha) AS YEAR,
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
    g.fecha,
    SUM(g.totalar) AS gasto_ar, 
    0 AS ingreso_ar
  FROM 
    gasto g
  GROUP BY 
    g.fecha
  UNION ALL
  SELECT 
    i.fecha,
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
    i.fecha
) AS subquery
GROUP BY 
  fecha
ORDER BY 
  YEAR, MONTH, DAY;`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};



export default resumenController