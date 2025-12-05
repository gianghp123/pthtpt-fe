"use server";

import { SystemService } from "./system.service";
import { ToggleSystemRequestDto } from "../dto/request/toggle-system.dto";

export const toggleSystemAction = async (dto: ToggleSystemRequestDto) => {
  try {
    await SystemService.toggle(dto);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};