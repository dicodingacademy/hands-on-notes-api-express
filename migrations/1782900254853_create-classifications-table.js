// Migrasi v2: membuat tabel classifications.
// Dijalankan dengan `npm run migrate up` (membaca DATABASE_URL dari environment).

exports.up = (pgm) => {
  pgm.createTable('classifications', {
    id: 'serial PRIMARY KEY',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    image_name: { type: 'varchar(255)', notNull: true },
    top_label: { type: 'varchar(255)', notNull: true },
    top_confidence: { type: 'real', notNull: true },
    all_predictions: { type: 'jsonb', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('classifications');
};
