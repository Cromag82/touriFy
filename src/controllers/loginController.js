const db = require('../models/database_connector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const login = async (req,res) => {
    
    if (!_.isEmpty(req.body)) {
        const { usuario, password } = req.body;
        try {
            const query = await db.query('SELECT * FROM USUARIOS WHERE USUARIO = ?', [usuario]);
            //buscamos usuario
            const user = query[0].find(u => u.usuario === usuario);
            if (!user) return res.render('login',{me:"usuario no encontrado"});
            //validamos contraseña encriptada
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.render('login',{me:"contraseña incorrecta"});
            //creamos token y enviamos por cookies
            const token = jwt.sign({ userId: usuario }, process.env.SEED, { expiresIn: '1h' });
            res.cookie('auth_token', token, {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'production', <--- Solo en HTTPS en producción ---->
                maxAge: 3600000, // 1 hora
            });
        
            res.redirect(`/giras?id=${user.id}`) //TODO lo pasamos por query?
            

        }catch (err) {
            console.log(err)
            return res.render('/login', {me:'ha habido un error'})
        }
        
    }
    
    res.render('login', {me:null})
}

const register = async (req,res) => {

    if (!_.isEmpty(req.body)) {
        
        const { usuario, password } = req.body;
        try {
            const [query] = await db.query(`SELECT usuario FROM usuarios WHERE usuario = '${usuario}'`);
            if (query.length === 0) {
                // Encriptar la contraseña, modificar en cada instancia el numero de salt
                const hashedPassword = await bcrypt.hash(password, 10); 
                await db.query('INSERT INTO usuarios (usuario, password) VALUES (?, ?)',[usuario, hashedPassword]);
                const [query] = await db.query(`SELECT id FROM usuarios WHERE usuario = '${usuario}'`);
                const id = query[0].id;
                await db.query(`INSERT INTO usuario_giras (usuario_id, giras_usuario) VALUES (${id}, '[]')`);
            } else {
                return res.render('register', {me:'Nombre de usuario no disponible, escoja un nombre de usuario distinto'});
            }
        } catch (err){
            console.log("Hay un error al registrar\n", err);
        }
        return res.render('login', {me: "Usuario introducido correctamente"})
    }
    
    res.render('register', {me: null})

}

const logout = (req,res, next) => {
        
    res.clearCookie('auth_token', {
            httpOnly: true,
            //secure: true, <---AÑADIR EN CASO DE HTTPS--->
            sameSite: 'Strict'
        });
    next();    
}



module.exports = {login, register, logout}