import { Injectable } from '@angular/core';
import { IProfileWebService } from '../output_ports/IProfileWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import profileRest from '../../domain/api/profileRest';
import { Profile } from '../../domain/object/profile';
import { Observable, map } from 'rxjs';
import { ProfileRequest } from '../../domain/api/profileRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

type ProfileRestDTO = {
  idProfile: number;
  profile: string;
  active: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ProfileWebServiceImplements implements IProfileWebService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private headers(): HttpHeaders {
    const token = this.tokenService.getToken();
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      h = h.append('Authorization', `Bearer ${token}`);
    }
    return h;
  }

  private readonly restToDomain = (r: ProfileRestDTO): Profile => {
    return {
      idProfile: r.idProfile,
      profile: r.profile,
      active: r.active,
    };
  };

  create(request: ProfileRequest): Observable<Profile> {
    return this.http
      .post<ProfileRestDTO>(profileRest.profileService.SAVE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  update(request: ProfileRequest): Observable<Profile> {
    return this.http
      .put<ProfileRestDTO>(profileRest.profileService.UPDATE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  findAll(): Observable<Profile[]> {
    return this.http
      .get<ProfileRestDTO[]>(profileRest.profileService.FIND_ALL, {
        headers: this.headers(),
      })
      .pipe(map((profiles) => profiles.map(this.restToDomain)));
  }

  findById(id: number): Observable<Profile> {
    return this.http
      .get<ProfileRestDTO>(`${profileRest.profileService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }
}
