const { sendEmailWithPDF } = require ('./email')
const nodemailer = require('nodemailer');
const crypto = require('crypto');


//Login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const moment = require('moment');

const express = require('express');
const bd = require('./bd');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'BD_BIBLIOTECA'
  });
  
  // Conéctate a la base de datos
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });

// LOGIN

// Ruta para el registro de usuarios
app.post('/api/registro', (req, res) => {
  const { numero_control, nombre, apellido, email, telefono, contrasena } = req.body;
  // Encripta la contraseña
  const hashedPassword = bcrypt.hashSync(contrasena, 8);

  // Verifica si el número de control ya está registrado
  db.query(
    'SELECT * FROM usuario WHERE numControl = ?',
    [numero_control],
    (err, resultsNumControl) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error al verificar el número de control' });
      } else if (resultsNumControl.length > 0) {
        res.status(400).send({ message: 'El número de control ya está registrado' });
      } else {
        // Verifica si el correo electrónico ya está registrado
        db.query(
          'SELECT * FROM usuario WHERE correo = ?',
          [email],
          (err, resultsEmail) => {
            if (err) {
              console.error(err);
              res.status(500).send({ message: 'Error al verificar el correo electrónico' });
            } else if (resultsEmail.length > 0) {
              res.status(400).send({ message: 'El correo electrónico ya está registrado' });
            } else {
              // Inserta el usuario en la base de datos
              db.query(
                'INSERT INTO usuario (numControl, nombre, apellido, correo, telefono, contraseña) VALUES (?, ?, ?, ?, ?, ?)',
                [numero_control, nombre, apellido, email, telefono, hashedPassword],
                (err, result) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send({ message: 'Error al registrar el usuario' });
                  } else {
                    res.status(201).send({ message: 'Usuario registrado correctamente' });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


  
// Ruta de inicio de sesión
app.post('/api/login', (req, res) => {
  const { numControl, contraseña } = req.body;

  // Busca el usuario en la base de datos por su número de control
  db.query(
    'SELECT * FROM usuario WHERE numControl = ?',
    [numControl],
    async (err, result) => {
      if (err) {
        console.error('Error al buscar el usuario en la base de datos:', err);
        return res.status(500).send({ message: 'Error al buscar el usuario' });
      }

      if (result.length === 0) {
        console.log('Usuario no encontrado.');
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }

      const usuario = result[0];

      // Verifica si la contraseña almacenada está definida
      if (!usuario.contraseña) {
        console.error('Contraseña no encontrada en la base de datos para el usuario:', usuario);
        return res.status(500).send({ message: 'Contraseña no encontrada en la base de datos' });
      }

      // Compara la contraseña
      const contraseñaMatch = await bcrypt.compare(contraseña, usuario.contraseña);

      if (contraseñaMatch) {
        // Genera un token JWT
        const token = jwt.sign({ numControl: usuario.numControl }, 'secret', {
          expiresIn: '1h'
        });
        console.log('Inicio de sesión exitoso para el usuario:', usuario);
        res.status(200).send({ token, userData: usuario});
      } else {
        console.log('Credenciales inválidas para el usuario:', usuario);
        res.status(401).send({ message: 'Credenciales inválidas' });
      }
    }
  );
});



// Ruta para verificar si el correo electrónico está registrado y proporcionar un token JWT
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Busca el usuario en la base de datos por su correo electrónico
  db.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [email],
    (err, result) => {
      if (err) {
        console.error('Error al buscar el usuario en la base de datos:', err);
        return res.status(500).send({ message: 'Error al buscar el usuario' });
      }

      if (result.length === 0) {
        console.log('Correo electrónico no encontrado.');
        return res.status(404).send({ message: 'Correo electrónico no encontrado' });
      }

      console.log('Correo electrónico encontrado:', email);

      // Datos del usuario encontrado
      const usuario = result[0];
      console.log('Datos del usuario:', usuario);

      // Calcular la hora de expiración en México Central
      const expiresIn = 60; // tiempo de expiración en segundos
      const expiracionMxCentral = new Date(Date.now() + expiresIn * 1000);
      expiracionMxCentral.setHours(expiracionMxCentral.getHours() - 6); // Restar 5 horas para obtener la hora en México Central

      // Genera un token JWT
      const token = jwt.sign({ email: email }, 'secret', {
        expiresIn: expiresIn + 's' // Puedes ajustar la expiración como desees
      });

      // Imprime el token en la consola del servidor
      console.log('Token JWT generado:', token); 

      // Envía el token y la hora de expiración en México Central al cliente
      res.status(200).send({ token, expirationTime: expiracionMxCentral.toISOString(), userData: usuario });
    }
  );
});




//********************************************************************************************** */

// Ruta para renovar el token
app.post('/api/renew-token', (req, res) => {
  // Obtener el token enviado en la solicitud
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, 'tu_clave_secreta');

    // Generar un nuevo token con los mismos datos pero con una nueva expiración
    const newToken = jwt.sign(decoded, 'tu_clave_secreta', { expiresIn: '1h' }); // Aquí puedes ajustar la expiración como desees

    // Enviar el nuevo token al cliente
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error al renovar el token:', error);
    res.status(401).json({ message: 'Error al renovar el token' });
  }
});


//********************************************************************************************** */

// Configuración del middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar nodemailer para enviar correos electrónicos
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bibliotecautng1975@gmail.com', // Cambia esto por tu dirección de correo
        pass: 'piofgmqxyiachyzs' // Cambia esto por tu contraseña de correo
    }
});

// Almacenamiento temporal de códigos de verificación
const verificationCodes = {};

// Ruta para solicitar un restablecimiento de contraseña
app.post('/api/forgot-password', (req, res) => {
    const userEmail = req.body.email;
    const verificationCode = crypto.randomBytes(3).toString('hex'); // Generar código de verificación de 6 caracteres

    // Guardar el código de verificación en la base de datos o en memoria
    verificationCodes[userEmail] = verificationCode;

    // Enviar el código de verificación por correo electrónico
    const mailOptions = {
        from: 'bibliotecautng1975@gmail.com',
        to: userEmail,
        subject: 'Solicitud de cambio de contraseña',
        text: 
        `Haz solicitado un código de verificación para el restablecimeinto de tu contraseña. Tu código de verificación es: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al enviar el correo de verificación.');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Se ha enviado un correo con el código de verificación.');
        }
    });
});

// Ruta para verificar el código de verificación
app.post('/api/verify-code', (req, res) => {
  const userEmail = req.body.email;
  const userEnteredCode = req.body.code;

  if (verificationCodes[userEmail] === userEnteredCode) {
      // Eliminar el código de verificación después de ser utilizado
      delete verificationCodes[userEmail];
      res.status(200).json({ message: 'Código de verificación válido. Permitiendo restablecimiento de contraseña.' });
  } else {
      res.status(400).json({ error: 'Código de verificación inválido.' });
  }
});

// Ruta para restablecer la contraseña
app.post('/api/reset-password', (req, res) => {
  const userEmail = req.body.email;
  const newPassword = req.body.newPassword;

  // Hash de la nueva contraseña
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      console.error('Error al cifrar la contraseña:', err);
      return res.status(500).json({ error: 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.' });
    }

    // Query SQL para actualizar la contraseña
    const sqlQuery = "UPDATE Usuario SET contraseña = ? WHERE correo = ?";
  
    // Ejecuta la consulta SQL
    db.query(sqlQuery, [hash, userEmail], (err, results) => {
      if (err) {
        console.error('Error al restablecer la contraseña:', err);
        return res.status(500).json({ error: 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.' });
      }
      
      if (results.affectedRows === 0) {
        // Si no se actualiza ninguna fila, significa que no se encontró ningún usuario con el correo electrónico proporcionado
        return res.status(404).json({ error: 'No se encontró ningún usuario con el correo electrónico proporcionado.' });
      }

      // Envía una respuesta de éxito
      res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    });
  });
});

//*********************************************************************************************************************** */

// OBTENER USUARIOS (MEDIANTE PETICIÓN GET)
app.get('/api/usuarios', (req, res) => {
  const sQuery = "SELECT * FROM usuario;"; // Consulta SQL para seleccionar todos los usuarios de la tabla Usuario

  bd.query(sQuery, (err, results) => {
      if (err) {
          console.error('Error al obtener usuarios: ' + err.message);
          res.status(500).send('Error al obtener usuarios de la base de datos');
      } else {
          res.json(results); // Enviamos los resultados como respuesta en formato JSON
      }
  });
});


//***************************************************************************************************************************** */



//Barra de busqueda
app.get('api/books/search/:term', (req, res) => {
    const searchTerm = req.params.term;
  
    const query = `SELECT *
    FROM Libros
    WHERE ISBN = ?
       OR titulo LIKE ?
       OR autor LIKE ?
       OR categoria LIKE ?`;
    const searchValue = `%${searchTerm}%`;
  
    connection.query(query, [searchValue], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json(results);
      }
    });
  });

/*********************************************************************************************/
// ***** LIBROS *****
// OBTENER LIBROS (MEDIANTE PETICIÃ“N GET)
app.get('/api/libros', (req, res) => {
    const sQuery = "SELECT * FROM Libro;";

    bd.query(sQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener libros: ' + err.message);
            res.status(500).send('Error al obtener libros de la base de datos');
        } else {
            res.json(results);
        }
    });
});

// OBTENER UN SOLO LIBRO MEDIANTE EL ID (MEDIANTE PETICIÃ“N GET)
app.get('/api/libros/:id', (req, res) => {
    const isbn = (req.params.id).toString(); // Obtener el valor del parÃ¡metro de la URL
    const sQuery = "SELECT * FROM Libro WHERE ISBN = ?";

    bd.query(sQuery, [isbn], (err, results) => {
        if (err) {
            console.error('Error al obtener el libro: ' + err.message);
            res.status(500).send('Error al obtener el libro de la base de datos');
        } else {
            res.json(results);
        }
    });
});

// OBTENER LIBROS MEDIANTE BÚSQUEDA AVANZADA (MEDIANTE PETICIÓN GET)
app.get('/api/libros/buscar', (req, res) => {
    const termino = req.query.termino;
    console.log('Término de búsqueda:', termino);
  
    const sQuery = `
      SELECT * FROM Libro 
      WHERE ISBN LIKE '%${termino}%' 
      OR titulo LIKE '%${termino}%' 
      OR autores LIKE '%${termino}%' 
      OR editorial LIKE '%${termino}%' 
      OR categoria LIKE '%${termino}%';
    `;
  
    bd.query(sQuery, (err, results) => {
      if (err) {
        console.error('Error al obtener el libro: ' + err.message);
        res.status(500).send('Error al obtener el libro de la base de datos');
      } else {
        res.json(results);
      }
    });
  });




// AGREGAR NUEVO LIBRO (MEDIANTE PETICION POST)
app.post('/api/libros', (req, res) => {
    const libro = {
        ISBN: req.body.ISBN,
        titulo: req.body.titulo,
        autores: req.body.autores,
        fPublicacion: req.body.fPublicacion,
        editorial: req.body.editorial,
        cantEjemplares: parseInt(req.body.cantEjemplares),
        categoria: req.body.categoria
    };

    const sQuery = "INSERT INTO Libro SET ?";

    bd.query(sQuery, [libro], (err, results) => {
        if (err) {
            console.error('Error al agregar libro: ' + err.message);
            res.status(500).send('Error al insertar el libro en la base de datos');
        } else {
            res.json(results);
        }
    });
});

// ACTUALIZAR UN LIBRO (MEDIANTE PETICION PUT)
app.put('/api/libros/:isbn', (req, res) => {
    const libroId = req.params.isbn; // ObtÃ©n el ID del libro a actualizar desde los parÃ¡metros de la ruta
    const nuevosDatos = {
      ISBN: req.body.ISBN,
      titulo: req.body.titulo,
      autores: req.body.autores,
      fPublicacion: req.body.fPublicacion,
      editorial: req.body.editorial,
      categoria: req.body.categoria
    };
  
    const sQuery = "UPDATE Libro SET ? WHERE ISBN = ?";
  
    bd.query(sQuery, [nuevosDatos, libroId], (err, results) => {
      if (err) {
        console.error('Error al actualizar el libro: ' + err.message);
        res.status(500).send('Error al actualizar el libro en la base de datos');
      } else {
        res.json(results);
      }
    });
  });  

// ELIMINAR LIBRO (PETICION DELETE)
app.delete('/api/libros/:id', (req, res) => {
    const isbn = (req.params.id).toString();
    const sQuery = ("DELETE FROM Libro WHERE ISBN = ?");

    bd.query(sQuery, [isbn], (err, results) => {
        if (err) {
            console.error('Error al eliminar libro: ' + err.message);
            res.json(err);
            res.status(500).send('Error al eliminar el libro de la base de datos');
        } else {
            res.json(results);
        }
    });
});

/*********************************************************************************************/
// ***** PRESTAMOS *****
// OBTENER PRESTAMOS (MEDIANTE PETICIÃ“N GET)
app.get('/api/prestamos', (req, res) => {
    const sQuery = "SELECT * FROM Prestamo;";

    bd.query(sQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener prestamos: ' + err.message);
            res.status(500).send('Error al obtener prestamos de la base de datos');
        } else {
            res.json(results);
        }
    });
});

// OBTENER UN SOLO PRESTAMO MEDIANTE EL ID (MEDIANTE PETICIÃ“N GET)
app.get('/api/prestamos/:id', (req, res) => {
    const idPrestamo = (req.params.id).toString(); // Obtener el valor del parÃ¡metro de la URL
    const sQuery = "SELECT * FROM Libro WHERE idPrestamo = ?";

    bd.query(sQuery, [idPrestamo], (err, results) => {
        if (err) {
            console.error('Error al obtener el prestamo: ' + err.message);
            res.status(500).send('Error al obtener el prestamo de la base de datos');
        } else {
            res.json(results);
        }
    });
});

// AGREGAR NUEVO PRESTAMO (MEDIANTE PETICION POST)
app.post('/api/prestamos', (req, res) => {
    const prestamo = {
        idEjemplar: parseInt(req.body.idEjemplar),
        numControl: req.body.numControl,
        correo: req.body.numControl,
        fechaPrestamo: req.body.fechaPrestamo,
        fechaDevolucion: req.body.fechaDevolucion
    };

    const sQuery = "INSERT INTO Prestamo SET ?";

    bd.query(sQuery, [prestamo], (err, results) => {
        if (err) {
            console.error('Error al agregar el prestamo: ' + err.message);
            res.status(500).send('Error al insertar el prestamo en la base de datos');
        } else {
            res.json({
                Resultado: 1,
                Mensaje: 'Prestamo agregado exitosamente'
            });
        }
    });
});


// ELIMINAR PRESTAMO (PETICION DELETE)
app.delete('/api/prestamos/:id', (req, res) => {
    const idPrestamo = (req.params.id).toString(); // Obtener el valor del parÃ¡metro de la URL
    const sQuery = "DELETE FROM Prestamo WHERE idPrestamo = ?";

    bd.query(sQuery, [idPrestamo], (err, results) => {
        if (err) {
            console.error('Error al eliminar el prestamo: ' + err.message);
            res.status(500).send('Error al eliminar el prestamo de la base de datos');
        } else {
            res.json(results);
        }
    });
});

app.put('/api/prestamos/:id', (req, res) => {
    const idPrestamo = (req.params.id).toString(); // Obtener el valor del parámetro de la URL
    const fechaDevolucion = (req.body.fechaDevolucion)
    const sQuery = "UPDATE Prestamo SET fechaDevolucion = ? WHERE idPrestamo = ?";

    bd.query(sQuery, [fechaDevolucion, idPrestamo], (err, results) => {
        if (err) {
            console.error('Error al eliminar el prestamo: ' + err.message);
            res.status(500).send('Error al eliminar el prestamo de la base de datos');
        } else {
            res.json(results);
        }
    });
});

/*********************************************************************************************/
// ***** EJEMPLARES *****
// OBTENER EJEMPLARES (MEDIANTE PETICIÃ“N GET)
app.get('/api/ejemplares', (req, res) => {
    const sQuery = "SELECT * FROM Ejemplar;";

    bd.query(sQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener ejemplar: ' + err.message);
            res.status(500).send('Error al obtener ejemplar de la base de datos');
        } else {
            res.json(results);
        }
    });
});

// OBTENER EJEMPLARES MEDIANTE EL ISBN (MEDIANTE PETICIÓN GET)
app.get('/api/ejemplares/:id', (req, res) => {
    const idEjemplar = req.params.id.toString(); // Obtener el valor del parámetro de la URL
    const sQuery = "SELECT li.titulo, ej.ISBN, ej.idEjemplar FROM Ejemplar ej INNER JOIN Libro li ON ej.ISBN = li.ISBN WHERE ej.ISBN = ?";

    bd.query(sQuery, [idEjemplar], (err, results) => {
        if (err) {
            console.error('Error al obtener los ejemplares: ' + err.message);
            res.status(500).send('Error al obtener el ejemplar de la base de datos');
        } else {
            if (results.length > 0) {
                // Si se encontraron registros, se envían los resultados
                res.json(results);
            } else {
                // No se encontraron registros
                // Ahora verificamos si el libro existe o no
                const sQueryLibro = "SELECT 1 FROM Libro WHERE ISBN = ?";
                bd.query(sQueryLibro, [idEjemplar], (err, libroResults) => {
                    if (err) {
                        console.error('Error al verificar si el libro existe: ' + err.message);
                        res.status(500).send('Error al verificar si el libro existe en la base de datos');
                    } else {
                        if (libroResults.length > 0) {
                            // El libro existe, pero no hay ejemplares
                            res.json(1);
                        } else {
                            // El libro no existe
                            res.json(0);
                        }
                    }
                });
            }
        }
    });
});

// AGREGAR NUEVO EJEMPLAR (MEDIANTE PETICION POST)
app.post('/api/ejemplares/', (req, res) => {
    const ejemplar = {
        ISBN: req.body.ISBN // Debes obtener el ISBN del cuerpo de la solicitud, no de los parÃ¡metros
    }

    const sQuery = "INSERT INTO Ejemplar SET ?";

    bd.query(sQuery, ejemplar, (err, results) => {
        if (err) {
            console.error('Error al agregar el ejemplar: ' + err.message);
            res.status(500).send('Error al insertar el ejemplar en la base de datos');
        } else {
            res.json(results);
        }
    });
});


// ELIMINAR EJEMPLAR (PETICION DELETE)
app.delete('/api/ejemplares/:id/:isbn', async (req, res) => {
    const idEjemplar = req.params.id;
    const isbn = req.params.isbn;
  
    const sQueryDel = 'DELETE FROM Ejemplar WHERE idEjemplar = ?';
    const sQueryUpd = 'UPDATE Libro SET cantEjemplares = (SELECT COUNT(*) FROM Ejemplar WHERE ISBN = ?) WHERE ISBN = ?';
  
    try {
      // Ejecutar la primera consulta de eliminaciÃ³n
      const resultDel = await ejecutarQuery(sQueryDel, [idEjemplar]);
  
      // Ejecutar la segunda consulta de actualizaciÃ³n
      const resultUpd = await ejecutarQuery(sQueryUpd, [isbn, isbn]);
  
      res.json({ message: 'EliminaciÃ³n exitosa y actualizaciÃ³n realizada.' });
    } catch (err) {
      console.error('Error en las consultas: ' + err.message);
      res.status(500).send('Error en las consultas a la base de datos.');
    }
  });
  
  function ejecutarQuery(query, params) {
    return new Promise((resolve, reject) => {
      bd.query(query, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  

// PRESTAMO (GENERAR DOCUMENTO)
app.get('api/prestamos/generapdf', async (req, res) => {
    const prestamo = {
        idPrestamo: parseInt(req.body.idPrestamo),
        idEjemplar: parseInt(req.body.idEjemplar),
        numControl: req.body.numControl,
        correo: req.body.correo,
        fechaPrestamo: req.body.fechaPrestamo,
        fechaDevolucion: req.body.fechaDevolucion
    };
    const refPago = pdf.generatePDF(prestamo);
});

function consultarPrestamos() {
 
    const sQuery = "SELECT * FROM Prestamo";
    bd.query(sQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener los préstamos: ' + err.message);
            res.status(500).send('Error al obtener los préstamos de la base de datos');
        } else {
            console.log(results);

             const fechaActual = moment(); // Obtén la fecha y hora actual
             results.forEach(prestamo => {
                 const fechaDevolucion = moment(prestamo.fechaDevolucion);
                 console.log(fechaActual);
                 console.log(fechaDevolucion)
                 // Convierte la fechaDevolucion del registro a un objeto moment
                 if (!fechaDevolucion.isAfter(fechaActual)) {
                     // Si la fechaDevolucion es mayor que la fecha actual, enviar correo electrónico
                     console.log();
                     sendEmailWithPDF(prestamo); // Envía los datos del registro como parámetro
                 }
             });
        }
    });
}
  
  // Intervalo de tiempo en milisegundos para un día (24 horas * 60 minutos * 60 segundos * 1000 milisegundos)
  const intervaloDeTiempo = 24 * 60 * 60 * 1000; 
  
  
  // Ejecutar la función diariamente usando setInterval
  setInterval(consultarPrestamos, intervaloDeTiempo);
  

const port = process.env.port || 4200;
app.listen(port, () => console.log(`Escuchando en el puerto: ${port}...`));

app.listen(3000, () => {
    console.log('Servidor Express escuchando en el puerto 3000');
});