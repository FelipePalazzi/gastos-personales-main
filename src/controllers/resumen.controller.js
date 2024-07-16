const pool = require('../db/dbConnection.js');

const resumenController = {};

resumenController.getResumen1 = async (req, res, next) => {
  try {
    const result = await pool.query(`WITH tipo_cambio_mensual AS (
      SELECT 
          EXTRACT(YEAR FROM fecha) AS YEAR, 
          EXTRACT(MONTH FROM fecha) AS MONTH, 
          AVG(tipo_cambio) AS avg_tipo_cambio
      FROM 
          tipo_cambio_usd_uyu
      GROUP BY 
          YEAR, MONTH
  )
  SELECT 
    YEAR, 
    MONTH, 
    CASE 
      WHEN SUM(gasto_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_ar), 'FM999999999.99'))
    END AS "GASTO ARG", 
    CASE 
      WHEN SUM(ingreso_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_ar), 'FM999999999.99'))
    END AS "INGRESO ARG",
    CASE 
      WHEN SUM(gasto_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_uyu), 'FM999999999.99'))
    END AS "GASTO UYU", 
    CASE 
      WHEN SUM(ingreso_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_uyu), 'FM999999999.99'))
    END AS "INGRESO UYU",
    CASE 
      WHEN SUM(gasto_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_usd), 'FM999999990.99'))
    END AS "GASTO USD", 
    CASE 
      WHEN SUM(ingreso_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_usd), 'FM999999990.99'))
    END AS "INGRESO USD"
  FROM (
    SELECT 
      EXTRACT(YEAR FROM g.fecha) AS YEAR, 
      EXTRACT(MONTH FROM g.fecha) AS MONTH, 
      SUM(g.totalar) AS gasto_ar, 
      0 AS ingreso_ar,
      SUM(g.total) AS gasto_uyu,
      0 AS ingreso_uyu,
      SUM(g.total / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM g.fecha) AND MONTH = EXTRACT(MONTH FROM g.fecha)), 40)) AS gasto_usd,
      0 AS ingreso_usd
    FROM 
      gasto g
    GROUP BY 
      YEAR, MONTH
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
      END) AS ingreso_ar,
      0 AS gasto_uyu,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe * COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        WHEN i.moneda = 2 THEN i.importe 
        WHEN i.moneda = 3 THEN (SELECT g2.tipocambio FROM gasto g2 WHERE g2.fecha <= i.fecha ORDER BY g2.fecha DESC LIMIT 1) * i.importe
        ELSE 0
      END) AS ingreso_uyu,
      0 AS gasto_usd,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe 
        WHEN i.moneda = 2 THEN i.importe / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        WHEN i.moneda = 3 THEN i.importe / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        ELSE 0
      END) AS ingreso_usd
    FROM 
      ingreso i
    GROUP BY 
      YEAR, MONTH
  ) AS subquery
  GROUP BY 
    YEAR, MONTH
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
    END AS "GASTO ARG", 
    CASE 
      WHEN SUM(ingreso_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_ar), 'FM999999999.99'))
    END AS "INGRESO ARG",
    CASE 
      WHEN SUM(gasto_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_uyu), 'FM999999999.99'))
    END AS "GASTO UYU", 
    CASE 
      WHEN SUM(ingreso_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_uyu), 'FM999999999.99'))
    END AS "INGRESO UYU",
    CASE 
      WHEN SUM(gasto_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_usd), 'FM999999990.99'))
    END AS "GASTO USD", 
    CASE 
      WHEN SUM(ingreso_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_usd), 'FM999999990.99'))
    END AS "INGRESO USD"
  FROM (
    SELECT 
      g.fecha,
      SUM(g.totalar) AS gasto_ar, 
      0 AS ingreso_ar,
      SUM(g.total) AS gasto_uyu,
      0 AS ingreso_uyu,
      SUM(g.total / (
        SELECT tipo_cambio 
        FROM tipo_cambio_usd_uyu 
        WHERE fecha <= g.fecha 
        ORDER BY fecha DESC 
        LIMIT 1
      )) AS gasto_usd,
      0 AS ingreso_usd
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
      END) AS ingreso_ar,
      0 AS gasto_uyu,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe * (
          SELECT tipo_cambio 
          FROM tipo_cambio_usd_uyu 
          WHERE fecha <= i.fecha 
          ORDER BY fecha DESC 
          LIMIT 1
        )
        WHEN i.moneda = 2 THEN i.importe 
        WHEN i.moneda = 3 THEN (SELECT g2.tipocambio FROM gasto g2 WHERE g2.fecha <= i.fecha ORDER BY g2.fecha DESC LIMIT 1) * i.importe
        ELSE 0
      END) AS ingreso_uyu,
      0 AS gasto_usd,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe 
        WHEN i.moneda = 2 THEN i.importe / (
          SELECT tipo_cambio 
          FROM tipo_cambio_usd_uyu 
          WHERE fecha <= i.fecha 
          ORDER BY fecha DESC 
          LIMIT 1
        )
        WHEN i.moneda = 3 THEN i.importe / (
          SELECT tipo_cambio 
          FROM tipo_cambio_usd_uyu 
          WHERE fecha <= i.fecha 
          ORDER BY fecha DESC 
          LIMIT 1
        )
        ELSE 0
      END) AS ingreso_usd
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

resumenController.getResumen3 = async (req, res, next) => {
  try {
    const result = await pool.query(`WITH tipo_cambio_mensual AS (
      SELECT 
          EXTRACT(YEAR FROM fecha) AS YEAR, 
          EXTRACT(MONTH FROM fecha) AS MONTH, 
          AVG(tipo_cambio) AS avg_tipo_cambio
      FROM 
          tipo_cambio_usd_uyu
      GROUP BY 
          YEAR, MONTH
  )
  SELECT 
    YEAR, 
    MONTH, 
    nombre,
    CASE 
      WHEN SUM(gasto_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_ar), 'FM999999990.99'))
    END AS "GASTO ARG", 
    CASE 
      WHEN SUM(ingreso_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_ar), 'FM999999990.99'))
    END AS "INGRESO ARG",
    CASE 
      WHEN SUM(gasto_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_uyu), 'FM999999990.99'))
    END AS "GASTO UYU", 
    CASE 
      WHEN SUM(ingreso_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_uyu), 'FM999999990.99'))
    END AS "INGRESO UYU",
    CASE 
      WHEN SUM(gasto_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_usd), 'FM999999990.99'))
    END AS "GASTO USD", 
    CASE 
      WHEN SUM(ingreso_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(ingreso_usd), 'FM999999990.99'))
    END AS "INGRESO USD"
  FROM (
    SELECT 
      EXTRACT(YEAR FROM g.fecha) AS YEAR, 
      EXTRACT(MONTH FROM g.fecha) AS MONTH, 
      r.nombre,
      SUM(g.totalar) AS gasto_ar, 
      0 AS ingreso_ar,
      SUM(g.total) AS gasto_uyu,
      0 AS ingreso_uyu,
      SUM(g.total / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM g.fecha) AND MONTH = EXTRACT(MONTH FROM g.fecha)), 40)) AS gasto_usd,
      0 AS ingreso_usd
    FROM 
      gasto g
      join responsable r on r.id = g.responsable
    GROUP BY 
      YEAR, MONTH, r.nombre
    UNION ALL
    SELECT 
      EXTRACT(YEAR FROM i.fecha) AS YEAR, 
      EXTRACT(MONTH FROM i.fecha) AS MONTH, 
      r.nombre,
      0 AS gasto_ar, 
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe * i.tipocambio 
        WHEN i.moneda = 2 THEN i.importe / i.tipocambio
        WHEN i.moneda = 3 THEN i.importe * 1 
        ELSE 0
      END) AS ingreso_ar,
      0 AS gasto_uyu,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe * COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        WHEN i.moneda = 2 THEN i.importe 
        WHEN i.moneda = 3 THEN (SELECT g2.tipocambio FROM gasto g2 WHERE g2.fecha <= i.fecha ORDER BY g2.fecha DESC LIMIT 1) * i.importe
        ELSE 0
      END) AS ingreso_uyu,
      0 AS gasto_usd,
      SUM(CASE 
        WHEN i.moneda = 1 THEN i.importe 
        WHEN i.moneda = 2 THEN i.importe / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        WHEN i.moneda = 3 THEN i.importe / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM i.fecha) AND MONTH = EXTRACT(MONTH FROM i.fecha)), 40)
        ELSE 0
      END) AS ingreso_usd
    FROM 
      ingreso i
          join responsable r on r.id = i.responsable
    GROUP BY 
      YEAR, MONTH, r.nombre
  ) AS subquery
  GROUP BY 
    YEAR, MONTH, nombre
  ORDER BY 
    YEAR, MONTH, nombre;`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

resumenController.getResumen4 = async (req, res, next) => {
  try {
    const result = await pool.query(`WITH tipo_cambio_mensual AS (
      SELECT 
          EXTRACT(YEAR FROM fecha) AS YEAR, 
          EXTRACT(MONTH FROM fecha) AS MONTH, 
          AVG(tipo_cambio) AS avg_tipo_cambio
      FROM 
          tipo_cambio_usd_uyu
      GROUP BY 
          YEAR, MONTH
    )
    SELECT 
    YEAR, 
    MONTH, 
    nombre,
    tipogasto,
    CASE 
      WHEN SUM(gasto_ar) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_ar), 'FM999999990.99'))
    END AS "GASTO ARG", 
    CASE 
      WHEN SUM(gasto_uyu) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_uyu), 'FM999999990.99'))
    END AS "GASTO UYU", 
    CASE 
      WHEN SUM(gasto_usd) = 0 THEN '0'
      ELSE TRIM(TRAILING '.' FROM TO_CHAR(SUM(gasto_usd), 'FM999999990.99'))
    END AS "GASTO USD"
    FROM (
    SELECT 
      EXTRACT(YEAR FROM g.fecha) AS YEAR, 
      EXTRACT(MONTH FROM g.fecha) AS MONTH, 
      r.nombre,
      tg.descripcion AS tipogasto,
      SUM(g.totalar) AS gasto_ar, 
      SUM(g.total) AS gasto_uyu,
      SUM(g.total / COALESCE((SELECT avg_tipo_cambio FROM tipo_cambio_mensual WHERE YEAR = EXTRACT(YEAR FROM g.fecha) AND MONTH = EXTRACT(MONTH FROM g.fecha)), 40)) AS gasto_usd
    FROM 
      gasto g
      JOIN responsable r ON r.id = g.responsable
      JOIN tipogasto tg ON tg.id = g.tipogasto
    GROUP BY 
      YEAR, MONTH, r.nombre, tg.descripcion
    ) AS subquery
    GROUP BY 
    YEAR, MONTH, nombre, tipogasto
    ORDER BY 
    YEAR, MONTH, nombre, tipogasto;`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};


module.exports = resumenController