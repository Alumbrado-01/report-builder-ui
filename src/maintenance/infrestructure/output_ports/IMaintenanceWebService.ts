import { Observable } from 'rxjs';
import { Maintenance } from '../../domain/object/maintenance';
import { MaintenanceRequest } from '../../domain/api/maintenanceRequest';
import {User} from "../../../user/domain/object/user";

export interface IMaintenanceWebService {
  create(request: MaintenanceRequest): Observable<Maintenance>;
  update(request: MaintenanceRequest): Observable<Maintenance>;
  findAll(): Observable<Maintenance[]>;
  findById(id: number): Observable<Maintenance>;
  findByUser(user: User): Observable<Maintenance[]>;
}
