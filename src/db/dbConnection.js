import pkg from 'pg';
const {Pool} = pkg;
import {DB_HOST,DB_USER,DB_PASS,DB_NAME,DB_PORT} from "@env"
const db = {
  host: DB_HOST,
  user:DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port:DB_PORT,
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