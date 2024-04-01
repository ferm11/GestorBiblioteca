import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  numControl: string;
  contrasena: string;
  jwtToken: string;

  constructor(private modalService: NgbModal, private usuariosService: UsuariosService) {}

  ngOnInit() {}

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  close() {
    this.modalService.dismissAll();
  }

  login(loginForm: NgForm, content) {
    loginForm.form.markAllAsTouched();

    if (loginForm.invalid) {
      return;
    }

    // Abre el modal de reCAPTCHA
    this.open(content);
  }

  submitForm(loginForm: NgForm, content) {
    // Cierra el modal de reCAPTCHA
    this.close();

    // Luego, procede con el inicio de sesión como antes
    this.usuariosService.login(this.numControl, this.contrasena).subscribe(
      (res: any) => {
        // Manejar respuesta exitosa del inicio de sesión
        Swal.fire('¡Inicio de sesión exitoso!', 'Bienvenido de vuelta', 'success');

        // Almacena el token JWT en la variable del componente
        this.jwtToken = res.token;

        // Muestra el token JWT en la consola
        console.log('Token JWT:', this.jwtToken);
      },
      (error: any) => {
        console.error(error);
        // Manejar errores del inicio de sesión
        Swal.fire('¡Error!', 'El Numero de control o contraseña son incorrectos', 'error');
        this.resetForm(loginForm);
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

  resetForm(loginForm: NgForm) {
    this.numControl = null;
    this.contrasena = '';
    loginForm.resetForm();
  }
}
