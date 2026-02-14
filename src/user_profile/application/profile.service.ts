import { Injectable } from '@angular/core';
import { Profile } from '../domain/object/profile';
import { ProfileWebServiceImplements } from '../infrestructure/output_adapters/profileWebServiceImplements';
import { catchError, map, Observable, of } from 'rxjs';
import { IProfileService } from '../infrestructure/input_ports/IProfileService';
import { ProfileRequest } from '../domain/api/profileRequest';
import { UserRequest } from '../../user/domain/api/userRequest';
import { User } from '../../user/domain/object/user';

@Injectable({
  providedIn: 'root',
})
export class profileService implements IProfileService {
  public profile!: Profile;
  public profileList: Profile[] = [];

  constructor(private readonly service: ProfileWebServiceImplements) {
    // super();
  }

  create(request: ProfileRequest): Observable<Profile> {
    return this.service.create(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Profile);
      })
    );
  }

  update(request: ProfileRequest): Observable<Profile> {
    return this.service.update(request).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Profile);
      })
    );
  }

  findAll(): Observable<Profile[]> {
    return this.service.findAll().pipe(
      map((response) => (this.profileList = response)),
      catchError((e) => {
        console.error(e);
        return of([] as Profile[]);
      })
    );
  }

  findById(id: number): Observable<Profile> {
    return this.service.findById(id).pipe(
      map((response) => (this.profile = response)),
      catchError((e) => {
        console.error(e);
        return of({} as Profile);
      })
    );
  }
}
