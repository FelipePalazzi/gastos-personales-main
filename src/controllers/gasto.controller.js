const { pool }= require ("../db/dbConnection");


exports.getGastos = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT g.id, g.fecha, tg.descripcion as tipogasto, g.tipocambio, g.totalar, g.total , g.descripcion, r.nombre as responsable, c.descripcion as categoria FROM gasto g
            INNER JOIN tipogasto tg ON g.tipogasto = tg.id
            INNER JOIN categoria c ON tg.categoria = c.id
            INNER JOIN responsable r ON g.responsable = r.id`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getGastobyID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT g.id, g.fecha, tg.descripcion as tipogasto, g.tipocambio, g.totalar, g.total , g.descripcion, r.nombre as responsable, c.descripcion as categoria FROM gasto g
            INNER JOIN tipogasto tg ON g.tipogasto = tg.id
            INNER JOIN categoria c ON tg.categoria = c.id
            INNER JOIN responsable r ON g.responsable = r.id
            WHERE g.id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.createGasto = async (req, res, next) => {
  try {
    const { fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable} = req.body;

    const newgasto = await pool.query(`INSERT INTO gasto (fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
     [fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable]);

    res.status(200).json(newgasto.rows);
  } catch (err) {
    next(err);
  }
};

exports.updateGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha, tipogasto, tipocambio, totalar, total, descripcion, responsable} = req.body;
    const result = await pool.query(`
    UPDATE gasto 
    SET fecha = $1, 
        tipogasto = $2, 
        tipocambio = $3, 
        totalar = $4, 
        total = $5, 
        descripcion = $6, 
        responsable = $7
    WHERE id = $8
    RETURNING *`,
    [fecha, tipogasto, tipocambio, totalar, total, descripcion,responsable, id]
  );
     if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.deleteGasto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM gasto WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Gasto not found" });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

