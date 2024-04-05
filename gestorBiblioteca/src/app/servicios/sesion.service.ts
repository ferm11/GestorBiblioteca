import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User; // Variable para almacenar el usuario autenticado

  constructor(private afAuth: AngularFireAuth) {
    // Observa el estado de autenticación para obtener el usuario actual
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  // Función para cerrar sesión
  logout() {
    return this.afAuth.signOut();
  }
}
