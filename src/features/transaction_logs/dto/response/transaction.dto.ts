import { ActionType } from "@/lib/enums/action-type.enum";

export interface TransactionDto {
  id: number;
  timestamp: string;
  nodeId: number;
  actionType: ActionType;
  description: string;
}
