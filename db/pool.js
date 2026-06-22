const { Pool } = require('pg');

// Koneksi database dibaca dari satu env var DATABASE_URL
// (format: postgres://user:password@host:port/nama_db).
// Saat deployment, nilai ini menunjuk ke PostgreSQL di server kalian.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
