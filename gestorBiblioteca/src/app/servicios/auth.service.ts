import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new Subject<boolean>();
  private userData = new Subject<any>(); // Almacena los datos del usuario

  constructor() { }

  setLoggedIn(value: boolean) {
    console.log('Estado de inicio de sesión:', value);
    this.isLoggedIn.next(value);
  }
  

  // Método para obtener el estado de autenticación
  getLoggedIn() {
    return this.isLoggedIn.asObservable();
  }

  setUserData(userData: any) {
    console.log('Datos del usuario recibidos en AuthService:', userData);
    this.userData.next(userData);
  }
  
  // Método para obtener los datos del usuario
  getUserData() {
    return this.userData.asObservable();
  }
}
