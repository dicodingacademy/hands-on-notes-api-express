// Fungsi validasi murni (tanpa database) supaya mudah di-unit-test.
// Setiap fungsi mengembalikan { valid: true } atau { valid: false, error: '<pesan>' }.

function validateRegister(payload) {
  const { username, password } = payload || {};

  if (typeof username !== 'string' || username.trim().length === 0) {
    return { valid: false, error: 'username wajib diisi' };
  }
  if (username.trim().length < 3 || username.trim().length > 50) {
    return { valid: false, error: 'username harus 3-50 karakter' };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, error: 'password minimal 6 karakter' };
  }
  return { valid: true };
}

function validateLogin(payload) {
  const { username, password } = payload || {};

  if (typeof username !== 'string' || username.trim().length === 0) {
    return { valid: false, error: 'username wajib diisi' };
  }
  if (typeof password !== 'string' || password.length === 0) {
    return { valid: false, error: 'password wajib diisi' };
  }
  return { valid: true };
}

function validateNote(payload) {
  const { title } = payload || {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'title wajib diisi' };
  }
  if (title.trim().length > 100) {
    return { valid: false, error: 'title maksimal 100 karakter' };
  }
  return { valid: true };
}

module.exports = { validateRegister, validateLogin, validateNote };
