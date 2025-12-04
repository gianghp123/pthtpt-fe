import { apiFetch } from "@/lib/api-fetch";
import { NodeDto } from "../dto/response/node.dto";

export const getAllNodes = async (): Promise<NodeDto[]> => {
  const response = await apiFetch<NodeDto[]>("/node", {
    next: {
      tags: ["node"],
    },
  });
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch nodes");
  }
  return response.data;
};
