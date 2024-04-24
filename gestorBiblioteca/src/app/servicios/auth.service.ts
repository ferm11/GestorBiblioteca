import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  sessionExpired: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  private userData = new Subject<any>(); // Almacena los datos del usuario
  private tokenKey = 'jwtToken'; // Clave para el token en localStorage
  private isLoggedInSubject = new Subject<boolean>(); // Almacena el estado de inicio de sesión
  private expirationTimeSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  private loggedIn = false;
  isLoggedIn: boolean = true;

  private API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient, private router:Router) { 
    // Verifica si hay un token almacenado en el localStorage al iniciar el servicio
    this.loggedIn = !!localStorage.getItem('token');
  }

  // Método para establecer el estado de inicio de sesión
  setLoggedIn(value: boolean) {
    console.log('Estado de inicio de sesión:', value);
    this.isLoggedInSubject.next(value);
  }

  // Método para obtener el estado de inicio de sesión
  getLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  // Método para establecer los datos del usuario
  setUserData(userData: any) {
    console.log('Datos del usuario recibidos en AuthService:', userData);
    this.userData.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData)); // Guardar los datos del usuario en el localStorage
    console.log('Datos del usuario guardados en localStorage:', userData);
  }  

  // Método para obtener los datos del usuario desde el localStorage
  getUserDataFromLocalStorage() {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  // Método para obtener los datos del usuario
  getUserData() {
    return this.userData.asObservable();
  }

  // Método para guardar el token en localStorage
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para obtener el token desde localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para eliminar el token de localStorage
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión');

    // Eliminar el token
    localStorage.removeItem('token');

    // Eliminar los datos del usuario
    localStorage.removeItem('userData');

    // Limpiar la consola
    console.clear();

    // Ocultar el botón
    this.isLoggedIn = false;

    // Mostrar mensaje de confirmación con SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'La sesión se ha cerrado correctamente.',
      confirmButtonText: 'Aceptar'
    });

    // Redirigir a la página de inicio
    this.router.navigate(['/inicio']);
  }

  // Método para establecer la fecha de expiración del token
  setExpirationTime(expirationTime: Date): void {
    this.expirationTimeSubject.next(expirationTime);
  }

  // Método para obtener el observable de la fecha de expiración del token
  getExpirationTime(): Observable<Date> {
    return this.expirationTimeSubject.asObservable();
  }

}