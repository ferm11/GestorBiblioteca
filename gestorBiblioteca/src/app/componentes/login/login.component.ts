import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Declara la función grecaptcha como una variable global
declare const grecaptcha: any;
const provider = new firebase.auth.GoogleAuthProvider();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  numControl: string;
  contrasena: string;
  jwtToken: string;
  showModal: boolean = false; // Variable para controlar la visibilidad del modal
  errorMensaje: string = ''; // Variable para almacenar el mensaje de error

  @ViewChild('captchaElement') captchaElement;

  constructor(private usuariosService: UsuariosService, private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit() {}

  login(loginForm: NgForm) {
    loginForm.form.markAllAsTouched();
  
    console.log('Intentando iniciar sesión...');
  
    if (loginForm.invalid) {
      console.log('Formulario inválido.');
      return;
    }
  
    // Verificar si la casilla de verificación está marcada
    const captchaResponse = grecaptcha.getResponse();
    const captchaChecked = captchaResponse && captchaResponse.length !== 0;
  
    console.log('Respuesta de reCAPTCHA:', captchaResponse);
  
    if (!captchaChecked) {
      // Si la casilla de verificación no está marcada, muestra un mensaje de error
      console.log('Verificación humana incompleta.');
      this.errorMensaje = 'Por favor, completa la verificación humana';
      return;
    }
  
    console.log('Verificación humana completada.');
  
    // Continuar con el proceso de inicio de sesión si la verificación humana es exitosa
    this.usuariosService.login(this.numControl, this.contrasena).subscribe(
      (res: any) => {
        console.log('Respuesta del servicio de inicio de sesión:', res);
        // Manejar respuesta exitosa del inicio de sesión
        Swal.fire('¡Inicio de sesión exitoso!', 'Bienvenido de vuelta', 'success');
        // Almacena el token JWT en la variable del componente
        this.jwtToken = res.token;
        // Muestra el token JWT en la consola
        console.log('Token JWT:', this.jwtToken);
        // Configura la variable showModal para abrir el modal
        this.showModal = true;
        this.router.navigate(['/alta']);
      },
      (error: any) => {
        console.error('Error en el inicio de sesión:', error);
        // Manejar errores del inicio de sesión
        this.errorMensaje = 'El Numero de control o contraseña son incorrectos';
        this.resetForm();
      }
    );
  }
  

  validateNumberInput(event: KeyboardEvent) {
    const isNumberOrBackspaceOrArrowKey =
      (event.keyCode >= 48 && event.keyCode <= 57) || // Números
      (event.keyCode >= 37 && event.keyCode <= 40) || // Flechas izquierda y derecha
      event.keyCode === 8; // Backspace

    if (!isNumberOrBackspaceOrArrowKey) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.numControl = null;
    this.contrasena = '';
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      const userEmail = result.user.email; // Obtener el correo electrónico del usuario
  
      // Enviar el correo electrónico al servidor para verificar si está registrado
      this.usuariosService.checkEmail(userEmail).subscribe(
        (response) => {
          if (response && response.token) {
            // Almacena el token en el cliente
            const token = response.token;
            this.usuariosService.setToken(token);
            console.log('Token JWT recibido:', token);
  
            // Continuar con la navegación o cualquier acción adicional
            console.log('Usuario autenticado:', result.user);
            Swal.fire('¡Inicio de sesión exitoso!', 'Bienvenido de vuelta', 'success');
            this.router.navigate(['/alta']);
          } else {
            // Si el correo electrónico no está registrado o no se recibió el token, mostrar un mensaje de error
            Swal.fire('¡Uppps!', 'El correo electrónico no está registrado, intentalo nuevamente.', 'error');
          }
        },
        (error) => {
          console.error('Error al verificar el correo electrónico:', error);
          Swal.fire('¡Uppps!', 'El correo electrónico no está registrado, intentalo nuevamente.', 'error');
        }
      );
    } catch (error) {
      console.error('Error al autenticar con Google:', error);
      Swal.fire('¡Uppps!', 'No se pudo autenticar con ese correo electrónico, intentalo nuevamente.', 'error');
    }
  }
  

} 
