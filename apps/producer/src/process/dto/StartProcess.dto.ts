export class ProcessDataDetails {
  time?: number;
  latitude?: number;
  longitude?: number;
  speed?: number;
}

export class StartProcessDto {
  deviceId: string;
  details: ProcessDataDetails[];
  RecordedDate: number;
}
