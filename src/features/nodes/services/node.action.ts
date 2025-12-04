"use server";

import { apiFetch } from "@/lib/api-fetch";
import { revalidateTag } from "next/cache";

export const killNode = async (id: number): Promise<void> => {
  const response = await apiFetch<void>(`/node/${id}/kill`, {
    method: "POST",
  });
  if (!response.success) {
    throw new Error(response.message || "Failed to kill node");
  }
  revalidateTag("node", "max");
};

export const reviveNode = async (id: number): Promise<void> => {
  const response = await apiFetch<void>(`/node/${id}/revive`, {
    method: "POST",
  });
  if (!response.success) {
    throw new Error(response.message || "Failed to revive node");
  }
  revalidateTag("node", "max");
};

