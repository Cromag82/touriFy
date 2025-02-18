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
    ingresos[0].totalTaquilla_tarjeta = ingresos[0].taquilla_tarjeta * ingresos[0].precio_taquilla;
    ingresos[0].totalTaquilla_efectivo = ingresos[0].taquilla_efectivo * ingresos[0].precio_taquilla;
    ingresos[0].totalGastos_gestion = ingresos[0].gastos_gestion * ingresos[0].anticipada_online;
    ingresos[0].ivaAnticipadaOnline = parseFloat((ingresos[0].totalAnticipadaOnline * -0.10).toFixed(2));
    ingresos[0].ivaGastos = parseFloat((ingresos[0].totalGastos_gestion * -0.21).toFixed(2));
    ingresos[0].ivaTaquilla_tarjeta = parseFloat((ingresos[0].totalTaquilla_tarjeta * -0.10).toFixed(2));
    ingresos[0].total = ingresos[0].totalAnticipadaTienda + ingresos[0].totalAnticipadaOnline + ingresos[0].totalTaquilla_tarjeta
            + ingresos[0].totalTaquilla_efectivo + ingresos[0].totalGastos_gestion
            + ingresos[0].ivaAnticipadaOnline + ingresos[0].ivaGastos + ingresos[0].ivaTaquilla_tarjeta;
    return ingresos[0];
}

module.exports = { addGira, sumTotal, totalVentas }