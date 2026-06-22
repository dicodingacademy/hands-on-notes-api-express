// Migrasi v1: membuat tabel users dan notes.
// Dijalankan dengan `npm run migrate up` (membaca DATABASE_URL dari environment).

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'serial PRIMARY KEY',
    username: { type: 'varchar(50)', notNull: true, unique: true },
    password: { type: 'text', notNull: true }, // berisi hash bcrypt, bukan plaintext
    created_at: { type: 'timestamptz', default: pgm.func('NOW()') },
  });

  pgm.createTable('notes', {
    id: 'serial PRIMARY KEY',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    title: { type: 'varchar(100)', notNull: true },
    body: { type: 'text' },
    created_at: { type: 'timestamptz', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('notes');
  pgm.dropTable('users');
};
