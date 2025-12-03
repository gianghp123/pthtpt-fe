export interface ElectionStepDto {
  nodeId: number;
  message: string;
  type: 'candidate' | 'election' | 'victory';
}