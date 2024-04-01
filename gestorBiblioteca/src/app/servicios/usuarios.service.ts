import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  registro(usuario):Observable<any> {
    return this.http.post(`http://localhost:3000/api/registro`, usuario);
  }

  login(numControl: string, contraseña: string): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/login`, { numControl, contraseña });
  }

}
