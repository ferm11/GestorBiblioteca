import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ejemplar } from '../modelos/Ejemplar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EjemplaresService {

  private API_URL = "https://gestorbiblioteca-n8uf.onrender.com/api"

  constructor(private http:HttpClient) { }

  getEjemplares(id: number) {
    return this.http.get(`https://gestorbiblioteca-n8uf.onrender.com/api/ejemplares/${id}`);
  }

  deleteEjemplar(id: number, isbn: number) {
    return this.http.delete(`https://gestorbiblioteca-n8uf.onrender.com/api/ejemplares/${id}/${isbn}`);
  }

  addEjemplar(ejemplar:Ejemplar) {
    return this.http.post(`https://gestorbiblioteca-n8uf.onrender.com/api/ejemplares/`, ejemplar);
  }

  buscarLibros(terminoBusqueda: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/libros/buscar?termino=${terminoBusqueda}`);
  }

  //Todos los ejemplares
  ejemplares(): Observable<any[]> {
    return this.http.get<any[]>('https://gestorbiblioteca-n8uf.onrender.com/api/ej');
  }
  

}
