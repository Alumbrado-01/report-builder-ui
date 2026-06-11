import { AreaViewComponent } from '../area/infrestructure/input_adapters/area-view/area-view.component';
import { Routes } from '@angular/router';
import { UserViewComponent } from '../user/infrestructure/input_adapters/user-view/user-view.component';
import { BeginningViewComponent } from '../beginning/infrestructure/input_adapters/beginning-view/beginning-view.component';
import { ReportViewComponent } from '../pdfmake/infrestructure/input_adapters/pdfmake-view/report-view.component';
import { LoginViewComponent } from '../login/infrestructure/input_adapters/login-view/login-view.component';
import {authGuard} from "./Services/autenticationService/auth.guard";
import {
  MaintenanceViewComponent
} from "../maintenance/infrestructure/input_adapters/maintenance-view/maintenance-view.component";
import {RoadViewComponent} from "../road/infrestructure/input_adapters/road-view/road-view.component";
import {ActivityViewComponent} from "../activity/infrestructure/input_adapters/activity-view/activity-view.component";
import {TypeViewComponent} from "../type/infrestructure/input_adapters/type-view/type-view.component";
import {ProgramViewComponent} from "../program/infrestructure/input_adapters/program-view/program-view.component";

export const routes: Routes = [
  { path: '', component: LoginViewComponent },
  { path: 'inicio',
    component: BeginningViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Operador'] }
  },
  { path: 'mantenimiento',
    component: MaintenanceViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Operador'] }
  },
  { path: 'vialidad',
    component: RoadViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Operador'] }
  },
  { path: 'actividad',
    component: ActivityViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'area',
    component: AreaViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'tipo',
    component: TypeViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'programa',
    component: ProgramViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'usuarios',
    component: UserViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'inventario',
    component: ReportViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  }
];
