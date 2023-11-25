import { Component } from '@angular/core';
import { LibrosService } from 'src/app/servicios/libros.service';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import { map, take } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-prestamo',
  templateUrl: './alta-prestamo.component.html',
  styleUrls: ['./alta-prestamo.component.css']
})
export class AltaPrestamoComponent {
  sugerenciasISBN: string[] = [];
  esFechaValida: boolean = true;
  mensajeError: string = '';

  ISBN: number;
  idEjemplar: number;
  numControl: number;
  correo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;

  resp: any = [];

  constructor(private prestamosService: PrestamosService, private librosService: LibrosService) {} 

  altaPrestamo() {

    if (this.esFechaValida) {
      // Código para crear el libro
      console.log('Fecha válida.');
      // Aquí deberías enviar los datos al servidor para crear el libro
    } else {
      console.log('La fecha de prestamo no puede ser anterior a la fecha actual. El prestamo no se creará.');
    }

    const prestamo = {
      ISBN: this.ISBN,
      idEjemplar: this.idEjemplar,
      numControl: this.numControl,
      correo: this.correo,
      fechaPrestamo: this.fechaPrestamo,
      fechaDevolucion: this.fechaDevolucion
    };

    this.prestamosService.altaPrestamo(prestamo).subscribe(
      data => {
        console.log(data);
        this.resp = data;
        const res = this.resp.Resultado
        const msj = this.resp.Mensaje;
        if (res == 1) {
          Swal.fire({
            title: 'Prestamo agregado con exito!',
            icon: 'success'
          });
        } else if (res == 2) {
          Swal.fire({
            title: 'Atencion!',
            text: 'Problema al crear el prestamo: ' + msj.toString(),
            icon: 'warning'
          });
        } else {
          Swal.fire({
            title: 'Arror al dar de alta el prestamo!',
            text: 'Error al dar de alta el prestamo: ' + msj.toString(),
            icon: 'error'
          });
        }
        // console.log('Préstamo creado:', data);
        // alert('Préstamo creado correctamente')
        this.resetForm();
      },
      error => console.error('Error al crear el préstamo:', error)
    );
  }

  validarFecha(): void {
    const fechaPrestamo = new Date(this.fechaPrestamo);
    const fechaActual = new Date();
    
    // Establecer las horas, minutos, segundos y milisegundos de la fecha actual a 0
    fechaActual.setHours(0, 0, 0, 0);
  
    // Verificar si la fecha de préstamo es igual a la fecha actual y no es nula
    if (fechaPrestamo && fechaPrestamo.getTime() === fechaActual.getTime()) {
        // Convertir la fecha de préstamo a una cadena de texto en formato ISO (YYYY-MM-DD)
        this.fechaPrestamo = fechaPrestamo.toISOString().split('T')[0];
        this.esFechaValida = true;
        this.mensajeError = '';
    } else {
        this.esFechaValida = false;
        Swal.fire({
          title: 'La fecha de prestamo debe coincidir con la fecha actual.',
          icon: 'error'
        });
        this.reset();
    }
}

reset(){
  this.fechaPrestamo = '';
}

validarFechaDevolucion(): void {
  const fechaDevolucion = new Date(this.fechaDevolucion);
  const fechaActual = new Date();

  // Calcular la fecha permitida para devolución (7 días después de la fecha actual)
  const fechaPermitida = new Date(fechaActual);
  fechaPermitida.setDate(fechaPermitida.getDate() + 7);

  // Establecer las horas, minutos, segundos y milisegundos de la fecha actual a 0
  fechaActual.setHours(0, 0, 0, 0);
  fechaPermitida.setHours(0, 0, 0, 0);

  // Verificar si la fecha de devolución es válida (no anterior a la fecha actual y no posterior a 7 días desde la fecha actual)
  if (fechaDevolucion >= fechaActual && fechaDevolucion <= fechaPermitida) {
      this.esFechaValida = true;
      this.mensajeError = '';
  } else {
      this.esFechaValida = false;
      Swal.fire({
          title: 'La fecha de devolución no es válida. Debe ser dentro de los próximos 7 días desde la fecha actual.',
          icon: 'error'
      });
      this.resett();
  }
}

resett(){
  this.fechaDevolucion = '';
}

  private resetForm() {
    this.ISBN = null;
    this.idEjemplar = null;
    this.numControl = null;
    this.correo = '';
    this.fechaPrestamo = '';
    this.fechaDevolucion = '';
  }

}