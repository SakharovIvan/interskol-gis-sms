import { pool } from "../config.js";

pool.connect().then(console.log('pool connected')).then(pool.end().then(console.log('pool disconnected')))