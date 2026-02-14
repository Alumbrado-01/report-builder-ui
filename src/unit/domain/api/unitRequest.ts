interface UnitRequestData {
  idUnit: number;
  name: string;
  active: boolean;
}

export interface UnitRequest {
  modelRequest?: UnitRequestData;
}
