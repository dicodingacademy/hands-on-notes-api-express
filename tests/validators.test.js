// Unit test validasi payload — murni tanpa database,
// sehingga bisa dijalankan di CI tanpa service container.
const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  validateRegister,
  validateLogin,
  validateNote,
} = require('../validators/validators');

// --- validateRegister ---

test('register valid lolos validasi', () => {
  const result = validateRegister({ username: 'budi', password: 'rahasia123' });
  assert.equal(result.valid, true);
});

test('register tanpa username ditolak', () => {
  const result = validateRegister({ password: 'rahasia123' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'username wajib diisi');
});

test('register dengan username terlalu pendek ditolak', () => {
  const result = validateRegister({ username: 'ab', password: 'rahasia123' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'username harus 3-50 karakter');
});

test('register dengan username lebih dari 50 karakter ditolak', () => {
  const result = validateRegister({
    username: 'a'.repeat(51),
    password: 'rahasia123',
  });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'username harus 3-50 karakter');
});

test('register dengan password kurang dari 6 karakter ditolak', () => {
  const result = validateRegister({ username: 'budi', password: '12345' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'password minimal 6 karakter');
});

// --- validateLogin ---

test('login valid lolos validasi', () => {
  const result = validateLogin({ username: 'budi', password: 'rahasia123' });
  assert.equal(result.valid, true);
});

test('login tanpa username ditolak', () => {
  const result = validateLogin({ password: 'rahasia123' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'username wajib diisi');
});

test('login tanpa password ditolak', () => {
  const result = validateLogin({ username: 'budi' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'password wajib diisi');
});

// --- validateNote ---

test('catatan valid lolos validasi', () => {
  const result = validateNote({ title: 'Belajar deployment', body: 'Materi EC2' });
  assert.equal(result.valid, true);
});

test('catatan dengan title kosong ditolak', () => {
  const result = validateNote({ title: '', body: 'isi' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'title wajib diisi');
});

test('catatan tanpa title ditolak', () => {
  const result = validateNote({ body: 'isi' });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'title wajib diisi');
});

test('catatan dengan title lebih dari 100 karakter ditolak', () => {
  const result = validateNote({ title: 'a'.repeat(101) });
  assert.equal(result.valid, false);
  assert.equal(result.error, 'title maksimal 100 karakter');
});
