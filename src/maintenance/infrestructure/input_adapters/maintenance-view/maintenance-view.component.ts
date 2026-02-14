import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Depot } from '../../../../depot/domain/object/depot';
import { Profile } from '../../../../user_profile/domain/object/profile';
import { Area } from '../../../../area/domain/object/area';
import { DepotService } from '../../../../depot/application/depot.service';;
import Swal from "sweetalert2";
import {MultiSelectModule} from "primeng/multiselect";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {IUserService} from "../../../../user/infrestructure/input_ports/IUserService";
import {UserWebServiceImplements} from "../../../../user/infrestructure/output_adapters/userWebServiceImplement";
import {User} from "../../../../user/domain/object/user";
import {UserRequest} from "../../../../user/domain/api/userRequest";
import {RoadService} from "../../../../road/application/road.service";
import {Road} from "../../../../road/domain/object/road";
import {ActivityService} from "../../../../activity/application/activity.service";
import {Activity} from "../../../../activity/domain/object/activity";
import {MayoraltyService} from "../../../../mayoralty/application/mayoralty.service";
import {Mayoralty} from "../../../../mayoralty/domain/object/mayoralty";
import {ZoneService} from "../../../../zone/application/zone.service";
import {Zone} from "../../../../zone/domain/object/zone";
import {TypeService} from "../../../../type/application/type.service";
import {Type} from "../../../../type/domain/object/type";

@Component({
  selector: 'app-maintenance-view',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    MultiSelectModule,
    LogViewComponent,
  ],
  templateUrl: './maintenance-view.component.html',
  styleUrl: './maintenance-view.component.scss',
  providers: [{ provide: IUserService, useClass: UserWebServiceImplements }],
})
export class MaintenanceViewComponent implements OnInit {
  private readonly svc = inject(IUserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  selectedDepots: Depot[];
  activities: Activity[] = [];
  mayoraltyList: Mayoralty[] = [];
  zones: Zone[] = [];
  selectedArea: Area | null = null;
  roads: Road[] = [];
  types: Type[] = [];
  selectedProfile: Profile | null = null;
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'user';

  @ViewChild('dt') public dt: any;

  private readonly activitiesService = inject(ActivityService);
  private readonly roadService = inject(RoadService);
  private readonly mayoraltyService = inject(MayoraltyService);
  private readonly zoneService = inject(ZoneService);
  private readonly typeService = inject(TypeService);

  visible: boolean = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  public userData: User;

  editingUser: User = {
    idUser: 0,
    mail: '',
    name: '',
    profile: null,
    password: '',
    depotList: null,
    area: null,
    active: true,
  };

  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.load();
    this.loadActivities();
    this.loadRoads();
    this.loadMayoralty();
    this.loadZones();
    this.loadTypes();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  private loadRoads(): void {
    this.roadService.findAll().subscribe({
      next: (data) => {
        this.roads = data;
      },
      error: (err) => {
        console.error('Error cargando vialidades:', err);
      },
    });
  }

  private loadActivities(): void {
    this.activitiesService.findAll().subscribe({
      next: (data) => {
        this.activities = data.find(activity => activity.active) ? data.filter(activity => activity.active) : data;
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
      },
    });
  }

  private loadMayoralty(): void {
    this.mayoraltyService.findAll().subscribe({
      next: (data) => {
        this.mayoraltyList = data.find(mayoralty => mayoralty.active) ? data.filter(mayoralty => mayoralty.active) : data;
      },
      error: (err) => {
        console.error('Error cargando alcaldias:', err);
      },
    });
  }

  private loadZones(): void {
    this.zoneService.findAll().subscribe({
      next: (data) => {
        this.zones = data.find(zone => zone.active) ? data.filter(zone => zone.active) : data;
      },
      error: (err) => {
        console.error('Error cargando zonas:', err);
      },
    });
  }

  private loadTypes(): void {
    this.typeService.findAll().subscribe({
      next: (data) => {
        this.types = data.find(type => type.active) ? data.filter(type => type.active) : data;
      },
      error: (err) => {
        console.error('Error cargando tipos:', err);
      },
    });
  }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loading = false;
      },
    });
  }

  createUser() {
    this.dialogMode = 'create';
    this.dialogTitle = 'Registro de Atención de Mantenimiento Diario';
    this.editingUser = {
      idUser: 0,
      mail: '',
      name: '',
      password: '',
      profile: null,
      depotList: null,
      area: null,
      active: true,
    };
    this.selectedDepots = null;
    this.selectedArea = null;
    this.selectedProfile = null;
    this.visible = true;
  }

  showDialog(user: User) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Usuario';
    this.editingUser = { ...user };
    this.selectedDepots = user.depotList ?? null;
    this.selectedArea = user.area ?? null;
    this.selectedProfile = user.profile ?? null;
    this.visible = true;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public verifyUserExists(): boolean {
    return this.users.some(user =>
      user.mail?.toLowerCase().trim() === this.editingUser.mail?.toLowerCase().trim() &&
      user.idUser !== this.editingUser.idUser
    );
  }

  saveUser() {
    const userExists = this.verifyUserExists();
    if (userExists) {
      this.visible = false;
      Swal.fire({
        title: `El usuario "${this.editingUser.mail}" ya existe`,
        icon: "warning",
        draggable: true
      });
      return;
    }
    if (this.dialogMode === 'create') {
      Swal.fire({
        title: "Registro agregado",
        icon: "success",
        draggable: true
      });
    } else {
      Swal.fire({
        title: "Registro actualizado",
        icon: "success",
        draggable: true
      });
    }
    if (
      this.editingUser &&
      this.selectedDepots &&
      this.selectedArea &&
      this.selectedProfile
    ) {

      this.editingUser.depotList = this.selectedDepots;
      this.editingUser.area = this.selectedArea;
      this.editingUser.profile = this.selectedProfile;

      const baseModel: any = {
        name: this.editingUser.name,
        mail: this.editingUser.mail,
        password: this.editingUser.password,
        profile: { idProfile: this.selectedProfile.idProfile },
        depotList: this.selectedDepots,
        area: { idArea: this.selectedArea.idArea },
        active: this.editingUser.active,
      };
      if (this.dialogMode === 'edit') {
        baseModel.idUser = this.editingUser.idUser;
      }
      const requestData: UserRequest = {
        modelRequest: baseModel,
        user: this.userData,
      };

      const action =
        this.dialogMode === 'create'
          ? this.svc.create(requestData)
          : this.svc.update(requestData);

      action.subscribe({
        next: () => {
          this.visible = false;
          this.load();
        },
        error: (err) => {
          console.error(
            `Error ${
              this.dialogMode === 'create' ? 'creando' : 'actualizando'
            } usuario:`,
            err
          );
        },
      });
    }
  }

  public viewLogs(id: number): void {
    this.entity = id;
    this.showLogs = true;
  }

  handleClose(event: any) {
    this.showLogs = false;
  }

}
