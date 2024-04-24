import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent { 

  numeroControl: string = '';
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  telefono: string = '';
  password: string = '';

  constructor(private usuarioService: UsuariosService, private router: Router) { }

  registro(registroForm: NgForm) {
    registroForm.form.markAllAsTouched(); 
    if (registroForm.invalid) {
      // Si el formulario es inválido, no se realiza el registro
      return;
    }

    const usuario = {
      numero_control: this.numeroControl,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      contrasena: this.password
    };

    this.usuarioService.registro(usuario).subscribe(
      (res: any) => {
        // Manejar respuesta exitosa del registro
        Swal.fire('¡Registro exitoso!', 'El usuario ha sido registrado correctamente', 'success');
        // Reiniciar campos
        this.numeroControl = '';
        this.nombre = '';
        this.apellido = '';
        this.email = '';
        this.telefono = '';
        this.password = '';
        // Redirigir a la página de inicio
        this.router.navigate(['/inicio']);
      },
      (error: any) => {
        console.error(error);
        // Manejar errores del registro
        if (error.status === 400 && error.error && error.error.message) {
          Swal.fire('¡Uppps!', error.error.message, 'error');
        } else {
          Swal.fire('¡Uppps!', 'Ocurrió un error al registrar el usuario', 'error');
        }
        // Reiniciar campos
        this.numeroControl = '';
        this.nombre = '';
        this.apellido = '';
        this.email = '';
        this.telefono = '';
        this.password = '';
      }
    );   
  }

  validateNumberInput(event: KeyboardEvent) {
    // Código ASCII de 0 a 9, códigos de tecla para borrar (Backspace),
    // teclas de flecha izquierda (37) y derecha (39)
    const isNumberOrBackspaceOrArrowKey = 
      (event.keyCode >= 48 && event.keyCode <= 57) || // Números
      (event.keyCode >= 37 && event.keyCode <= 40) || // Flechas izquierda y derecha
      event.keyCode === 8; // Backspace
    
    if (!isNumberOrBackspaceOrArrowKey) {
      event.preventDefault();
    }
  }


}