import { Observable } from 'rxjs';
import { Activity } from '../../domain/object/activity';
import { ActivityRequest } from '../../domain/api/activityRequest';

export abstract class IActivityService {
  abstract create(request: ActivityRequest): Observable<Activity>;
  abstract update(request: ActivityRequest): Observable<Activity>;
  abstract findAll(): Observable<Activity[]>;
  abstract findById(id: number): Observable<Activity>;
}
