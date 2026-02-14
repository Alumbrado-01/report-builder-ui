import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly menuVisible = new BehaviorSubject<boolean>(false);

  menuVisible$ = this.menuVisible.asObservable();

  toggleMenu() {
    this.menuVisible.next(!this.menuVisible.value);
  }
}
