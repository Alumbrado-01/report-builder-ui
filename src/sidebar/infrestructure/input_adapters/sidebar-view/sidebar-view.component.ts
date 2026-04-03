import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MenuModule} from "primeng/menu";
import {BadgeModule} from "primeng/badge";
import {RippleModule} from "primeng/ripple";
import {AvatarModule} from "primeng/avatar";
import {MenuItem} from "primeng/api";
import {User} from "../../../../user/domain/object/user";

@Component({
  selector: 'app-sidebar-view',
  standalone: true,
  imports: [
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    CommonModule
  ],
  templateUrl: './sidebar-view.component.html',
  styleUrls: ['./sidebar-view.component.scss'],
})
export class SidebarViewComponent implements OnInit {
  items: MenuItem[] = [];
  public userData: User | null = null;

  ngOnInit() {
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) {
        try {
          const jsonParsed = JSON.parse(sessionUser);
          this.userData = jsonParsed.user;

          this.items = [
            { label: 'Inicio', icon: 'pi pi-bullseye', routerLink: '/inicio' },
            {
              label: 'Atención General',
              icon: 'pi pi-chart-pie',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Vialidad',
              icon: 'pi pi-chevron-circle-right',
              routerLink: '/vialidad',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Actividades de Mantenimiento',
              icon: 'pi pi-chart-scatter',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Tipo de Mantenimiento',
              icon: 'pi pi-objects-column',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Programa',
              icon: 'pi pi-window-maximize',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Cuadrante/Zona',
              icon: 'pi pi-stop',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Alcaldia',
              icon: 'pi pi-building-columns',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Fuentes',
              icon: 'pi pi-crown',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Iluminaciones Especiales',
              icon: 'pi pi-expand',
              routerLink: '/mantenimiento',
              visible: this.userData.profile.profile === 'Administrador',
            },
            { label: 'Reporteria',
              icon: 'pi pi-book',
              routerLink: '/inventario'
            },
            {
              label: 'Áreas',
              icon: 'pi pi-map',
              routerLink: '/area',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Usuarios',
              icon: 'pi pi-users',
              routerLink: '/usuarios',
              visible: this.userData.profile.profile === 'Administrador',
            },
            {
              label: 'Cerrar Sesión',
              icon: 'pi pi-sign-out',
              routerLink: '/',
              command: () => this.closeSession(),
            },
          ];
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }

  public closeSession() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('user');
    }
  }
}
