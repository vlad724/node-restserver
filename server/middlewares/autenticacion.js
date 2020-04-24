const jwt = require('jsonwebtoken');

/* verificar token */

let verificarToken = (req, res, next) => {
    let token = req.get('token'); //lee los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
        //si no se llama la funcion next jamas realiza lo siguiente
    }); //el token que recibe, segundo el seed que creamos para darle seguirdad y lo 3ro un callback




};

/* verifica adminrole */

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        })
    }


}

module.exports = {
    verificarToken,
    verificaAdmin_Role
}