export interface ElectionRecordDto {
  id: number;
  timestamp: string;
  oldLeaderId: number | null;
  newLeaderId: number;
  candidates: number[];
  reason: string;
}
