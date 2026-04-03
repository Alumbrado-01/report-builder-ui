import { AreaViewComponent } from '../area/infrestructure/input_adapters/area-view/area-view.component';
import { Routes } from '@angular/router';
import { DepotViewComponent } from '../depot/infrestructure/input_adapters/depot-view/depot-view.component';
import { MaterialViewComponent } from '../material/infrestructure/input_adapters/material-view/material-view.component';
import { UserViewComponent } from '../user/infrestructure/input_adapters/user-view/user-view.component';
import { BeginningViewComponent } from '../beginning/infrestructure/input_adapters/beginning-view/beginning-view.component';
import { ReportViewComponent } from '../pdfmake/infrestructure/input_adapters/pdfmake-view/report-view.component';
import { EntryViewComponent } from '../entry/infrestructure/input_adapters/entry-view/entry-view.component';
import { OutputViewComponent } from '../output/infrestructure/input_adapters/output-view/output-view.component';
import { LoginViewComponent } from '../login/infrestructure/input_adapters/login-view/login-view.component';
import {ApplicantViewComponent} from "../applicant/infrestructure/input_adapters/applicant-view/applicant-view.component";
import {authGuard} from "./Services/autenticationService/auth.guard";
import {
  MaintenanceViewComponent
} from "../maintenance/infrestructure/input_adapters/maintenance-view/maintenance-view.component";
import {RoadViewComponent} from "../road/infrestructure/input_adapters/road-view/road-view.component";

export const routes: Routes = [
  { path: '', component: LoginViewComponent },
  { path: 'inicio',
    component: BeginningViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  },
  { path: 'entrada',
    component: EntryViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  },
  { path: 'mantenimiento',
    component: MaintenanceViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  },
  { path: 'vialidad',
    component: RoadViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  },
  { path: 'salida',
    component: OutputViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador', 'Almacenista'] }
  },
  { path: 'area',
    component: AreaViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'almacen',
    component: DepotViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
  { path: 'material',
    component: MaterialViewComponent,
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
  },
  { path: 'solicitante',
    component: ApplicantViewComponent,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] }
  },
];
