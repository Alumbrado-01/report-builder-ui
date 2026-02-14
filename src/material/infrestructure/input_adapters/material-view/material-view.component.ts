import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {IMaterialService} from '../../input_ports/IMaterialService';
import {Material} from '../../../domain/object/material';
import {MaterialRequest} from '../../../domain/api/materialRequest';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {Unit} from '../../../../unit/domain/object/unit';
import {unitService} from '../../../../unit/application/unit.service';
import {Depot} from '../../../../depot/domain/object/depot';
import {DepotService} from '../../../../depot/application/depot.service';
import {InputNumberModule} from 'primeng/inputnumber';
import {MultiSelectModule} from "primeng/multiselect";
import Swal from "sweetalert2";
import {User} from "../../../../user/domain/object/user";
import {LogViewComponent} from "../../../../log/infrestructure/input_adapters/log-view/log-view.component";
import {EntryService} from "../../../../entry/application/entry.service";
import {Entry} from "../../../../entry/domain/object/entry";

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    InputNumberModule,
    MultiSelectModule,
    LogViewComponent,
  ],
  templateUrl: './material-view.component.html',
  styleUrls: ['./material-view.component.scss'],
})
export class MaterialViewComponent implements OnInit {
  private readonly svc = inject(IMaterialService);
  private readonly depotMaterialService = inject(EntryService);
  private readonly unitSvc = inject(unitService);
  private readonly depotSvc = inject(DepotService);

  filteredMaterials: Material[] = [];
  materials: Material[] = [];
  material: Material= {};
  loading = false;
  depots: Depot[] = [];
  units: Unit[] = [];
  visible: boolean = false;
  errorMsg: string = '';
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle: string = '';
  @ViewChild('dt') public dt: any;
  public showLogs: boolean = false;
  public entity: number;
  public table: string = 'material';
  public userData: User;
  public materialDepotStock: Entry[];
  public showStock: boolean = false;
  public stockTitle: string = "";

  ngOnInit(): void {
    this.getUserFromLocalStorage();
    this.getMaterials();
    this.loadUnits();
    this.loadDepots();
  }

  getUserFromLocalStorage() {
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    if(jsonParsed){
      this.userData = jsonParsed.user;
    }
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  private getMaterials(): void {
    this.loading = true;
    this.svc.findAll().subscribe({
      next: (data) => {
        this.materials = data;
        this.filteredMaterials = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando materiales', err);
        this.loading = false;
      },
    });
  }

  private loadUnits(): void {
    this.unitSvc.findAll().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (err) => {
        console.error('Error cargando unidades', err);
      },
    });
  }

  private loadDepots(): void {
    this.depotSvc.findAll().subscribe({
      next: (depots) => {
        this.depots = depots.find(depot => depot.active) ? depots.filter(depot => depot.active) : depots;
      },
      error: (err) => {
        console.error('Error cargando depósitos', err);
      },
    });
  }

  showDialog(material: Material) {
    this.dialogMode = 'edit';
    this.dialogTitle = 'Editar Maintenance';
    this.material = {...material};
    this.visible = true;
  }

  public verifyMaterialExists(): boolean {
    if(this.materials) {
      return this.materials.some(mat =>
        mat.description?.toLowerCase().trim() === this.material.description?.toLowerCase().trim() &&
        mat.idMaterial !== this.material.idMaterial
      );
    }
    return false;
  }

  public saveMaterial() {
    const materialExists = this.verifyMaterialExists();
    if (this.material && this.material?.unit
      && this.material?.description && !materialExists) {
      const requestData: MaterialRequest = {
        modelRequest: {
          serialNumber: this.material.serialNumber,
          description: this.material.description,
          unit: this.material.unit,
          active: true,
          depotList: this.material.depotList,
        },
        user: this.userData,
      };
      if (this.material.idMaterial) {
        requestData.modelRequest.idMaterial = this.material.idMaterial;
      }
      const action =
        this.dialogMode === 'create'
          ? this.svc.create(requestData)
          : this.svc.update(requestData);
      action.subscribe({
        next: () => {
          Swal.fire({
            title: this.dialogMode === 'create'? "Maintenance " + this.material.description + " añadido" : "Maintenance " + this.material.description + " modificado",
            icon: "success",
            draggable: true
          });
          this.visible = false;
          this.getMaterials();
        },
        error: (err) => {
          this.errorMsg =
            'No se pudo guardar el material. Verifica los datos o intenta más tarde.';
          console.error(
            `Error ${
              this.dialogMode === 'create' ? 'creando' : 'actualizando'
            } material:`,
            err
          );
        },
      });
    } else if (materialExists){
      this.visible = false;
      Swal.fire({
        title: "Maintenance " + this.material.description + " ya existe",
        icon: "warning",
        draggable: true
      });
    }
  }

  createMaterial() {
    this.dialogTitle = 'Crear Nuevo Maintenance';
    this.dialogMode = 'create';
    this.material = {};
    this.errorMsg = '';
    this.visible = true;
  }

  public viewLogs(id: number): void {
    this.entity = id;
    this.showLogs = true;
  }

  handleClose(event: any) {
    this.showLogs = false;
  }

  public getStock(material: Material) {
    this.loading = true;
    this.depotMaterialService.findByMaterialId(material.idMaterial).subscribe({
      next: (data) => {
        this.materialDepotStock = data;
        this.loading = false;
        this.stockTitle = "Stock: " + material.description;
        this.showStock = true;
      },
      error: (err) => {
        console.error('Error cargando stock', err);
        this.loading = false;
      },
    });
  }
}
