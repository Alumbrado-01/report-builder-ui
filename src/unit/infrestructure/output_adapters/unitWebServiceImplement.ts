import { Injectable } from '@angular/core';
import { IUnitWebService } from '../output_ports/IUnitWebService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import unitRest from '../../domain/api/unitRest';
import { Unit } from '../../domain/object/unit';
import { Observable, map } from 'rxjs';
import { UnitRequest } from '../../domain/api/unitRequest';
import { TokenService } from '../../../app/Services/autenticationService/tokenService';

type UnitRestDTO = {
  idUnit: number;
  name: string;
  active: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class UnitWebServiceImplements implements IUnitWebService {
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

  private readonly restToDomain = (r: UnitRestDTO): Unit => {
    return {
      idUnit: r.idUnit,
      name: r.name,
      active: r.active,
    };
  };

  create(request: UnitRequest): Observable<Unit> {
    return this.http
      .post<UnitRestDTO>(unitRest.unitService.SAVE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  update(request: UnitRequest): Observable<Unit> {
    return this.http
      .put<UnitRestDTO>(unitRest.unitService.UPDATE, request, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }

  findAll(): Observable<Unit[]> {
    return this.http
      .get<UnitRestDTO[]>(unitRest.unitService.FIND_ALL, {
        headers: this.headers(),
      })
      .pipe(map((units) => units.map(this.restToDomain)));
  }

  findById(id: number): Observable<Unit> {
    return this.http
      .get<UnitRestDTO>(`${unitRest.unitService.FIND_BY_ID}/${id}`, {
        headers: this.headers(),
      })
      .pipe(map(this.restToDomain));
  }
}
