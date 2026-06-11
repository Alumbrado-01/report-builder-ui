import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {Depot} from "../../../../depot/domain/object/depot";
import {EntryService} from "../../../application/entry.service";
import {Entry} from "../../../domain/object/entry";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {NgIf} from "@angular/common";
import {EntryMaterial} from "../../../domain/object/entryMaterial";
import Swal from "sweetalert2";
import {ConfirmedEntry} from "../../../domain/object/confirmedEntry";
import {User} from "../../../../user/domain/object/user";
import {EntryRequest} from "../../../domain/api/entryRequest";
import {PdfService} from "../../../application/pdf.service";
import {ApplicantService} from "../../../../applicant/application/applicant.service";
import {Applicant} from "../../../../applicant/domain/object/applicant";
import writtenNumber from "written-number";
import {UserService} from "../../../../user/application/user.service";

@Component({
  selector: 'app-entry-view',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    Button,
    TableModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    NgIf
  ],
  templateUrl: './entry-view.component.html',
  styleUrl: './entry-view.component.scss'
})
export class EntryViewComponent implements OnInit {

  private readonly entryService = inject(EntryService);
  private readonly applicantService = inject(ApplicantService);
  private readonly userService = inject(UserService);
  public depots: Depot[] = [];
  public materials: Entry[] = [];
  public materialsSelected: EntryMaterial[] = [];
  public selectedDepot: Depot;
  public loading: boolean = false
  public entryDialog: boolean = false;
  public dialogHeder= "Añadir Maintenance"
  public materialSelected: EntryMaterial = {}
  public quantityRequired: number = 1;
  @ViewChild('dt') public dt: any;
  @ViewChild('st') public st: any;
  public voucherDialog = false;
  public confirmedEntry: ConfirmedEntry = {};
  public applicants: Applicant[] = [];
  public userData: User;

  constructor(
    public pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.getUserBySession();
  }

  private getUsers(): void {
    this.loading = true;
    this.applicantService.findAll().subscribe({
      next: (data) => {
        this.applicants = data.find(applicant => applicant.active) ? data.filter(applicant => applicant.active) : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando solicitantes', err);
        this.loading = false;
      },
    });
  }


  applyFilterGlobalTableOne($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyFilterGlobalTableTwo($event: any, stringVal: any) {
    this.st!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  private getUserBySession(): void {
    this.loading = true;
    const sessionUser  = sessionStorage.getItem('user');
    const jsonParsed = JSON.parse(sessionUser);
    this.userService.findById(jsonParsed.user.idUser).subscribe({
      next: (data) => {
        if(data) {
          this.userData = data;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando solicitantes', err);
        this.loading = false;
      },
    });
  }

  public getMaterialByDepot(){
    if(this.selectedDepot){
      this.loading = true;
      this.materialsSelected = [];
      this.entryService.findByDepotId(this.selectedDepot.idDepot).subscribe({
        next: (data) => {
          this.materials = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando materiales', err);
          this.loading = false;
        },
      });
    } else {
      this.cancelEntryByDepotChange()
    }
  }

  public cancelEntry(){
    if(this.materialsSelected && this.materialsSelected.length > 0){
      Swal.fire({
        title: "¿Estas seguro que deseas cancelar el vale?",
        text: "Esta acción eliminara todo lo seleccionado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelEntryByDepotChange();
          Swal.fire({
            title: "Cancelado",
            text: "El vale fue cancelado",
            icon: "success"
          });
        }
      });
    }
  }

  public cancelEntryByDepotChange(){
    this.materials = []
    this.materialSelected = {}
    this.materialsSelected = []
    this.quantityRequired = 1;
    this.selectedDepot = null;
  }

  public openDialog(material?: Entry): void {
    this.entryDialog = true;
    this.materialSelected.material = material?.material;
    this.materialSelected.status = material?.status;
  }

  public cancelSelection(): void {
    this.materialSelected = {};
    this.quantityRequired = 1;
    this.entryDialog = false;
  }

  public addMaterial(){
    if(this.materialsSelected && this.materialsSelected.length <= 15){
      const exists = this.materialsSelected.
      some(item => item.material.idMaterial === this.materialSelected.material.idMaterial
        && item.status.status === this.materialSelected.status.status);
      if(exists){
        this.entryDialog = false;
        Swal.fire({
          icon: "error",
          title: "Registro duplicado",
          text: "Este material ya fue añadido, seleccione otro"
        });
        return;
      }
      if(this.materialSelected && this.quantityRequired > 0 ){
        this.materialSelected.quantity = this.quantityRequired;
        this.materialsSelected = [...this.materialsSelected, this.materialSelected];
        this.cancelSelection();
        Swal.fire({
          title: "Maintenance añadido",
          icon: "success",
          draggable: true
        });
      }
    } else {
      this.cancelSelection()
      Swal.fire({
        icon: "error",
        title: "Algo salió mal",
        text: "Solo se permiten 16 materiales por vale de entrada"
      });
    }
  }

  public deleteMaterialSelected(material: EntryMaterial){
    if(material){
      this.materialsSelected = this.materialsSelected.filter(item => item.idMaterialManagementMaterial !== material.idMaterialManagementMaterial);
      Swal.fire({
        title: "Maintenance eliminado",
        icon: "error",
        draggable: true
      });
    }
  }

  public generateEntry(){
    if(this.materialsSelected && this.materialsSelected.length > 0){
      this.confirmedEntry.userDispatcher = this.userData;
      this.confirmedEntry.depot = this.selectedDepot;
      this.confirmedEntry.materialList = this.materialsSelected;
      this.getUsers();
      this.voucherDialog = true;
    } else {
      Swal.fire({
        text: "No es posible generar un vale sin material",
        icon: "warning"
      });
    }
  }

  public cancelConfirmation() {
    this.confirmedEntry = {};
    this.voucherDialog = false;
  }

  public confirmEntry(){
    if(this.validateEntryData()){
      let entryToSave: ConfirmedEntry = {
        depot: this.selectedDepot,
        userDispatcher: this.userData,
        userReceiver: this.confirmedEntry.userReceiver,
        comment: this.confirmedEntry.comment,
        date: new Date(),
        io: true,
        materialList: this.materialsSelected
      }

      let entryRequest: EntryRequest = {
          modelRequest: entryToSave,
          user: this.userData
      }

      this.entryService.create(entryRequest).subscribe({
        next: (data) => {
          Swal.fire({
            title: "Entrada de material exitosa",
            icon: "success",
            draggable: true
          });
          this.generatePDF(data);
          this.cancelEntryByDepotChange();
          this.cancelConfirmation();
        },
        error: (err) => {
          Swal.fire({
            text: "Ocurrió un error al guardar el vale, intente nuevamente.",
            icon: "error"
          });
        },
      });
    }
  }

  public validateEntryData(): boolean {
    if(this.confirmedEntry && !this.confirmedEntry.userDispatcher || !this.confirmedEntry.userReceiver){
      Swal.fire({
        text: "Es necesario seleccionar el usuario que despacha y el que recibe el material",
        icon: "warning"
      });
      return false;
    }
    if(this.confirmedEntry.userDispatcher.name === this.confirmedEntry.userReceiver.name){
      Swal.fire({
        text: "El usuario que despacha y el que recibe no pueden ser la misma persona",
        icon: "warning"
      });
      return false;
    }
    return true;
  }

  async generatePDF(confirmedEntry: ConfirmedEntry): Promise<void> {
    const datos = [
      { text: confirmedEntry.depot.name, x: 162, y: 142 },
      { text: confirmedEntry.depot.key, x: 710, y: 111, size: 8 },
      { text: this.getCurrentDay(), x: 660, y: 152 },
      { text: this.getCurrentMonth(), x: 700, y: 152 },
      { text: this.getCurrentYear(), x: 735, y: 152 },
      { text: confirmedEntry.folio, x: 654, y: 184 },
      { text: confirmedEntry.userReceiver.area.name, x: 70, y: 182, size: 7 },
      { text: confirmedEntry.userDispatcher.name, x: 610, y: 485, size: 7 },
      { text: confirmedEntry.userReceiver.name, x: 95, y: 485, size: 7 },
    ];

    let startY = 236;
    for (let i = 0; i < confirmedEntry.materialList.length; i++) {
      datos.push({
        text: confirmedEntry.materialList[i].material.description,
        x: 264,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: confirmedEntry.materialList[i].material.unit.name,
        x: 487,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].status.status),
        x: 523,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: String(confirmedEntry.materialList[i].quantity),
        x: 582,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
      datos.push({
        text: writtenNumber(confirmedEntry.materialList[i].quantity, { lang: 'es' }),
        x: 610,
        y: startY + (i * 12) - 3.5,
        size: 7
      });
    }
    const pdfBytes = await this.pdfService.fillPdfFromTemplate('assets/formatoEntrada.pdf', datos);
    this.pdfService.openPdfInBrowser(pdfBytes);
  }

  getCurrentDay(): string {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(new Date());
  }

  getCurrentMonth(): string {
    return new Intl.DateTimeFormat('es-ES', { month: '2-digit' }).format(new Date());
  }

  getCurrentYear(): string {
    const today = new Date();
    return today.getFullYear().toString();
  }
}
