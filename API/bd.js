const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'braqy7zhp7yp4rjeppmp-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'uov1zxyon5enuzid',
  password: 'Kdzbi2b6TvWr9jtgTdYH',
  database: 'braqy7zhp7yp4rjeppmp'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;
