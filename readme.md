
# TouriFy

![logo][logo]

[logo]: assets/img/tourify_logo.jpg "Logo"


### Proyecto de backend con MySQL (No Relacional)

Este es un pequeño proyecto de demostración con un backend en Node.js y MySQL estructurado en un formato no relacional. 

Es un proyecto nacido de mi necesidad de centralizar algunos datos de las giras musicales con las que trabajo, de forma sencilla y esquemática. 

Esta primera versión del 12/2/2024 no es más que un embrión del desarrollo. Habrá actualizaciones a medida que avancen mis necesidades y conocimientos. Gracias por la paciencia y el apoyo.

Este proyecto no tiene un front-end, sino unas vistas en ```.ejs```. En el futuro añadiré un front-end para mejorar la escalabilidad del proyecto.

### Tecnologías usadas
- Node.js
- Express
- MySQL
- Login con JWT y bcrypt

### Pre-Instalación
En el archivo ```assets\setup.sql``` se genera una base de datos llamada ```de_gira```. Si desea cambiar el nombre de la base de datos, debe hacerlo en el archivo ```assets\setup.sql``` (fila 1) como tu conector en el archivo ```src\models\database_connector.js``` (fila 7).

En el archivo ```src\service\initializeDatabase.js``` puede modificar el salt del hash de bcrypt para encriptar la contraseña del admin (fila 13) y en ```src\controllers\loginController.js``` puede modificar el salt del hash de bcrypt para encriptar las contraseñas de los usuarios (fila 48).

### Instalación
1. Clona el repositorio:
   ```git clone https://github.com/{tuusuario}/touriFy.git```
2. Instala un servidor MySql en tu entorno y configura el conector en el archivo ```src\models\database_connector.js``` con tus datos
3. Añada un archivo ```.env``` en la raiz y establezca una cadena llamada ```SEED``` y un integer para ```PORT```.
4. _Usuario admin:_ Añada una cadena llamada ```ADMIN_PASS``` a su archivo ```.env```.
5. Instala las dependencias ejecutando ```npm install``` en la carpeta clonada

Finalmente, puede arrancar la aplicación con el comando ```npm start```
