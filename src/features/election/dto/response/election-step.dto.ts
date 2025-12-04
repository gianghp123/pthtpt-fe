import { ElectionStepType } from "@/lib/enums/election-step-type.enum";

export interface ElectionStepDto {
  nodeId: number;
  message: string;
  type: ElectionStepType;
}