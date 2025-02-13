const db = require('../models/database_connector')
const fs = require('fs')
const bcrypt = require('bcrypt');
async function initializeDatabase() {

    const [dbTrue] = await db.query("SHOW DATABASES LIKE 'de_gira';"); //escoge tu nombre favorito!
    try {
      if (dbTrue.length === 0) {
          console.log('Base de datos no encontrada. Creando de_gira');  
          const sql = fs.readFileSync('../assets/setup.sql', 'utf8');
          await connection.query(sql);              
          //insertamos el usuario "admin" con password genérico
          const hashedPassword = bcrypt.hash(process.env.ADMIN_PASS, 10);
          try{
              await db.query('INSERT INTO usuarios (usuario, password) VALUES (?, ?)',["admin", hashedPassword])    ;
          } catch (err) {
              return res.render('register', {me:'Nombre de usuario no disponible, escoja un nombre de usuario distinto'});
          }       
          return res.render('login', {me: "Usuario introducido correctamente"});
          
        } else {
          console.log('La base de datos ya existe.');
        }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    } finally {
      //if (db) await db.end();
    }

}

module.exports = {initializeDatabase}