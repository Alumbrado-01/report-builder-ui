import { Observable } from 'rxjs';
import { Maintenance } from '../../domain/object/maintenance';
import { MaintenanceRequest } from '../../domain/api/maintenanceRequest';

export abstract class IMaintenanceService {
  abstract create(request: MaintenanceRequest): Observable<Maintenance>;
  abstract update(request: MaintenanceRequest): Observable<Maintenance>;
  abstract findAll(): Observable<Maintenance[]>;
  abstract findById(id: number): Observable<Maintenance>;
}
