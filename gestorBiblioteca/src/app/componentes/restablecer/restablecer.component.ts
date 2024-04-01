import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestablecerService } from 'src/app/servicios/restablecer.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css']
})
export class RestablecerComponent implements OnInit{
  
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
  verificationCodeSent: boolean = false;
  codeVerified: boolean = false;
  errorMessage: string;
  error: string = '';
  nuevaContrasena: string;
  mensaje: string;
  idUsuario: string; // Definimos la propiedad usuarioId
  showResetForm: boolean = false; // Variable para mostrar el formulario de restablecimiento

  constructor(private http: HttpClient, private restablecerService : RestablecerService) {}

  ngOnInit(): void {
  }

  // Dentro del método sendVerificationCode()
sendVerificationCode() {
  this.restablecerService.sendVerificationCode(this.email).subscribe(
    response => {
      console.log('Correo enviado correctamente:', response);
      this.verificationCodeSent = true;
    },
    error => {
      console.error('Error al enviar el correo:', error);
      this.error = 'Error al enviar el correo. Por favor, inténtalo de nuevo.';
    }
  );
}

restablecerContrasena(): void {
  console.log('ID de usuario:', this.idUsuario); // Agregar este console.log()
  if (this.idUsuario !== undefined && this.idUsuario !== null) {
    this.restablecerService.restablecerContrasena(this.nuevaContrasena, this.idUsuario)
      .subscribe(
        response => {
          console.log(response);
          this.mensaje = 'Contraseña actualizada correctamente';
        },
        error => {
          console.error(error);
          this.mensaje = 'Error al actualizar la contraseña';
        }
      );
  } else {
    console.error('ID de usuario no definido');
    this.mensaje = 'Error al actualizar la contraseña: ID de usuario no definido';
  }
}





  verifyCode() {
    this.restablecerService.verifyCode(this.email, this.code).subscribe(
      response => {
        console.log('Código verificado correctamente:', response);
        this.showResetForm = true; // Mostrar el formulario de restablecimiento
      },
      error => {
        console.error('Error al verificar el código:', error);
        if (error.status === 400) {
          this.error = 'El código de verificación es inválido. Por favor, verifica e intenta nuevamente.';
        } else {
          this.error = 'Ocurrió un error al verificar el código. Por favor, intenta nuevamente más tarde.';
        }
      }
    );
  }

}
