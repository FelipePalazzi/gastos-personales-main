import pkg from 'pg';
const {Pool} = pkg;
const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT,
};
const pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.database,
    ssl: { rejectUnauthorized: false }
});
pool.on('connect', () => console.log('DB connected'))

export default pool