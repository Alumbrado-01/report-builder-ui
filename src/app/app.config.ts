import { provideHttpClient, withFetch } from '@angular/common/http';
import { IMaterialWebService } from '../material/infrestructure/output_ports/IMaterialWebService';
import { MaterialWebServiceImplements } from '../material/infrestructure/output_adapters/materialWebServiceImplement';
import { IMaterialService } from '../material/infrestructure/input_ports/IMaterialService';
import { MaterialService } from '../material/application/material.service';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { IDepotWebService } from '../depot/infrestructure/output_ports/IDepotWebService';
import { DepotWebServiceImplements } from '../depot/infrestructure/output_adapters/depotWebServiceImplemets';
import { IDepotService } from '../depot/infrestructure/input_ports/IDepotService';
import { DepotService } from '../depot/application/depot.service';
import { AreaWebServiceImplements } from '../area/infrestructure/output_adapters/areaWebServiceImplements';
import { AreaService } from '../area/application/area.service';
import { IAreaWebService } from '../area/infrestructure/output_ports/IAreaWebService';
import { IAreaService } from '../area/infrestructure/input_ports/IAreaService';
import {IApplicantService} from "../applicant/infrestructure/input_ports/IApplicantService";
import {ApplicantService} from "../applicant/application/applicant.service";
import {ILogService} from "../log/infrestructure/input_ports/ILogService";
import {LogService} from "../log/application/log.service";
import {ILoginService} from "../login/infrestructure/input_ports/ILoginService";
import {LoginService} from "../login/application/login.service";
import {IRoadService} from "../road/infrestructure/input_ports/IRoadService";
import {RoadService} from "../road/application/road.service";
import {IMayoraltyService} from "../mayoralty/infrestructure/input_ports/IMayoraltyService";
import {MayoraltyService} from "../mayoralty/application/mayoralty.service";
import {IActivityService} from "../activity/infrestructure/input_ports/IActivityService";
import {ActivityService} from "../activity/application/activity.service";
import {TypeService} from "../type/application/type.service";
import {ITypeService} from "../type/infrestructure/input_ports/ITypeService";
import {IProgramService} from "../program/infrestructure/input_ports/IProgramService";
import {ProgramService} from "../program/application/program.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    { provide: IMaterialWebService, useClass: MaterialWebServiceImplements },
    { provide: IMaterialService, useClass: MaterialService },
    { provide: IDepotWebService, useClass: DepotWebServiceImplements },
    { provide: IDepotService, useClass: DepotService },
    { provide: IAreaWebService, useClass: AreaWebServiceImplements },
    { provide: IAreaService, useClass: AreaService },
    { provide: IApplicantService , useClass: ApplicantService },
    { provide: ILogService, useClass: LogService },
    { provide: ILoginService, useClass: LoginService },
    { provide: IRoadService, useClass: RoadService},
    { provide: IMayoraltyService, useClass: MayoraltyService},
    { provide: IActivityService, useClass: ActivityService},
    { provide: IMayoraltyService, useClass: MayoraltyService},
    { provide: ITypeService, useClass: TypeService},
    { provide: IProgramService, useClass: ProgramService},
  ],
};
