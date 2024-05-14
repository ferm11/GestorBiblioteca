import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { SearchService, SearchService2 } from 'src/app/search.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = ''; // Término de búsqueda ingresado por el usuario
  searchOptions: any[] = []; // Opciones de búsqueda filtradas
  selectedOption: string = ''; // Opción seleccionada en el menú desplegable
  showOptions: boolean = true; // Indica si se deben mostrar las opciones de búsqueda

  constructor(private authService: AuthService, private searchService: SearchService2, private router: Router) { }

  ngOnInit(): void {
    // Lógica de inicialización del componente, si es necesaria
  }

  // Método para mostrar las opciones de búsqueda mientras el usuario escribe
  showSearchOptions(): void {
    if (this.searchTerm.length > 0) {
      this.searchOptions = this.searchService.filterItems(this.searchTerm);
    } else {
      this.searchOptions = [];
    }
  }

  // Método para seleccionar una opción de búsqueda y realizar la búsqueda
  selectOption(): void {
    this.searchTerm = this.selectedOption;
    this.search();
  }

  // Método para realizar la búsqueda y navegar a la página correspondiente
  search(): void {
    const results = this.searchService.filterItems(this.searchTerm);
    if (results.length > 0) {
      // Si se encuentran resultados, navega a la primera página correspondiente
      this.router.navigateByUrl(results[0].ruta);
    }
  }


}
