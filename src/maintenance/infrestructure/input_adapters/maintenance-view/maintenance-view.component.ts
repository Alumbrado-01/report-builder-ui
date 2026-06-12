import {Component, OnInit, inject, ViewChild} from '@angular/core';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import Swal from "sweetalert2";
import {MultiSelectModule} from "primeng/multiselect";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {IUserService} from "../../../../user/infrestructure/input_ports/IUserService";
import {UserWebServiceImplements} from "../../../../user/infrestructure/output_adapters/userWebServiceImplement";
import {User} from "../../../../user/domain/object/user";
import {RoadService} from "../../../../road/application/road.service";
import {Road} from "../../../../road/domain/object/road";
import {ActivityService} from "../../../../activity/application/activity.service";
import {Activity} from "../../../../activity/domain/object/activity";
import {MayoraltyService} from "../../../../mayoralty/application/mayoralty.service";
import {Mayoralty} from "../../../../mayoralty/domain/object/mayoralty";
import {ZoneService} from "../../../../zone/application/zone.service";
import {Zone} from "../../../../zone/domain/object/zone";
import {TypeService} from "../../../../type/application/type.service";
import {Maintenance} from "../../../domain/object/maintenance";
import {MaintenanceService} from "../../../application/maintenance.service";
import {RadioButtonModule} from 'primeng/radiobutton';
import {ProgramService} from "../../../../program/application/program.service";
import {Program} from "../../../../program/domain/object/program";
import {InputNumberModule} from 'primeng/inputnumber';
import {MaintenanceRequest} from "../../../domain/api/maintenanceRequest";
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
    RadioButtonModule,
    InputNumberModule
  ],
  templateUrl: './maintenance-view.component.html',
  styleUrl: './maintenance-view.component.scss',
  providers: [{provide: IUserService, useClass: UserWebServiceImplements}],
})
export class MaintenanceViewComponent implements OnInit {

  public maintenanceList: Maintenance[] = [];
  public loading = false;
  public activities: Activity[] = [];
  public mayoraltyList: Mayoralty[] = [];
  public zones: Zone[] = [];
  public roads: Road[] = [];
  public types: Type[] = [];
  public programs: Program[] = [];
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'maintenance';
  public maintenance: Maintenance = {};
  public dialogMode: 'create' | 'edit' = 'create';

  @ViewChild('dt') public dt: any;

  private readonly activitiesService = inject(ActivityService);
  private readonly roadService = inject(RoadService);
  private readonly mayoraltyService = inject(MayoraltyService);
  private readonly zoneService = inject(ZoneService);
  private readonly typeService = inject(TypeService);
  private readonly programService = inject(ProgramService);
  private readonly maintenanceService = inject(MaintenanceService);

  visible: boolean = false;
  dialogTitle: string = '';
  public userData: User;
  public load: boolean = false;
  public radioValue: boolean = true;


  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.getRoadsByType(true);
    this.loadActivities();
    this.loadMayoralty();
    this.loadPrograms();
    this.loadZones();
    this.loadTypes();
  }

  getUserFromLocalStorage() {
    const sessionUser = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if (jsonParsed) {
      this.userData = jsonParsed.user;
      if (this.userData.profile.profile === 'Administrador') {
        this.loadMaintenanceList();
      } else {
        this.loadMaintenanceListByUser();
      }
    }
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

  private loadPrograms(): void {
    this.programService.findAll().subscribe({
      next: (data) => {
        this.programs = data.find(program => program.active) ? data.filter(program => program.active) : data;
      },
      error: (err) => {
        console.error('Error cargando programas:', err);
      },
    });
  }

  private loadMaintenanceList(): void {
    this.loading = true;
    this.maintenanceService.findAll().subscribe({
      next: (data) => {
        this.maintenanceList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando registro de mantenimiento:', err);
        this.loading = false;
      },
    });
  }

  private loadMaintenanceListByUser(): void {
    this.loading = true;
    this.maintenanceService.findByUser(this.userData).subscribe({
      next: (data) => {
        this.maintenanceList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando registro de mantenimiento:', err);
        this.loading = false;
      },
    });
  }

  createMaintenance() {
    this.dialogTitle = 'Registro de Atención de Mantenimiento Diario';
    this.maintenance = {}
    this.visible = true;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public saveMaintenance() {
    if (this.userData && this.radioValue && this.maintenance && this.validateCoordinates()) {
      const maintenance: Maintenance = {
        date: new Date(),
        user: this.userData,
        road: this.maintenance.road,
        activity: this.maintenance.activity,
        mayoralty: this.maintenance.mayoralty,
        zone: this.maintenance.zone,
        program: this.maintenance.program,
        coordinateY: this.maintenance.coordinateY,
        coordinateX: this.maintenance.coordinateX,
        streetlights: this.maintenance.streetlights,
        pedestrianLighting: this.maintenance.pedestrianLighting,
        luminariesInService: this.maintenance.luminariesInService,
        type: this.maintenance.type
      }
      const request: MaintenanceRequest = {
        modelRequest: maintenance,
        user: this.userData
      }
      this.maintenanceService.create(request).subscribe({
        next: (data) => {
          Swal.fire('¡Éxito!', 'Se guardo el registro.', 'success');
          if (this.userData.profile.profile === 'Administrador') {
            this.loadMaintenanceList();
          } else {
            this.loadMaintenanceListByUser();
          }
          this.visible = false;
        },
        error: (err) => {
          console.error('Error creando registro de mantenimiento:', err);
          Swal.fire('Error', 'Ocurrió un error al crear el registro de mantenimiento.', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos y asegúrese de que las coordenadas sean válidas.', 'error');
    }
  }

  public viewLogs(id: number): void {
    this.entity = id;
    this.showLogs = true;
  }

  handleClose(event: any) {
    this.showLogs = false;
  }

  public getRoadsByType(type: boolean) {
    if (type != null) {
      this.load = true;
      this.maintenance = {};
      this.roads = [];
      console.log(type);
      this.roadService.getRoadsByType(type.toString()).subscribe({
        next: (data) => {
          this.roads = data;
          this.load = false;
        },
        error: (err) => {
          console.error('Error cargando vialidades:', err);
          this.load = false;
        },
      });
    }
  }

  showMayoralty() {
    if (this.maintenance?.road) {
      this.maintenance.mayoralty = this.maintenance?.road.mayoralty
    }
  }

  showDialog(maintenance: Maintenance) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Mantenimiento';
    this.maintenance = { ...maintenance };
    this.visible = true;
  }

  validateCoordinates() {
    const coordinateX = this.maintenance.coordinateX;
    const coordinateY = this.maintenance.coordinateY;

    if (coordinateX && coordinateY) {
      const isValidCoordinateX = /^-?\d+(\.\d+)?$/.test(coordinateX);
      const isValidCoordinateY = /^-?\d+(\.\d+)?$/.test(coordinateY);

      if (!isValidCoordinateX || !isValidCoordinateY) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

}
