const { Client, Pool } = require('pg');
const util = require('util');
const fs = require('fs');
require('dotenv').config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});


module.exports = pool;
