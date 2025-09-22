export const checkRole = (roles) => {

    return (req, res, next) => {
        const userRole = req.user.role;
        if (roles.includes(userRole)) {
            return next();
            
        } else {
            return res.status(403).json({
                msg: "Acceso denegado. No tienes los permisos necesarios."
            });
        }
    };
};