const db = require('../models/database_connector');
const _ = require('lodash');
const giraService = require('../service/giraService')

const getGiras = async (req, res) => {
    try {
        if (req.query.id === "1") {
            const user_id = req.query.id;
            const [giras] = await db.query(`SELECT id, banda, DATE_FORMAT(fecha_inicio, \'%d/%m/%Y\') ` +  
                `as fecha_inicio, DATE_FORMAT(fecha_final, \'%d/%m/%Y\') as fecha_final FROM gira ` + 
                `ORDER BY fecha_inicio ASC;`);
                
            res.render('giras', { giras, user_id });             
        } else {
            // de esta forma entran las giras correspondiente al usuario
            const user_id = Number(req.query.id);
            const [user_giras] = await db.query(`SELECT usuario_id, giras_usuario FROM usuario_giras WHERE usuario_id = ${user_id}`);
            const giras_usuario = JSON.parse(user_giras[0].giras_usuario);
            let whereString = "";
            giras_usuario.forEach( (a,index) => {
                whereString += index === 0 ? `WHERE id = ${a}` : ` OR id = ${a}`;
            })
            const queryString = !_.isEmpty(whereString) ? 
                `SELECT id, banda, DATE_FORMAT(fecha_inicio, \'%d/%m/%Y\') ` +  
                `as fecha_inicio, DATE_FORMAT(fecha_final, \'%d/%m/%Y\') as fecha_final FROM gira ` + 
                `${whereString} ` +
                `ORDER BY fecha_inicio ASC;` : 
                "SELECT null";
            const [giras] = await db.query(queryString);
            res.render('giras', { giras, user_id });
        }        
    } catch (error) {
        console.log(error)
        res.status(500).send('Error al obtener giras');
    }
};

const newGira = async (req,res) => {
    try{
        const newGira = req.body;
        const query = 'INSERT INTO GIRA (banda, fecha_inicio, fecha_final) VALUES (?, ?, ?)';
        await db.query(query, [newGira.nombre, newGira.fecha_inicio, newGira.fecha_final]);
        const query2 = 'SELECT id, banda, DATE_FORMAT(fecha_inicio, \'%d/%m/%Y\') ' +  
            'as fecha_inicio FROM gira ' +
            'WHERE banda = ? AND fecha_inicio = ? ;';
        const [giras] = await db.query(query2, [newGira.nombre, newGira.fecha_inicio])
        const [girasUsuario] = await db.query(`SELECT * FROM usuario_giras WHERE usuario_id = ${newGira.user_id}`);
        const girasAdded = giraService.addGira(giras,girasUsuario);
        await db.query(`UPDATE usuario_giras SET giras_usuario = '${girasAdded}' WHERE usuario_id = ${newGira.user_id}`)
        res.redirect(`/nueva_gira?banda=${newGira.nombre}&id=${giras[0].id}&user_id=${req.body.user_id}`);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error al crear gira');
    }
}

const getGira = async (req,res) => {
    try {
        const id = req.query.id;
        const user_id = req.query.user_id;
        const queryname = 'SELECT id, banda FROM gira WHERE id = ?;';
        const query0 = await db.query(queryname, [id])
        const nombre = query0[0][0].banda
        const query = 'SELECT id, ciudad, sala, DATE_FORMAT(fecha, \'%d/%m/%Y\')' +  
            'as fecha, coste as resultado, gira_id FROM concierto ' + 
            'WHERE gira_id = ? ' + 
            'ORDER BY fecha;';
        const [gira] = await db.query(query, [id]);        
        const total = giraService.sumTotal(gira);
        res.render(`gira`, {nombre, gira, total, user_id});
    }catch (err) {
        console.log(err)
        res.status(500).send('Error al cargar gira');
    }
}

const goNewGira = async (req,res) => {
    try{
        const banda = req.query.banda;
        const id = req.query.id;
        const user_id = req.query.user_id;
        const query = 'SELECT concierto.id, concierto.ciudad, concierto.sala, concierto.gira_id, DATE_FORMAT(fecha, \'%d/%m/%Y\') ' +  
            'as fecha, ingresos.precio_anticipada, ingresos.precio_taquilla FROM concierto ' + 
            'INNER JOIN ingresos ON ingresos.concierto_id = concierto.id ' +
            'WHERE concierto.gira_id = ? ' +
            'ORDER BY concierto.fecha ASC;';
        const [conciertos] = await db.query(query, id)
        res.render('nueva_gira', { banda, conciertos, id, user_id });
    } catch (err) {
        console.log(err)
        res.send("Algo va mal")
    }
    
}

const newBolo = async (req,res) => {
    try{
        const newDatos = await req.body;
        const query = 'INSERT INTO CONCIERTO (fecha, ciudad, sala, gira_id) VALUES (?, ?, ?, ?)';
        await db.query(query, [newDatos.fecha, newDatos.ciudad, newDatos.sala, newDatos.id]);
        const queryId = 'SELECT id FROM concierto WHERE fecha = ? AND sala = ?';
        const conciertoId= await db.query(queryId, [newDatos.fecha, newDatos.sala]);
        const id = conciertoId[0][0].id;
        const queryNewGastos = 'INSERT INTO gastos(concierto_id)' +
                               'VALUES (?) ';
        await db.query(queryNewGastos, [id])
        const queryNewIngresos = 'INSERT INTO ingresos(concierto_id, precio_anticipada, precio_taquilla)' +
                                 'VALUES (?,?,?) ';
        await db.query(queryNewIngresos, [id, newDatos.precio_anticipada, newDatos.precio_taquilla]);
        res.redirect(`nueva_gira?banda=${newDatos.banda}&id=${newDatos.id}&user_id=${req.body.user_id}`);
    } catch (error) {
        console.log(error)
        res.status(500).send('Error al crear gira');
    }
}

const getBolo = async (req,res) => {
    try {
        //realizo aqui una suma en SQL(gastos) y otra en el service(ingresos);
        const id = req.query.id;
        const user_id = req.query.user_id;
        const nombreQuery = await db.query(`SELECT DISTINCT(banda), gira.id FROM gira, concierto WHERE gira.id = (SELECT gira_id FROM concierto WHERE concierto.id = ${id} );`);
        const nombre = nombreQuery[0][0].banda;
        const giraId = nombreQuery[0][0].id;
        const cols = await db.query('SELECT GROUP_CONCAT(column_name SEPARATOR " + ") ' + 
                'AS total FROM information_schema.columns WHERE table_name = "gastos" AND column_name != "concierto_id" AND column_name != "id";')
        const queryTotal = `SELECT SUM(${cols[0][0].total}) as total FROM gastos WHERE concierto_id = ?`;
        const totalQuery = await db.query(queryTotal, [id]);
        const total = parseFloat(totalQuery[0][0].total.toFixed(2));
        const query1 = 'SELECT DATE_FORMAT(fecha, \'%d/%m/%Y\')' +  
            'as fecha, id, sala, notas FROM concierto ' + 
            'WHERE id = ? ' + 
            'ORDER BY fecha;';        
        const [bolo] = await db.query(query1, [id])
        const cols2 = await db.query('SELECT GROUP_CONCAT(column_name SEPARATOR " , ") ' + 
                'AS cols FROM information_schema.columns WHERE table_name = "gastos" AND column_name != "concierto_id" AND column_name != "id";');
        const query2 = `SELECT ${cols2[0][0].cols} FROM gastos WHERE concierto_id = ? LIMIT 1`;
        // hemos sustituido los valores fijos de las columnas por dinámicos, por si añadimos campos de gastos
        const [gastos] = await db.query(query2, [id]);
        const query3 = 'SELECT precio_anticipada, gastos_gestion, precio_taquilla, anticipada_online, anticipada_tienda, taquilla_tarjeta, taquilla_efectivo, concierto_id FROM ingresos WHERE concierto_id = ?'
        const [ingresos] = await db.query(query3, [id]);
        const ing = giraService.totalVentas(ingresos);
        const totalVentas = ing.total;
        const resultado = parseFloat(totalVentas - Number(total)).toFixed(2);
        await db.query('UPDATE gastos SET ticketing = ? * ? * 0.03 WHERE id = ?', [ing.precio_anticipada, ing.anticipada_online, id]);
        res.render('bolo', { bolo, nombre, gastos, total, ingresos, totalVentas, resultado, id, giraId, user_id });
    } catch (err) {
        console.log(err);
        res.send(500, "algo va mal");
    }
}

const postGastos = async (req,res) => {
    try {
        if (req.body.formType == 'formGastos') {
            const gasto = req.body;
            Object.entries(gasto).forEach(async ([clave, valor]) => {
                if (clave != 'formType' && clave != 'nombre' && clave != 'concierto_id' && clave != 'user_id'){ //TODO eliminar el campo nombre del formulario
                    valor = /^\d+(\.\d+)?$/.test(valor) ? valor : 0;
                    await db.query(`UPDATE gastos SET ${clave} = ${valor} WHERE concierto_id = ${gasto.concierto_id};`);
                    
                }
            });
            //la siguiente query escoge el nombre de todas las columnas separadas por un + para hacerle una query siguiente con la suma
            const cols = await db.query('SELECT GROUP_CONCAT(column_name SEPARATOR " + ") ' + 
                'AS total FROM information_schema.columns WHERE table_name = "gastos" AND column_name != "concierto_id" AND column_name != "id";')
            const queryTotal = `SELECT SUM(${cols[0][0].total}) as total FROM gastos WHERE concierto_id = ?`;
            const totalQuery = await db.query(queryTotal, [gasto.concierto_id]);
            const total = parseFloat(totalQuery[0][0].total.toFixed(2));
            // TODO modificar este redirect sin el nombre y el total
            const user_id = req.body.user_id;
            res.redirect(`/gira/bolo/?id=${gasto.concierto_id}&nombre=${gasto.nombre}&total=${total}&user_id=${user_id}`);
        } else if (req.body.formType == 'formIngresos') {
            const ingresos = req.body;
            const queryIngresos = 'UPDATE ingresos SET ' + 
                                  'anticipada_online = ?, anticipada_tienda = ? , taquilla_tarjeta = ?, taquilla_efectivo = ? WHERE concierto_id = ?;';
            await db.query(queryIngresos, [ingresos.anticipada_online, ingresos.anticipada_tienda, ingresos.taquilla_tarjeta, ingresos.taquilla_efectivo, ingresos.concierto_id]);
            // TODO modificar este redirect sin el nombre y el total
            const user_id = ingresos.user_id;
            const precio = await db.query(`SELECT precio_anticipada FROM ingresos WHERE concierto_id=${ingresos.concierto_id}`)
            const ticketing = precio[0][0].precio_anticipada * ingresos.anticipada_online * 0.03;
            await db.query(`UPDATE gastos SET ticketing = ${ticketing} WHERE concierto_id = ${ingresos.concierto_id}`)
            res.redirect(`/gira/bolo/?id=${ingresos.concierto_id}&nombre=${ingresos.nombre}&total=${ingresos.total}&user_id=${user_id}`);
        } else if (req.body.formType == 'notas') {
            const notas = req.body.notas;
            const id = req.body.concierto_id;
            const nombre = req.body.nombre;
            const total = req.body.total;
            const user_id = req.body.user_id;
            const query = 'UPDATE concierto SET ' +
                          'notas = ? WHERE id = ?';
            db.query(query, [notas,id]);
            res.redirect(`/gira/bolo/?id=${id}&nombre=${nombre}&total=${total}&user_id=${user_id}`);
        }
    } catch (err) {
        console.log(err)
        res.send(500, "algo va mal")
    }
    
}

module.exports = { getGiras, newGira, goNewGira, getGira, newBolo, getBolo, postGastos}


