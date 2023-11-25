import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ejemplar } from '../modelos/Ejemplar';

@Injectable({
  providedIn: 'root'
})
export class EjemplaresService {

  constructor(private http:HttpClient) { }

  getEjemplares(id: number) {
    return this.http.get(`http://localhost:3000/api/ejemplares/${id}`);
  }

  deleteEjemplar(id: number, isbn: number) {
    return this.http.delete(`http://localhost:3000/api/ejemplares/${id}/${isbn}`);
  }

  addEjemplar(ejemplar:Ejemplar) {
    return this.http.post(`http://localhost:3000/api/ejemplares/`, ejemplar);
  }

}
