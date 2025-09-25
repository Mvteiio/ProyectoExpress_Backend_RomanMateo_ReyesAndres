const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    next();
  };
};

module.exports = {
    checkRole
};