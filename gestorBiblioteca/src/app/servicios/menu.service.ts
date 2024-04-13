import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService{

  isLoggedIn: boolean = false;

  showNavbar : BehaviorSubject<boolean>;

  constructor() { 
    this.showNavbar = new BehaviorSubject(true);
  }

  hide(){
    this.showNavbar.next(false);
  }

  display(){
    this.showNavbar.next(true);
  }


}
