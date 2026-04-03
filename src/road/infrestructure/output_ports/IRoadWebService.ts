import { Observable } from 'rxjs';
import { Road } from '../../domain/object/road';
import { RoadRequest } from '../../domain/api/roadRequest';
import {RoadByZoneRequest} from "../../domain/api/roadByZoneRequest";

export abstract class IRoadWebService {
  abstract create(request: RoadRequest): Observable<Road>;
  abstract update(request: RoadRequest): Observable<Road>;
  abstract findAll(): Observable<Road[]>;
  abstract findById(id: number): Observable<Road>;
  abstract getRoadsByZoneAndType(request: RoadByZoneRequest): Observable<Road[]>;
}
