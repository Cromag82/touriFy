CREATE DATABASE IF NOT EXISTS de_gira; ##escoge tu nombre favorito!

USE de_gira; ##escoge tu nombre favorito!

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gira (
    id INT AUTO_INCREMENT PRIMARY KEY,
    banda VARCHAR(100),
    fecha_inicio DATE,
	fecha_final DATE,
	total_gastos DOUBLE,
);

##TODO establecer sección de gastos en carretera
CREATE TABLE gastos_carretera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(100),
    coste DOUBLE,
	fecha DATE,
	gastos_total DOUBLE,
	id_gira INT
);

CREATE TABLE concierto (
    id INT AUTO_INCREMENT PRIMARY KEY,
	fecha DATE,
	ciudad VARCHAR(100),
	concepto INT,
	coste DOUBLE, 
	notas VARCHAR(510),
	gira_id INT
);

CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
	concierto_id int not null,
	catering DOUBLE DEFAULT 0.00,
	teloneros DOUBLE DEFAULT 0.00,
	cena_bo DOUBLE DEFAULT 0.00,
	produccion_local DOUBLE DEFAULT 0.00,
	parking DOUBLE DEFAULT 0.00 ,
	hotel DOUBLE DEFAULT 0.00,
	carteleria DOUBLE DEFAULT 0.00,
	envios DOUBLE DEFAULT 0.00,
	promo_carteleria DOUBLE DEFAULT 0.00,
	promo_online DOUBLE DEFAULT 0.00,
	coste_banda DOUBLE DEFAULT 0.00,
	coste_sala DOUBLE DEFAULT 0.00,
	extras_sala DOUBLE DEFAULT 0.00,
	taxis DOUBLE DEFAULT 0.00,
	ticketing DOUBLE DEFAULT 0.00,
	sgae DOUBLE DEFAULT 0.00
);

CREATE TABLE ingresos(
	id INT AUTO_INCREMENT PRIMARY KEY,
	concierto_id INT NOT NULL, 
	precio_anticipada double DEFAULT 0.00,
	gastos_gestion double DEFAULT 0.00,
	anticipada_online double DEFAULT 0.00, 
	anticipada_tienda double DEFAULT 0.00,
	precio_taquilla double DEFAULT 0.00,
	taquilla_tarjeta double DEFAULT 0.00,
	taquilla_efectivo double DEFAULT 0.00
);

CREATE TABLE usuario_giras (
	usuario_id INT NOT NULL,
	giras_usuario TEXT,
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

## TODO crear accesos y dotaciones por roles
CREATE TABLE roles (
    id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'Admin', 'Acceso total al sistema'),
(2, 'Usuario', 'Acceso limitado');

CREATE TABLE usuario_roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    asignado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE (usuario_id, rol_id)
);





