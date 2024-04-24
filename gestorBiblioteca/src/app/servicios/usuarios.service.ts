import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private tokenSubject = new BehaviorSubject<string | null>(null);

  private API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) { 
    // Obtener el token almacenado localmente si existe
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  registro(usuario):Observable<any> {
    return this.http.post(`http://localhost:3000/api/registro`, usuario);
  }

  login(numControl: string, contraseña: string): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/login`, { numControl, contraseña });
  }

  // Método para verificar si el correo electrónico está registrado
  checkEmail(email: string) {
    return this.http.post<any>('http://localhost:3000/api/check-email', { email });
  }

  get token() {
    return this.tokenSubject.asObservable();
  }

  // Almacena el token en el cliente
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  // Borra el token del cliente
  clearToken() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  obtenerUsuarios() {
    return this.http.get('http://localhost:3000/api/usuarios'); // Realiza una solicitud GET al servidor para obtener los datos de los usuarios
  }

}