const jwt = require('jsonwebtoken');

// ======================================================
// VERIFICAR TOKEN
// ======================================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); /// Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });


};

// ======================================================
// VERIFICAR ADMIN ROLE
// ======================================================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes permiso para acceder a esta funcion'
            }
        });
    }


}

// ======================================================
// VERIFICAR TOKEN URL
// ======================================================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}