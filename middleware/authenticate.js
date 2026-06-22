const jwt = require('jsonwebtoken');

// Middleware autentikasi: membaca header "Authorization: Bearer <token>",
// memverifikasi token dengan JWT_SECRET dari environment,
// lalu menyimpan id user ke req.userId untuk dipakai route berikutnya.
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'token tidak ditemukan' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'token tidak valid' });
  }
}

module.exports = authenticate;
