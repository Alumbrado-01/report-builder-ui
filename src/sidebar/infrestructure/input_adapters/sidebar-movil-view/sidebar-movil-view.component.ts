import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../../application/sidebar.service';
import { Subscription } from 'rxjs';
import {User} from "../../../../user/domain/object/user";

@Component({
  selector: 'app-sidebar-movil-view',
  standalone: true,
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, CommonModule, ButtonModule],
  templateUrl: './sidebar-movil-view.component.html',
  styleUrl: './sidebar-movil-view.component.scss'
})
export class SidebarMovilViewComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [];
  isMenuVisible: boolean = true;
  private menuSub!: Subscription;
  public userData: User;

  constructor(
    private readonly sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.getUserFromLocalStorage();
    this.menuSub = this.sidebarService.menuVisible$.subscribe(
      visible => this.isMenuVisible = visible
    );
  }

  ngOnDestroy() {
    this.menuSub.unsubscribe();
  }

  closeMenu() {
  this.isMenuVisible = false;
}

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;

      this.items = [
        { label: 'Inicio', icon: 'pi pi-bullseye', routerLink: '/inicio', command: () => this.closeMenu() },
        { label: 'Atencción General', icon: 'pi pi-barcode', routerLink: '/mantenimiento', command: () => this.closeMenu() },
        { label: 'Vialidad', icon: 'pi pi-barcode', routerLink: '/vialidad', command: () => this.closeMenu() },
        { label: 'Actividades', icon: 'pi pi-barcode', routerLink: '/actividad', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Tipo de Mantenimiento', icon: 'pi pi-barcode', routerLink: '/tipo', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Programa', icon: 'pi pi-barcode', routerLink: '/programa', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Cuadrante/Zona', icon: 'pi pi-barcode', routerLink: '/zona', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Fuentes', icon: 'pi pi-barcode', routerLink: '/mantenimiento', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Pending' },
        { label: 'Iluminaciones Especiales', icon: 'pi pi-barcode', routerLink: '/mantenimiento', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Pending' },
        { label: 'Reporteria', icon: 'pi pi-book', routerLink: '/reporteria', command: () => this.closeMenu() },
        { label: 'Áreas', icon: 'pi pi-map', routerLink: '/area', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Usuarios', icon: 'pi pi-users', routerLink: '/usuarios', command: () => this.closeMenu(), visible: this.userData.profile.profile === 'Administrador' },
        { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', routerLink: '/', command: () => this.closeSession() },
      ];
    }
  }

  public closeSession() {
    if(sessionStorage.getItem('user')){
      sessionStorage.removeItem('user');
    }
  }
}
