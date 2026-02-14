import { Injectable } from '@angular/core';
import { Activity } from '../domain/object/activity';
import { ActivityWebServiceImplements } from '../infrestructure/output_adapters/activityWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IActivityService } from '../infrestructure/input_ports/IActivityService';
import { ActivityRequest } from '../domain/api/activityRequest';

@Injectable({
  providedIn: 'root',
})
export class ActivityService implements IActivityService {

  public profile: Activity;
  public profileList: Activity[] = [];

  constructor(
    private readonly service: ActivityWebServiceImplements
  ) {}

  create(request: ActivityRequest): Observable<Activity> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Activity);
      })
    );
  }

  update(request: ActivityRequest): Observable<Activity> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Activity);
      })
    );
  }

  findAll(): Observable<Activity[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Activity[]);
      })
    );
  }

  findById(id: number): Observable<Activity> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Activity);
      })
    );
  }
}
