const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.render('login', {me: 'Acceso no autorizado, token requerido'})
  }

  try {
    const decoded = jwt.verify(token, process.env.SEED); // Verificar el token con la semilla
    req.usuario = decoded; // Agregar la información del usuario al objeto req
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    return res.render('login', {me: 'token invalido o expirado'})
  }
};

module.exports = verificarToken;