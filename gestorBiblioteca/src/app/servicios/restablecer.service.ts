import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestablecerService {

  private API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    console.log('Enviando código de verificación para:', email);
    return this.http.post<any>('http://localhost:3000/api/forgot-password', { email })
      .pipe(
        catchError(error => {
          console.error('Error al enviar el correo:', error);
          return of(null);
        })
      );
  }

  restablecerContrasena(contrasena: string, idUsuario: string): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/api/restablecer-contrasena/${idUsuario}`, { contrasena });
}



  verifyCode(email: string, code: string): Observable<any> {
    console.log('Verificando código para:', email);
    return this.http.post<any>(`${this.API_URL}/verify-code`, { email, code })
      .pipe(
        catchError(error => {
          console.error('Error al verificar el código:', error);
          console.log('Respuesta completa del servidor:', error.error); // Imprimir la respuesta completa del servidor
          throw error;
        })
      );
  }
  

}