import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { UserWebServiceImplements } from '../../output_adapters/userWebServiceImplement';
import { IUserService } from '../../input_ports/IUserService';
import { User } from '../../../domain/object/user';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UserRequest } from '../../../domain/api/userRequest';
import { Depot } from '../../../../depot/domain/object/depot';
import { Profile } from '../../../../user_profile/domain/object/profile';
import { profileService } from '../../../../user_profile/application/profile.service';
import { Area } from '../../../../area/domain/object/area';
import { DepotService } from '../../../../depot/application/depot.service';
import { AreaService } from '../../../../area/application/area.service';
import Swal from "sweetalert2";
import {MultiSelectModule} from "primeng/multiselect";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";

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
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
  providers: [{ provide: IUserService, useClass: UserWebServiceImplements }],
})
export class UserViewComponent implements OnInit {
  private readonly svc = inject(IUserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  depots: Depot[] = [];
  selectedDepots: Depot[];
  areas: Area[] = [];
  selectedArea: Area | null = null;
  profiles: Profile[] = [];
  selectedProfile: Profile | null = null;
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'user';

  @ViewChild('dt') public dt: any;

  private readonly depotService = inject(DepotService);
  private readonly areaService = inject(AreaService);
  private readonly profileService = inject(profileService);

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
    this.loadDepots();
    this.loadAreas();
    this.loadProfiles();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  private loadProfiles(): void {
    this.profileService.findAll().subscribe({
      next: (data) => {
        this.profiles = data;
      },
      error: (err) => {
        console.error('Error cargando perfiles:', err);
      },
    });
  }

  private loadAreas(): void {
    this.areaService.findAll().subscribe({
      next: (data) => {
        this.areas = data.find(area => area.active) ? data.filter(area => area.active) : data;
      },
      error: (err) => {
        console.error('Error cargando áreas:', err);
      },
    });
  }

  private loadDepots(): void {
    this.depotService.findAll().subscribe({
      next: (data) => {
        this.depots = data.find(depot => depot.active) ? data.filter(depot => depot.active) : data;
      },
      error: (err) => {
        console.error('Error cargando almacenes:', err);
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
    this.dialogTitle = 'Crear Nuevo Usuario';
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
