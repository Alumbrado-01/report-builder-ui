import { Observable } from 'rxjs';
import { Entry } from '../../domain/object/entry';
import {EntryRequest} from "../../domain/api/entryRequest";
import {ConfirmedEntry} from "../../domain/object/confirmedEntry";
import {ReportRequest} from "../../../pdfmake/domain/api/reportRequest";

export abstract class IEntryService {

  abstract findAll(): Observable<Entry[]>;
  abstract findByDepotId(id: number): Observable<Entry[]>;
  abstract create(entry: EntryRequest): Observable<ConfirmedEntry>;
  abstract findReport(reportRequest: ReportRequest): Observable<ConfirmedEntry[]>;
  abstract findByMaterialId(id: number): Observable<Entry[]>;
}
