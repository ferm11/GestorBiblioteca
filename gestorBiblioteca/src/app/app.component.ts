// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router){}

  title = 'gestorBiblioteca';

  isHomePageOrErrorPage(): boolean {
    console.log("Current URL:", this.router.url);
    return this.router.url === '/' || this.router.url === '/error';
  }
  
}

