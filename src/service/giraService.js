const db = require('../models/database_connector');

function addGira(giras, girasUsuario) {
    
    const girasArr = JSON.parse(girasUsuario[0].giras_usuario);
    girasArr.push(giras[0].id.toString());
    return JSON.stringify(girasArr);

}

function sumTotal(gira) {
    let total = 0;
    gira.forEach(g => total = total + g.resultado);
    return total = parseFloat(total).toFixed(2);
}

function totalVentas(ingresos) {
    ingresos[0].totalAnticipadaTienda = ingresos[0].precio_anticipada * ingresos[0].anticipada_tienda;
    ingresos[0].totalAnticipadaOnline = ingresos[0].precio_anticipada * ingresos[0].anticipada_online;
    ingresos[0].totalTaquilla = ingresos[0].precio_taquilla * ingresos[0].taquilla;
    return ingresos[0].totalAnticipadaTienda + ingresos[0].totalAnticipadaOnline + ingresos[0].totalTaquilla;
}

module.exports = { addGira, sumTotal, totalVentas }