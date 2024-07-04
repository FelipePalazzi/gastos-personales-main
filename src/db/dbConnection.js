import pkg from 'pg';
const {Pool} = pkg;
import  {db}  from "../../config.js";

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