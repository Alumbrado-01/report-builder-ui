import { Injectable } from '@angular/core';
import { Log } from '../domain/object/log';
import { LogWebServiceImplements } from '../infrestructure/output_adapters/logWebServiceImplements';
import { map, Observable } from 'rxjs';
import { ILogService } from '../infrestructure/input_ports/ILogService';
import { ILogWebService } from '../infrestructure/output_ports/ILogWebService';
import { LogRequest } from '../domain/api/logRequest';

@Injectable({
  providedIn: 'root',
})
export class LogService implements ILogService {
  public log: Log | undefined;
  public logList: Log[] = [];

  public constructor(private readonly service: LogWebServiceImplements) {}

  public create(request: LogRequest): Observable<Log> {
    const serviceInstance: ILogWebService = this.service;
    return serviceInstance.create(request).pipe(
      map((response) => {
        this.log = response;
        return this.log;
      })
    );
  }

  public update(request: LogRequest): Observable<Log> {
    const serviceInstance: ILogWebService = this.service;
    return serviceInstance.update(request).pipe(
      map((response) => {
        this.log = response;
        return this.log;
      })
    );
  }

  public findAll(): Observable<Log[]> {
    const serviceInstance: ILogWebService = this.service;
    return serviceInstance.findAll().pipe(
      map((response) => {
        this.logList = response;
        return this.logList;
      })
    );
  }

  findById(id: number): Observable<Log> {
    const serviceInstance: ILogWebService = this.service;
    return serviceInstance.findById(id).pipe(
      map((response) => {
        this.log = response;
        return this.log;
      })
    );
  }

  findByTableAndEntity(table:string, entity:number): Observable<Log[]> {
    const serviceInstance: ILogWebService = this.service;
    return serviceInstance.findByTableAndEntity(table, entity).pipe(
      map((response) => {
        this.logList = response;
        return this.logList;
      })
    );
  }
}
