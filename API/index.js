const { sendEmailWithPDF } = require ('./email')

const moment = require('moment');

const express = require('express');
const bd = require('./bd');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

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